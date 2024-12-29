/**
 * API Slice Configuration
 * 
 * This file configures the Redux Toolkit Query API slice for handling all API interactions.
 * It sets up the base configuration and defines endpoints for authentication, posts, likes, and comments.
 */

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

/**
 * Main API slice configuration using Redux Toolkit Query
 */
export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://backend-gamma-hazel.vercel.app/api",
    // Add authorization header if token exists
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token;
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Post", "User"],

  endpoints: (builder) => ({
    /**
     * Login endpoint
     * Authenticates user credentials
     */
    login: builder.mutation({
      query: (body) => ({
        url: "/auth/login",
        method: "POST",
        body,
      }),
    }),

    /**
     * Register endpoint
     * Creates new user account
     */
    register: builder.mutation({
      query: (body) => ({
        url: "/auth/register",
        method: "POST",
        body,
      }),
    }),

    /**
     * Get Posts endpoint
     * Fetches paginated posts with infinite scroll support
     */
    getPosts: builder.query({
      query: (page) => `/posts?page=${page}`,
      providesTags: ["Post"],
      // Serialize query args to enable proper caching
      serializeQueryArgs: ({ endpointName }) => {
        return endpointName;
      },
      // Merge new items with existing cache for infinite scroll
      merge: (currentCache, newItems, { arg: currentPage }) => {
        if (currentPage !== 1) {
          if (!currentCache) return newItems;
          return {
            ...newItems,
            posts: [...currentCache.posts, ...newItems.posts],
            pagination: newItems.pagination,
          };
        }
        return newItems;
      },
      // Force refetch when page number changes
      forceRefetch({ currentArg, previousArg }) {
        return currentArg !== previousArg;
      },
    }),

    /**
     * Add Post endpoint
     * Creates a new post and updates the cache
     */
    addPost: builder.mutation({
      query: (post) => ({
        url: "/posts",
        method: "POST",
        body: post,
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          // Reset API state and refetch posts after successful creation
          dispatch(apiSlice.util.resetApiState());
          dispatch(apiSlice.endpoints.getPosts.initiate(1));
        } catch (error) {
          console.error("Failed to add post:", error);
        }
      },
    }),

    /**
     * Like Post endpoint
     * Toggles like status on a post with optimistic updates
     */
    likePost: builder.mutation({
      query: (id) => ({
        url: `/posts/${id}/like`,
        method: "POST",
      }),
      async onQueryStarted(postId, { dispatch, queryFulfilled, getState }) {
        const userId = getState().auth.user._id;
        // Optimistically update the likes array
        const updates = dispatch(
          apiSlice.util.updateQueryData("getPosts", undefined, (draft) => {
            const post = draft.posts.find((p) => p._id === postId);
            if (post) {
              const isLiked = post.likes.includes(userId);
              if (isLiked) {
                post.likes = post.likes.filter((id) => id !== userId);
              } else {
                post.likes.push(userId);
              }
            }
          })
        );

        try {
          await queryFulfilled;
        } catch {
          updates.undo();
        }
      },
    }),

    /**
     * Delete Post endpoint
     * Removes a post with optimistic updates
     */
    deletePost: builder.mutation({
      query: (id) => ({
        url: `/posts/${id}`,
        method: "DELETE",
      }),
      async onQueryStarted(postId, { dispatch, queryFulfilled }) {
        // Optimistically remove post from cache
        const updates = dispatch(
          apiSlice.util.updateQueryData("getPosts", undefined, (draft) => {
            draft.posts = draft.posts.filter((post) => post._id !== postId);
          })
        );

        try {
          await queryFulfilled;
        } catch {
          updates.undo();
        }
      },
    }),

    /**
     * Add Comment endpoint
     * Adds a comment to a post with optimistic updates
     */
    addComment: builder.mutation({
      query: ({ postId, comment }) => ({
        url: `/posts/${postId}/comment`,
        method: "POST",
        body: {
          content: comment.content,
          user: comment.user,
        },
      }),
      async onQueryStarted(
        { postId, comment },
        { dispatch, queryFulfilled, getState }
      ) {
        const user = getState().auth.user;
        // Optimistically add comment to cache
        const updates = dispatch(
          apiSlice.util.updateQueryData("getPosts", undefined, (draft) => {
            const post = draft.posts.find((p) => p._id === postId);
            if (post) {
              post.comments.push({
                content: comment.content,
                user: {
                  _id: user._id,
                  username: user.username,
                },
              });
            }
          })
        );

        try {
          await queryFulfilled;
        } catch {
          updates.undo();
        }
      },
    }),
  }),
});

/**
 * Export generated hooks for use in components
 */
export const {
  useLoginMutation,
  useRegisterMutation,
  useGetPostsQuery,
  useAddPostMutation,
  useUpdatePostMutation,
  useDeletePostMutation,
  useLikePostMutation,
  useAddCommentMutation,
} = apiSlice;

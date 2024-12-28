import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://backend-gamma-hazel.vercel.app/api",
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
    login: builder.mutation({
      query: (body) => ({
        url: "/auth/login",
        method: "POST",
        body,
      }),
    }),

    register: builder.mutation({
      query: (body) => ({
        url: "/auth/register",
        method: "POST",
        body,
      }),
    }),

    getPosts: builder.query({
      query: (page) => `/posts?page=${page}`,
      providesTags: ["Post"],
      serializeQueryArgs: ({ endpointName }) => {
        return endpointName;
      },
      merge: (currentCache, newItems, { arg: currentPage }) => {
        // Only merge if it's not page 1
        if (currentPage !== 1) {
          if (!currentCache) return newItems;
          return {
            ...newItems,
            posts: [...currentCache.posts, ...newItems.posts],
            pagination: newItems.pagination,
          };
        }
        // For page 1, return new items directly without merging
        return newItems;
      },
      forceRefetch({ currentArg, previousArg }) {
        return currentArg !== previousArg;
      },
    }),

    addPost: builder.mutation({
      query: (post) => ({
        url: "/posts",
        method: "POST",
        body: post,
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          // Clear the entire cache
          dispatch(apiSlice.util.resetApiState());
          // Refetch page 1
          dispatch(apiSlice.endpoints.getPosts.initiate(1));
        } catch (error) {
          console.error("Failed to add post:", error);
        }
      },
      // invalidatesTags: ['Post'],
    }),

    likePost: builder.mutation({
      query: (id) => ({
        url: `/posts/${id}/like`,
        method: "POST",
      }),
      async onQueryStarted(postId, { dispatch, queryFulfilled, getState }) {
        const userId = getState().auth.user._id;

        // Get all getPosts cache entries
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

    deletePost: builder.mutation({
      query: (id) => ({
        url: `/posts/${id}`,
        method: "DELETE",
      }),
      async onQueryStarted(postId, { dispatch, queryFulfilled }) {
        // Optimistically remove post from all cached pages
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

        // Optimistically add comment to all cached pages
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

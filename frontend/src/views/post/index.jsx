/**
 * Post and PostList Components
 * 
 * This file contains two main components:
 * 1. Post - Renders individual post with likes, comments and actions
 * 2. PostList - Renders a list of posts with infinite scroll and new post creation
 */

import React, { useState, useCallback } from "react";
import {
  useDeletePostMutation,
  useLikePostMutation,
  useAddCommentMutation,
  useGetPostsQuery,
  useAddPostMutation,
} from "../../slice/apiSlice";
import { useSelector } from "react-redux";
import "./post.scss";
import IntersectionObserverComponent from "../../components/intersectionObserver";
import { Heart, MessageCircle, Trash2 } from "lucide-react";
import PostSkeleton from "../../components/skelton";
import Header from "../../components/header";

/**
 * Post Component - Renders an individual post with all its interactions
 * @param {Object} props - Component props
 * @param {Object} props.post - Post data including content, likes, comments
 * @param {Object} props.user - Current user data
 * @returns {JSX.Element} Individual post component
 */
const Post = ({ post, user }) => {
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");

  const [likePost] = useLikePostMutation();
  const [addComment] = useAddCommentMutation();
  const [deletePost] = useDeletePostMutation();

  /**
   * Handles liking/unliking a post
   */
  const handleLike = async () => {
    try {
      await likePost(post._id);
    } catch (err) {
      console.error("Failed to like post:", err);
    }
  };

  /**
   * Handles post deletion
   */
  const handleDelete = async () => {
    try {
      await deletePost(post._id);
    } catch (err) {
      console.error("Failed to delete post:", err);
    }
  };

  /**
   * Handles adding a new comment to the post
   * @param {Event} e - Form submit event
   */
  const handleComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    try {
      await addComment({
        postId: post._id,
        comment: {
          content: commentText,
          user: user?._id,
        },
      }).unwrap();

      setCommentText("");
      setShowComments(true);
    } catch (err) {
      console.error("Failed to add comment:", err);
    }
  };

  const isLiked = post.likes.find((id) => id === user._id);

  return (
    <div className="post-container">
      <div className="post-header">
        <div className="user-avatar">
          {post.user?.username?.[0].toUpperCase()}
        </div>
        <span className="username">{post.user?.username}</span>
      </div>

      <div className="post-content">
        <p>{post.content}</p>
      </div>

      <div className="post-actions">
        <button
          onClick={handleLike}
          className={`like-btn ${isLiked ? "liked" : ""}`}
        >
          <Heart fill={isLiked ? "#ed4956" : "none"} />
        </button>
        <button>
          <MessageCircle />
        </button>
        {post.user._id === user._id && (
          <button onClick={handleDelete}>
            <Trash2 />
          </button>
        )}
      </div>

      <div className="likes-count">{post.likes?.length || 0} likes</div>

      <div className="comments-section">
        {post.comments?.length > 0 && (
          <div
            className="view-comments"
            onClick={() => setShowComments(!showComments)}
          >
            View all {post.comments.length} comments
          </div>
        )}

        {showComments && (
          <div className="comment-list">
            {post.comments?.map((comment, index) => (
              <div key={index} className="comment-item">
                <span className="username">{comment.user?.username}</span>
                <span className="comment">{comment.content}</span>
              </div>
            ))}
          </div>
        )}

        <form onSubmit={handleComment} className="comment-form">
          <input
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Add a comment..."
          />   
          <button type="submit" disabled={!commentText.trim()}>
            Post
          </button>
        </form>
      </div>
    </div>
  );
};

/**
 * PostList Component - Renders a list of posts with infinite scroll
 * Includes functionality to create new posts
 * @returns {JSX.Element} Post list component
 */
const PostList = () => {
  const [page, setPage] = useState(1);
  const [addPost, { isLoading: isPosting }] = useAddPostMutation();
  const { data: posts, isLoading, isError } = useGetPostsQuery(page);
  const { user } = useSelector((state) => state.auth);
  const [postText, setPostText] = useState("");

  /**
   * Handles loading more posts when scrolling
   */
  const loadMore = useCallback(() => {
    if (!isLoading && posts?.pagination?.hasNextPage) {
      setPage((prev) => prev + 1);
    }
  }, [isLoading, posts?.pagination?.hasNextPage]);

  /**
   * Handles creating a new post
   * @param {Event} e - Form submit event
   */
  const handlePost = async (e) => {
    e.preventDefault();
    if (!postText.trim()) return;

    try {
      await addPost({
        content: postText,
        user: user?._id,
      }).unwrap();

      setPostText("");
    } catch (err) {
      console.error("Failed to add comment:", err);
    }
  };

  if (isError) return <div>Error loading posts</div>;

  return (
    
    <div className="mainRoot">
      <Header/>
      <div className="post">
        <form onSubmit={handlePost} className="post-container">
          <textarea
            value={postText}
            onChange={(e) => setPostText(e.target.value)}
            rows="5"
            cols="33"
            placeholder="What's in your Mind"
          />
          <button type="submit" disabled={!postText.trim()}>
            {isPosting ? 'Posting...' : 'POST'}
          </button>
        </form>
      </div>
      <div className="postPage">
        {isLoading ? (
          <PostSkeleton />
        ) : (
          <IntersectionObserverComponent
            next={loadMore}
            hasMore={posts?.pagination?.hasNextPage}
          >
            {posts?.posts?.map((post) => (
              <Post key={post._id} post={post} user={user} />
            ))}
          </IntersectionObserverComponent>
        )}
      </div>
    </div>
  );
};

export default PostList;

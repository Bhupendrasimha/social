/**
 * PostSkeleton Component
 * 
 * A loading placeholder component that displays skeleton UI elements while post content is being fetched.
 * Renders multiple skeleton post cards with animated loading effects for various post elements
 * like avatar, username, content, actions, likes and comment box.
 */

import './skelton.scss'

/**
 * PostSkeleton renders skeleton loading UI for posts
 * @returns {JSX.Element} Skeleton loading UI component with multiple post placeholders
 */
const PostSkeleton = () => {
    return (<div className='skelton'>
        {[1, 2, 3].map((i) => (
      <div className="skeleton-post" key={i}>
        <div className="skeleton-header">
          <div className="skeleton-avatar"></div>
          <div className="skeleton-username"></div>
        </div>
        
        <div className="skeleton-content"></div>
        
        <div className="skeleton-actions">
          <div className="skeleton-action"></div>
          <div className="skeleton-action"></div>
          <div className="skeleton-action"></div>
        </div>
        
        <div className="skeleton-likes"></div>
        
        <div className="skeleton-comment-box"></div>
      </div>
       ))}
           </div>
    );
  };

export default PostSkeleton;
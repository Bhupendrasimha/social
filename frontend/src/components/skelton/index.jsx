import './skelton.scss'

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
  export default PostSkeleton
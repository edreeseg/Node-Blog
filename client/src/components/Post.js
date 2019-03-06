import React from 'react';

const Post = props => {
  return (
    <div className="post-container">
      <div className="post-author">
        <p>{props.data.postedBy}</p>
        <span className="post-id">#{props.data.id}</span>
      </div>
      <div className="post-content">
        <p>{props.data.text}</p>
      </div>
    </div>
  );
};

export default Post;

import React from 'react';

const Post = props => {
  return (
    <div>
      <p>ID: {props.data.id}</p>
      <p>Posted By: {props.data.postedBy}</p>
      <p>Text: {props.data.text}</p>
    </div>
  );
};

export default Post;

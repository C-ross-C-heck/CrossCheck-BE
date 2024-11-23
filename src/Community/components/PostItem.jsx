// src/Community/components/PostItem.jsx
import React from 'react';

const PostItem = ({ number, title, writer, date, views, likes, comments }) => {
  return (
    <div className="post-item">
      <div className="post-number">{number}</div>
      <div className="post-title">{title}</div>
      <div className="post-writer">{writer}</div>
      <div className="post-date">{date}</div>
      <div className="post-views">{views}</div>
      <div className="post-likes">{likes}</div>
      <div className="post-comments">{comments}</div>
    </div>
  );
};

export default PostItem;
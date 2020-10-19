import React from 'react';

function BlogFeed ({ posts }) {
  return (
    <div>
      {posts.map((post) => (
        <div className="m-2">
          <h1 className="mb-3">{post.title}</h1>
          <p> {post.content} </p>
          <p> Posted By {post.posted_by} </p>
          <p> Created At {new Date(post.created_at).toString()} </p>
        </div>
      ))}
      Posts: {posts.length}
    </div>
  );
}

export default BlogFeed;
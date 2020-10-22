import React from 'react';

function BlogFeed ({ posts }) {
  console.log(posts)
  return (
    <div>
      {posts.map((post) => <BlogPost key={post.id} post={post} />)}
      Posts: {posts.length}
    </div>
  );
}


function BlogPost({ post: { title, content, posted_by, created_at, tags} }) {
  return <div className="m-2">
    <h1 className="mb-3">{title}</h1>
    <p> {content} </p>
    <p> Posted By {posted_by} </p>
    <p> Created At {new Date(created_at).toString()} </p>
    {
      tags.map(({ title, id }) => {
        return <button key={id} className="btn ml-2" data-id={id}> { title } </button>
      })
    }
  </div>
}

export default BlogFeed;
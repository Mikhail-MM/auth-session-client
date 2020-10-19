import React, { useState, useEffect } from 'react';
import axios from 'axios';

import { parseAxiosError } from '../utils/network/parseAxiosError';

import PostForm from './PostForm';
import BlogFeed from './BlogFeed';

import config from '../config';
const { rootURI } = config;

const postsRequestConfiguration = {
  url: `${rootURI}/posts`,
  method: 'GET',
  withCredentials: true,
};

const tagsRequestConfiguration = {
  url: `${rootURI}/tags`,
  method: 'GET',
  withCredentials: true,
};

function Blog({ toast }) {
  const [posts, setPosts] = useState([]);
  const [tags, setTags] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    if (mounted) setLoading(true);

    axios(postsRequestConfiguration)
      .then(({ data }) => {
        if (mounted) setPosts(data);
      })
      .catch((err) => {
        const parsed = parseAxiosError(err).message;
        if (mounted) setError(parsed);
      })
      .finally(() => setLoading(false));
    return () => (mounted = false);
  }, []);

  useEffect(() => {
    let mounted = true;
    if (mounted) setLoading(true);

    axios(tagsRequestConfiguration)
      .then(({ data }) => {
        if (mounted) setTags(data);
      })
      .catch((err) => {
        const parsed = parseAxiosError(err).message;
        if (mounted) setError(parsed);
      })
      .finally(() => setLoading(false));
    return () => (mounted = false);
  }, []);

  useEffect(() => {
    if (error) {
      toast.current.show({
        sticky: true,
        severity: 'error',
        summary: 'Houson, we have a problem...',
        detail: error,
      });
    }
  }, [toast, error]);

  return (
    <div>
      <h1> Posts </h1>
      <PostForm toast={toast} tags={tags} />
      <BlogFeed
        loading={loading}
        setLoading={setLoading}
        posts={posts}
        toast={toast}
      />
    </div>
  );
}

export default Blog;
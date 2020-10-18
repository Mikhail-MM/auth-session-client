import axios from 'axios';

import { useState, useEffect } from 'react';
import { makeRequest } from '../utils/request';

const source = axios.CancelToken.source();

const useRequest = (request) => {
  const [requestConfiguration, setRequest] = useState(request);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [requestError, setRequestError] = useState(null);

  useEffect(() => {
    let mounted = true;
    if (mounted) setLoading(true);
    makeRequest(requestConfiguration, source)
      .then(data => {
        if (mounted) setData(data);
      }).catch(error=> {
        if (mounted) setRequestError(error);
      }).finally(() => {
        if (mounted) setLoading(false);
      })

      return () => {
        mounted = false;
      };

  }, [requestConfiguration]);

  return [{ data, loading, requestError }, setRequest];
};

export { useRequest };

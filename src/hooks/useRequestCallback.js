import axios from 'axios';

import { useState, useCallback, useEffect } from 'react';
import { makeRequest } from '../utils/network/makeAxiosRequest';

const source = axios.CancelToken.source();

const useRequestCallback = (request) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [requestError, setRequestError] = useState(null);

  const sendRequest = useCallback(() => {
    setLoading(true);
    makeRequest(request, source)
      .then((data) => {
        setData(data);
      })
      .catch((error) => {
        setRequestError(error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [request]);

  useEffect(() => {
    return () => source.cancel('The Component Has Unmounted.');
  }, []);

  return [{ data, loading, requestError }, sendRequest];
};

export { useRequestCallback };

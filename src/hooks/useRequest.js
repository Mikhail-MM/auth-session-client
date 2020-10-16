import axios from 'axios';

import { useState, useEffect } from 'react';
import { makeRequest } from '../utils/request';

const source = axios.CancelToken.source();

const useRequest = (configuration) => {

  const [requestConfig, setRequestConfig] = useState(configuration);
  const [requestState, setRequestState] = useState({
    data: null,
    loading: false,
    error: false,
  });

  useEffect(() => {
    setRequestState((prevState) => ({
      ...prevState,
      loading: true,
    }));

    makeRequest(requestConfig, source)
      .then((data) =>
        setRequestState((prevState) => ({
          ...prevState,
          data,
          loading: false,
        }))
      )
      .catch((error) =>
        setRequestState((prevState) => ({
          ...prevState,
          loading: false,
          error,
        }))
      );

      return () => source.cancel("The Component Has Unmounted.");

  }, [requestConfig]);

  return [requestState, setRequestConfig];
};

export { useRequest };

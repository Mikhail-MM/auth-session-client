import { useState, useEffect } from 'react';
import { makeRequest } from '../utils/request';

const useRequest = (requestConfig) => {
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

    makeRequest(requestConfig)
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
  }, [requestConfig]);

  return requestState;
};

export { useRequest };

import axios from 'axios';

import { parseAxiosError } from './parseAxiosError';

async function makeRequest(
  requestConfig,
  source = axios.cancelToken.source(),
  parsedConfig = parseRequestConfig(requestConfig, source)
) {
  try {
    const { data } = await axios(parsedConfig);
    return data;
  } catch (err) {
    throw parseAxiosError(err);
  }
}

function parseRequestConfig(requestConfig, source) {
  if (typeof requestConfig === 'string') {
    return {
      url: requestConfig,
      method: 'GET',
    };
  } else {
    const { url, method, headers, data } = requestConfig;
    return {
      url: url || 'https://api.example.com',
      method: method || 'GET',
      data: data || {},
      headers: headers || { 'Content-Type': 'application/json' },
      cancelToken: source.token,
    };
  }
}

export { makeRequest };

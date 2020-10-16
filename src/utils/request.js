import axios from 'axios';

async function makeRequest(requestConfig, cancelToken, parsedConfig = parseRequestConfig(requestConfig, cancelToken)) {
  try {
    const { data } = await axios(parsedConfig);
    return data;
  } catch (err) {
    if (err.isAxiosError) {
      const { data } = err.response;
      if (typeof data === 'string') {
        throw new Error(data);
      } else {
        throw new Error(JSON.stringify(data));
      }
    } else throw err;
  }
}

function parseRequestConfig(requestConfig, cancelToken) {
  if (typeof requestConfig === 'string') {
    return {
      url: requestConfig,
      method: 'GET',
    };
  } else {
    const { url, method, params, headers, data } = requestConfig;
    return {
      url: url || 'https://api.example.com',
      method: method || 'GET',
      params: params || {},
      data: data || {},
      headers: headers || { 'Content-Type': 'application/json' },
      cancelToken,
    };
  }
}

export { makeRequest };

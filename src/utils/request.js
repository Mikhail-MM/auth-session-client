import axios from 'axios';

async function makeRequest(arg1, parsedConfig = parseRequestConfig(arg1)) {
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

function parseRequestConfig(arg1) {
  if (typeof arg1 === 'string') {
    return {
      url: arg1,
      method: 'GET',
    };
  } else {
    const { url, method, params, headers, data } = arg1;

    return {
      url: url || 'https://api.example.com',
      method: method || 'GET',
      params: params || {},
      data: data || {},
      headers: headers || { 'Content-Type': 'application/json' }
    };
  }
}

export { makeRequest };

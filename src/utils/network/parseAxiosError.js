const parseAxiosError = (err) => {
  console.log(err);
  if (err.isAxiosError) {
    if (err.response) {
      const { data, status } = err.response;
      console.log(data, status);
      if (typeof data === 'string') {
        return new Error(`[Network Code ${status}] ${data}`);
      } else {
        return new Error(`[Network Code ${status}] ${JSON.stringify(data)}`);
      }
    } else {
      return new Error(`[Network Code ${err.statusCode}] ${err.message}`);
    }
  } else return err;
};

export { parseAxiosError };

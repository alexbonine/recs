
const optionsHandler = (options) => {
  const base = {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  };

  if (!options) {
    return base;
  }

  const opts = Object.assign({}, base, options);

  if (opts.hasOwnProperty('token')) {
    Reflect.deleteProperty(opts, 'token');
    opts.headers.Authorization = `Bearer ${options.token}`;
  }

  Reflect.deleteProperty(opts, 'body');
  if (options.body && Object.getOwnPropertyNames(options.body).length > 0) {
    opts.body = JSON.stringify(options.body);
  }

  return opts;
};

const handleData = (response) => {
  const contentType = response.headers.get('content-type');
  if (contentType.includes('application/json')) {
    return response.json();
  } else if (contentType.includes('text/html')) {
    return response.text();
  } else {
    return Promise.reject({ statusText: `content-type ${contentType} not supported` });
  }
};

const rejectError = (response) => {
  return handleData(response)
    .then((data) => {
      const error = Object.assign({}, {
        data,
        status: response.status,
        statusText: response.statusText,
      });
      return Promise.reject(error);
    });
}

const handleResponse = (response) => {
  if (response.ok) {
    return handleData(response);
  } else {
    return rejectError(response);
  }
};

module.exports = (url = '', options) => {
  return fetch(url, optionsHandler(options))
    .then(handleResponse);
};

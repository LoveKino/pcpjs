const {
  getPcpClient
} = require('../pcp');

module.exports = ({
  path = '/api/pcp',
  loginAuthUrl = '/',
  httpRedirectCodes = [401, 403],
  errNoRedirectCodes = [403],
  options = {}
}) => {
  const callRemote = (text) => {
    const nextOptions = Object.assign({
      credentials: 'same-origin',
      headers: {
        'content-type': 'application/json'
      },
      method: 'POST',
      body: text
    }, options);

    return fetch(path, nextOptions).then((response) => {
      if (httpRedirectCodes.indexOf(response.status) !== -1) { // redirect code
        window.location.href = loginAuthUrl;
        return null;
      } else {
        return response.text().then((txt) => {
          if (response.status === 404) {
            throw new Error(txt || 'resource can not be found');
          } else if (response.status < 200 || response.status >= 400) {
            throw new Error(txt || 'inner server error');
          } else {
            if (txt === null) return null;
            try {
              return JSON.parse(txt);
            } catch (err) {
              throw new Error(
                `Fail to parse response to json. Response text is ${txt}. Request path is ${path}, request options is ${JSON.stringify(options, null, 4)}`
              );
            }
          }
        });
      }
    }).then(({
      errNo,
      errMsg,
      data
    }) => {
      // errNo 403 -> redirect to login
      if (errNoRedirectCodes.indexOf(errNo) !== -1) {
        window.location.href = loginAuthUrl;
      } else {
        if (errNo !== 0) {
          throw new Error(`errorMsg: ${errMsg}, errNo: ${errNo}. Request path is ${path}, request options is ${JSON.stringify(options, null, 4)}`);
        }
        return data;
      }
    });
  };
  const pcpClient = getPcpClient();

  const call = (callResult) => {
    return callRemote(pcpClient.toJson(callResult));
  };

  return {
    callRemote,
    call
  };
};

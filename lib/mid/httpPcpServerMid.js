const {
  getPcpServer
} = require('../pcp');
const {
  resultToResponseBody,
  errorToResponseBody
} = require('./util');

const getReqBody = (req) => {
  return new Promise((resolve, reject) => {
    let body = [];

    req.on('data', (chunk) => {
      body.push(chunk);
    }).on('end', () => {
      resolve(body);
    }).on('error', reject);
  });
};

module.exports = (sandbox, headers = {}) => {
  const pcpServer = getPcpServer(sandbox);

  return async (req, res, attachment) => {
    let responseBody = null;

    try {
      const body = await getReqBody(req);
      const text = Buffer.concat(body).toString();
      const ret = await pcpServer.execute(text, attachment);

      responseBody = JSON.stringify(resultToResponseBody(ret));
    } catch (err) {
      responseBody = JSON.stringify(errorToResponseBody(err));
    }

    for(let k in headers) {
      res.setHeader(k, headers[k]);
    }

    res.end(responseBody);
  };
};

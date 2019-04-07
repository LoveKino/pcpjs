const requestor = require('cl-requestor');

const {
  getPcpClient
} = require('../pcp');

module.exports = ({
  host,
  port,
  path = '/api/pcp'
}) => {
  const httpRequest = requestor('http');

  const callRemote = async (cmdString) => {
    const {
      body
    } = await httpRequest({
      hostname: host,
      port,
      path,
      method: 'POST'
    }, cmdString);

    let result = null;
    try {
      result = JSON.parse(body);
    } catch (err) {
      throw new Error(`fail to parse response body: ${body}`);
    }
    const {
      errno,
      errMsg,
      text
    } = result;
    if (errno === 0) return text;
    throw new Error(`errMsg=${errMsg}, cmdString=${cmdString}`);
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

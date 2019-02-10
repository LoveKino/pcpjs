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

    const {
      errno,
      errMsg,
      text
    } = JSON.parse(body);

    if (errno === 0) return text;
    throw new Error(errMsg);
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

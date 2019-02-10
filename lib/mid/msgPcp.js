const {
  resultToResponseBody,
  errorToResponseBody,
  delay,
  toRequestMsg,
  toResponseMsg,
  REQUEST_TYPE,
  RESPONSE_TYPE
} = require('./util');
const uuidv4 = require('uuid/v4');
const {
  getPcpServer,
  getPcpClient
} = require('../pcp');

module.exports = (sandbox, sendMsg) => {
  const pcpServer = getPcpServer(sandbox);

  const onMsg = async (text, attachment) => {
    const {
      id,
      ctype,
      data
    } = JSON.parse(text);

    switch (ctype) {
      case REQUEST_TYPE:
        // handle request from client
        try {
          sendMsg(JSON.stringify(
            toResponseMsg(id, resultToResponseBody(await pcpServer.execute(data.text, attachment)))
          ));
        } catch (err) {
          sendMsg(JSON.stringify(
            toResponseMsg(id, errorToResponseBody(err))
          ));
        }
        break;

      case RESPONSE_TYPE:
        // get response message from server
        if (!remoteCallMap[id]) {
          throw new Error(`missing-pkt-id: can not find id ${id} in remote call map. Cmd content is ${text}.`);
        } else {
          const {
            resolve,
            reject
          } = remoteCallMap[id];
          delete remoteCallMap[id];
          if (data.errno === 0) {
            resolve(data.text);
          } else {
            reject(new Error(data.errMsg));
          }
        }
    }
  };

  const remoteCallMap = {};

  const callRemote = (text, timeout = 120 * 1000) => {
    const id = uuidv4();
    const cmdText = JSON.stringify(toRequestMsg(id, resultToResponseBody(text)));

    return Promise.race([
      delay(timeout).then(() => {
        throw new Error('pcp timeout');
      }),

      new Promise((resolve, reject) => {
        remoteCallMap[id] = {
          resolve,
          reject
        };
        sendMsg(cmdText);
      })
    ]);
  };

  const pcpClient = getPcpClient();

  const call = (callResult, timeout) => {
    return callRemote(pcpClient.toJson(callResult), timeout);
  };

  return {
    onMsg,
    callRemote,
    call
  };
};

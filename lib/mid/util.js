const resultToResponseBody = (ret) => {
  return {
    errno: 0,
    errMsg: '',
    text: ret
  };
};

const errorToResponseBody = (err) => {
  return {
    errno: 530,
    errMsg: err.message,
    text: null
  };
};

const REQUEST_TYPE = 'purecall-request';
const RESPONSE_TYPE = 'purecall-response';

const toRequestMsg = (id, data) => {
  return {
    id,
    ctype: REQUEST_TYPE,
    data
  };
};

const toResponseMsg = (id, data) => {
  return {
    id,
    ctype: RESPONSE_TYPE,
    data
  };
};

const delay = (t) => {
  return new Promise((resolve, reject) => {
    try {
      setTimeout(() => {
        resolve();
      }, t);
    } catch (err) {
      reject(err);
    }
  });
};

module.exports = {
  resultToResponseBody,
  errorToResponseBody,
  delay,
  toRequestMsg,
  toResponseMsg
};

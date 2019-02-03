function CallResult(result) {
  this.result = result;
}

const getPcpClient = () => {
  const call = (funName, ...args) => {
    return new CallResult(
      [funName].concat(
        args.map((arg) => {
          if (arg instanceof CallResult) {
            return arg.result;
          } else {
            if (Array.isArray(arg)) {
              return ['\''].concat(arg);
            } else {
              return arg;
            }
          }
        })
      )
    );
  };

  const toJson = (callResult) => JSON.stringify(callResult.result);

  return {
    call,
    toJson
  };
};

module.exports = {
  getPcpClient
};

/**
 * sandbox
 *
 * general sandbox function
 *  1. normal sandbox function
 *  2. lazy sandbox function
 */

// general function
// (params: List[Any], attachment: Any, pcpServer: PcpServe) -> Any

const NORMAL_SANDBOX = 0;
const LAZY_SANDBOX = 1;

function BoxFun(funType, fun) {
  this.funType = funType;
  this.fun = fun;
}

const toSandboxFun = (fun) => new BoxFun(NORMAL_SANDBOX, fun);

const toLazySandboxFun = (fun) => new BoxFun(LAZY_SANDBOX, fun);

/**
 * funMap: Map[String, BoxFun]
 */
function Sandbox(funMap = {}) {
  this.funMap = funMap;
}

Sandbox.prototype.getSandboxFun = function(funName) {
  if (this.funMap[funName]) {
    return this.funMap[funName];
  } else {
    throw new Error(`missing function ${funName} in our sandbox.`);
  }
};

const mergeSandboxs = (box1, box2) => {
  return new Sandbox(Object.assign({}, box1.funMap, box2.funMap));
};

module.exports = {
  toSandboxFun,
  toLazySandboxFun,
  Sandbox,
  mergeSandboxs,
  NORMAL_SANDBOX,
  LAZY_SANDBOX
};

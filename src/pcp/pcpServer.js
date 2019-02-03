const {
  mergeSandboxs,
  NORMAL_SANDBOX,
  LAZY_SANDBOX
} = require('./sandbox');
const defaultSandbox = require('./defBox');

/**
 * function node
 *  = {
 *    funName: Sting,
 *    params: List[Any]
 *  }
 */
function FunNode(funName, params) {
  this.funName = funName;
  this.params = params;
}

const parseJsonAst = (source) => {
  if (Array.isArray(source)) {
    if (!source.length) return source;

    if (typeof source[0] === 'string') {
      if (source[0] === '\'') {
        return source.slice(1); // tail as pure data, like (',1,2,3) => data list (1,2,3)
      } else {
        return new FunNode(source[0], source.slice(1).map(parseJsonAst));
      }
    } else {
      return source;
    }
  } else {
    return source;
  }
};

function PcpServer(_sandbox) {
  this.sandbox = mergeSandboxs(_sandbox, defaultSandbox);
}
PcpServer.prototype.parseJson = function(sourceText) {
  return parseJsonAst(JSON.parse(sourceText));
};

PcpServer.prototype.execute = function(sourceText, attachment) {
  return this.executePureCallAST(this.parseJson(sourceText), attachment);
};

PcpServer.prototype.executePureCallAST = function(source, attachment) {
  if (source instanceof FunNode) {
    const boxFun = this.sandbox.getSandboxFun(source.funName);
    if (boxFun.funType === NORMAL_SANDBOX) {
      return boxFun.fun(
        source.params.map((param) => this.executePureCallAST(param, attachment)),
        attachment,
        this);
    } else if (boxFun.funType === LAZY_SANDBOX) {
      // execute lazy function box
      return boxFun.fun(source.params, attachment, this);
    }
  } else {
    return source;
  }
};

const getPcpServer = (_sandbox) => {
  return new PcpServer(_sandbox);
};

module.exports = {
  getPcpServer,
  parseJsonAst
};

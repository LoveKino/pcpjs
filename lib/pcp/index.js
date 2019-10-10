/**
 * json array string as lisp code
 *
 * ["add", 1, 2] => (add, 1, 2)
 *
 * Sandbox = {
 *  [funName]: BoxFun
 * }
 *
 * BoxFun: (params, pcs) => Any
 */

const {
  getPcpServer,
  parseJsonAst,
  FunNode
} = require('./pcpServer');

const {
  getPcpClient
} = require('./pcpClient');

const {
  toSandboxFun,
  toLazySandboxFun,
  Sandbox
} = require('./sandbox');

module.exports = {
  getPcpServer,
  getPcpClient,
  toSandboxFun,
  toLazySandboxFun,
  Sandbox,
  parseJsonAst,
  FunNode
};

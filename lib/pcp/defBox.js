const {
  Sandbox,
  toLazySandboxFun,
  toSandboxFun,
} = require('./sandbox');

module.exports = new Sandbox({
  'if': toLazySandboxFun((params, attachment, pcs) => {
    if (params.length < 2 || params.length > 3) {
      throw new Error('if grammer error. if must have at least 2 params, at most 3 params. eg: ["if", true, 1, 0], ["if", true, 1]');
    }

    const conditionExp = params[0];
    const successExp = params[1];
    const failExp = params[2] || null;

    return pcs.executePureCallAST(
      pcs.executePureCallAST(conditionExp, attachment) ? successExp : failExp, attachment);
  }),

  '+': toSandboxFun((params) => {
    return params.reduce((prev, item) => prev + item, 0);
  }),
  '-': toSandboxFun((params) => {
    return params.slice(1).reduce((prev, item) => prev - item, params[0]);
  }),
  '/': toSandboxFun(([x, y]) => {
    return x / y;
  }),
  '*': toSandboxFun((params) => {
    return params.reduce((prev, item) => prev * item, 1);
  }),

  'max': toSandboxFun((params) => {
    return Math.max(...params);
  }),
  'min': toSandboxFun((params) => {
    return Math.min(...params);
  })
});

const {
  Sandbox,
  toLazySandboxFun
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
  })
});

const {
  parseJsonAst
} = require('../src/pcp/pcpServer');
const assert = require('assert');
const {
  getPcpServer,
  getPcpClient,
  Sandbox,
  toSandboxFun
} = require('../src/pcp');

describe('pcp', () => {
  it('parseJsonAst:base', () => {
    assert.deepEqual(parseJsonAst(['\'', 1, 2, 3]), [1, 2, 3]);
  });

  it('base', () => {
    const pcpServer = getPcpServer(new Sandbox({
      add: toSandboxFun((params) => {
        return params[0] + params[1];
      })
    }));

    assert.equal(pcpServer.execute('["add", 1, 2]'), 3);
  });

  it('base:nest', () => {
    const pcpServer = getPcpServer(new Sandbox({
      add: toSandboxFun((params) => {
        return params[0] + params[1];
      })
    }));

    assert.equal(pcpServer.execute('["add", 1, ["add", 2, 3]]'), 6);
  });

  it('purecallClient', () => {
    const p = getPcpClient();
    assert.equal(p.toJson(p.call('add', 1, 2)), '["add",1,2]');
  });

  it('purecallClient:nest', () => {
    const p = getPcpClient();
    assert.equal(p.toJson(p.call('add', 1, p.call('succ', 3))), '["add",1,["succ",3]]');
  });

  it('purecall: concat string', () => {
    const pcpServer = getPcpServer(new Sandbox({
      concat: toSandboxFun((params) => {
        return params[0] + params[1];
      })
    }));

    assert.equal(pcpServer.execute('["concat", "hello,", "world!"]'), 'hello,world!');
  });

  it('purecall: if expression-fail', () => {
    const pcpServer = getPcpServer(new Sandbox({
      '>': toSandboxFun((params) => {
        return params[0] > params[1];
      })
    }));

    assert.equal(pcpServer.execute('["if", [">", 3, 4], 1, 2]'), 2);
  });

  it('purvall: if expression-success', () => {
    const pcpServer = getPcpServer(new Sandbox({
      '>': toSandboxFun((params) => {
        return params[0] > params[1];
      })
    }));

    assert.equal(pcpServer.execute('["if", [">", 6, 4], 1, 2]'), 1);
  });

  it('if exception', () => {
    const pcpServer = getPcpServer(new Sandbox({
      '>': toSandboxFun((params) => {
        return params[0] > params[1];
      })
    }));

    assert.throws(() => pcpServer.execute('["if", 0]'));
  });

  it('raw data', () => {
    const pcpServer = getPcpServer(new Sandbox());

    assert.deepEqual(pcpServer.execute('["\'", 1,2,3]'), [1, 2, 3]);
  });

  it('missing function name', () => {
    const pcpServer = getPcpServer(new Sandbox());
    assert.throws(() => pcpServer.execute('["fakkkkkk", 0]'));
  });
});

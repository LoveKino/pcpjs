const MsgPcp = require('./msgPcp');

module.exports = (host, port, getSandbox, onClose) => {
    return new Promise((resolve, reject) => {
        try {
            const ws = new WebSocket(`ws://${host}:${port}`);

            const {
                call,
                callRemote,
                onMsg
            } = MsgPcp(getSandbox(), (txt) => {
                try {
                    ws.send(txt);
                } catch (err) {
                    onClose && onClose(err);
                }
            });

            ws.addEventListener('open', () => {
                resolve({
                    call,
                    callRemote
                });
            });

            ws.addEventListener('message', (event) => {
                onMsg(event.data);
            });

            ws.addEventListener('close', () => {
                onClose && onClose();
            });

            ws.addEventListener('error', (err) => {
                onClose && onClose(err);
                reject(err);
            });
        } catch (err) {
            reject(err);
        }
    });
};

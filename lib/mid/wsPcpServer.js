const WebSocket = require('ws');

module.exports = (server, getSandbox, {
    onConnect,
    onClose
} = {}) => {
    const wss = new WebSocket.Server({
        server
    });

    wss.on('connection', async (ws) => {
        const {
            onMsg,
            callRemote,
            call
        } = MsgPcp(getSandbox(ws), (txt) => {
            try {
                ws.send(txt);
            } catch (err) {
                onClose && onClose(err);
            }
        });

        onConnect({
            call,
            callRemote
        });

        ws.on('message', (text) => {
            onMsg(text, attachment);
        });

        ws.on('close', () => {
            onClose && onClose();
        });

        ws.on('error', (err) => {
            onClose && onClose(err);
        });
    });
};

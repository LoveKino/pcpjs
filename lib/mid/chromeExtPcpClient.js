/**
 * concepts for chrome extension
 *
 * (1) background page
 *
 * (2) content script: Content scripts are files that run in the context of web pages. By using the standard Document Object Model (DOM), they are able to read details of the web pages the browser visits, make changes to them and pass information to their parent extension.
 */

const MsgPcp = require('./msgPcp');

module.exports = {
    background: (getSandbox, {
        onClose,
        onConnect
    } = {}) => {
        // Fired when a connection is made from either an extension process or a content script (by runtime.connect).
        chrome.runtime.onConnect.addListener((port) => {
            onConnect && onConnect(getPortConn(port, getSandbox, onClose));
        });
    },

    contentScript: (getSandbox, onClose) => {
        // create a channel
        const port = chrome.runtime.connect({});
        return getPortConn(port, getSandbox, onClose);
    }
};

const getPortConn = (port, getSandbox, onClose) => {
    const {
        onMsg,
        call,
        callRemote
    } = MsgPcp(getSandbox(port), (txt) => {
        port.postMessage(txt);
    });

    // receive msg
    port.onMessage.addListener((msg) => {
        onMsg(msg);
    });

    // on disconnect
    port.onDisconnect.addListener(() => {
        onClose && onClose(port);
    });

    return {
        call,
        callRemote
    };
};

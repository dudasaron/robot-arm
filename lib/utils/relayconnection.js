import Observable from "./observable.js";

export default class RelayConnection extends Observable {

    //#_socket;

    //#_connectionString = '';
    get connectionString() { return this._connectionString; }
    set connectionString(value) { this._connectionString = value; }

    //#_connected = false;
    get connected() { return this._connected; }

    constructor(connectionString) {
        super();
        this._connected = false;
        this._connectionString = connectionString || '';
        this._socket = null;
    }

    connect() {
        if (this._socket && (this._socket.readyState == WebSocket.CONNECTING || this._socket.readyState == WebSocket.OPEN))
            this._socket.close();
    
        this._socket = new WebSocket(this._connectionString);

        this._socket.addEventListener('close', (...args) => { this._connected = false; this._onDisconnect(...args)});
        this._socket.addEventListener('error', (...args) => { this._connected = false; this._onDisconnect(...args)});
    
        this._socket.addEventListener('open', (...args) => { this._connected = true; this._onConnect(...args)});

        this._socket.addEventListener('message', (...args) => this.emit('message', ...args));
    }

    _onDisconnect() {
        this.emit('disconnected');
    }

    _onConnect() {
        this.emit('connected');
    }

    send(message) {
        let data = typeof message === 'string' ? message : JSON.stringify(message);

        if (this._socket && this._socket.readyState == WebSocket.OPEN) {
            this._socket.send(data);
        } else {
            console.warn('Trying to send when disconnected!', message);
        }
    
    }


}
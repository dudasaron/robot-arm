
let isFunction = function(obj) {  
    return typeof obj == 'function' || false;
};
export default class Observable {

    constructor() {
        this._listeners = new Map();
    }

    addEventListener(label, handler) {
        if (!this._listeners.has(label))
            this._listeners.set(label, []);
        
        this._listeners.get(label).push(handler)
    }

    removeEventListener(label, handler) {
        let listeners = this._listeners.get(label);
        if (listeners && listeners.length)
            this._listeners.set(label, listeners.filter((h) => h != handler));
    }

    emit(label, ...args) {
        let listeners = this._listeners.get(label);
        if (listeners)
            listeners.forEach(handler => {
                handler(...args);
            });
    }

}
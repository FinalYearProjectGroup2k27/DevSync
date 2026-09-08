import socket from "socket.io-client";

let socketInstance = null;

export const initializeSocket = (projectId) => {
    if (socketInstance) {
        socketInstance.disconnect();
    }

    socketInstance = socket(import.meta.env.VITE_API_URL, {
        auth: {
            token: localStorage.getItem("token")
        },
        query: {
            projectId
        }
    });

    return socketInstance;
}

export const recieveMessage = (eventName, cb) => {
    if (socketInstance) {
        socketInstance.on(eventName, cb);
    }
}

export const receiveMessage = recieveMessage;

export const removeListener = (eventName, cb) => {
    if (socketInstance) {
        socketInstance.off(eventName, cb);
    }
}

export const disconnectSocket = () => {
    if (socketInstance) {
        socketInstance.disconnect();
        socketInstance = null;
    }
}

export const sendMessage = (eventName, data) => {
    if (socketInstance) {
        socketInstance.emit(eventName, data);
    }
}

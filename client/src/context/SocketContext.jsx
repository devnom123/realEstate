import { createContext, useEffect } from "react";
import { useState } from "react";
import {io} from "socket.io-client";

export const SocketContext = createContext();

export const SocketContextProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        setSocket(io("http://localhost:5000"));
    }, []);

    return <SocketContext.Provider value={{ socket }}>
        {children}
    </SocketContext.Provider>;
};
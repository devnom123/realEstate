import { createContext, useEffect } from "react";
import { useState } from "react";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(JSON.parse(localStorage.getItem("user")));

    const updateUser = (user) => {
        setCurrentUser(user);
    };

    useEffect(() => {
        localStorage.setItem("user", JSON.stringify(currentUser));
        let token = currentUser  ? currentUser.token : null;
        localStorage.setItem("token", token);
    }, [currentUser]);

    return <AuthContext.Provider value={{ currentUser,updateUser }}>
        {children}
    </AuthContext.Provider>;
};
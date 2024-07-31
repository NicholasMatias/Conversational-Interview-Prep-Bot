import React, { useState, useEffect, useContext } from "react";
import { auth, onAuthStateChanged } from "../../firebase/firebase.config";

const AuthContext = React.createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [currentUser, setCurrUser] = useState(null);
    const [userLoggedIn, setUserLoggedIn] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setCurrUser(user);
            setLoading(false);
        });
        return unsubscribe;
    }, []);

    async function initializeUser(user) {
        if (user) {
            setCurrUser({ ...user });
            setUserLoggedIn(true);
        } else {
            setCurrUser(null);
            setUserLoggedIn(false);
        }
        setLoading(false);
    }

    const value = {
        currentUser,
    };
    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
}

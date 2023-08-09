import { createContext, useContext, useEffect, useState } from "react";
import {
        GoogleAuthProvider,
        signInWithPopup,
        signOut,
        onAuthStateChanged,
        signInWithRedirect
    } from 'firebase/auth';
import { auth } from '../utils/firebase.config'

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState({});
    const [authState, setAuthState] = useState({});

    const googleSignIn = () => {
        const provider = new GoogleAuthProvider();
        signInWithPopup(auth, provider);
        signInWithRedirect(auth, provider) 
    };

    const logOut = () => {
        signOut(auth)
    }
    //const [auth, setAuth] = useState({});

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            console.log('User', currentUser)
        });
        return () => {
            unsubscribe();
        } ;
        
    }, [])

    return (
        <AuthContext.Provider value={{ authState, setAuthState, googleSignIn, logOut, user }}>
            {children}
        </AuthContext.Provider>
    )
}

export const UserAuth = () => {
    return useContext(AuthContext);
}

export default AuthContext;

// import { useContext, createContext } from "react";
// import {
//     GoogleAuthProvider,
//     signInWithPopup,
//     sinInWithRedirect,
//     signOut,
//     onAuthStateChanged
// } from 'firebase/auth';
// import { auth } from '../utils/firebase.config';

// const AuthContext = createContext();

// export const AuthContextProvider = ({children}) => {

//     const googleSignIn = () => {
//         const provider = new GoogleAuthProvider();
//         signInWithPopup (auth, provider);
//     }
//     return <AuthContext.Provider value={{googleSignIn}}>{children}</AuthContext.Provider>;
// };

// export const UserAuth = () => {
//     return useContext(AuthContext);;
// };
'use client';
import { createContext, useContext, ReactNode, useState, useCallback } from 'react';
import { Db, Server, PrivateKey } from "@/app/utils/db";
import jwt from "jwt-simple";
import { LoginResponse } from '../dashboard/login/page';
import { Auth } from '../auth';
export interface AppContextData {
    auth: LoginResponse | null;
    setAuthentication: (loginData: LoginResponse) => void;
    logout: () => void;
    getUser: () => LoginResponse | null;
}

const AppContext = createContext<AppContextData | undefined>(undefined);

interface AppProviderProps {
    children: ReactNode;
}

export function AppProvider({ children }: AppProviderProps) {
    const [auth, setAuth] = useState<LoginResponse | null>();

    const setAuthentication = useCallback((loginData: LoginResponse) => {
        setAuth(loginData);
        // Only access localStorage on the client side
        if (typeof window !== 'undefined') {
            try {
                // Create JWT payload with user data and expiry
                const payload = {
                    userData: loginData,
                    exp: Math.floor((Date.now() + (30 * 24 * 60 * 60 * 1000)) / 1000) // 1 month from now in seconds
                };

                // Sign the payload with private key to create JWT
                const token = jwt.encode(payload, PrivateKey || 'fallback-secret-key');

                // Store the signed JWT in localStorage
                console.log("setting user session", token);
                localStorage.setItem('userSession', token);
            } catch (error) {
                console.error('Error creating user session:', error);
                // Handle the error gracefully - maybe clear the session
                localStorage.removeItem('userSession');
            }
        }
    }, []);

    const getUser = useCallback(() => {
        try {
            // Only access localStorage on the client side
            if (typeof window === 'undefined') {
                return null;
            }

            // Get the stored JWT from localStorage
            const token = localStorage.getItem('userSession');

            if (!token) {
                setAuth(null);
                return null;
            }

            // Verify and decode the JWT
            const decoded = jwt.decode(token, PrivateKey) as { userData: LoginResponse; exp: number };
            console.log("getting user session", decoded);
            // Check if token has expired
            if (decoded.exp < Math.floor(Date.now() / 1000)) { // 1 month expiration time
                localStorage.removeItem('userSession');
                setAuth(null);
                return null;
            }
            setAuth(decoded.userData);
            return decoded.userData;
        } catch (error) {
            // Only access localStorage on the client side
            if (typeof window !== 'undefined') {
                localStorage.removeItem('userSession');
            }
            setAuth(null);
            return null;
        }
    }, []);

    const logout = useCallback(() => {
        setAuth(null);
        // Only access localStorage on the client side
        if (typeof window !== 'undefined') {
            localStorage.removeItem('userSession');
        }
    }, []);

    const value: AppContextData = {
        auth: auth || null,
        setAuthentication,
        getUser,
        logout
    };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error('useAppContext must be used within an AppProvider');
    }
    return context;
}

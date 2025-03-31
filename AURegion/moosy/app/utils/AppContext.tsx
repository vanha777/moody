'use client';
import { createContext, useContext, ReactNode, useState, useCallback } from 'react';
import { Db, Server, PrivateKey } from "@/app/utils/db";
import jwt from "jwt-simple";
import { LoginResponse } from '../dashboard/login/page';
import { Auth } from '../auth';
import { invoke } from '@tauri-apps/api/core';
export interface AppContextData {
    auth: LoginResponse | null;
    setAuthentication: (loginData: LoginResponse) => void;
    logout: () => void;
    getUser: () => Promise<LoginResponse | null>;
}

const AppContext = createContext<AppContextData | undefined>(undefined);

interface AppProviderProps {
    children: ReactNode;
}

export function AppProvider({ children }: AppProviderProps) {
    const [auth, setAuth] = useState<LoginResponse | null>();

    const setAuthentication = useCallback((loginData: LoginResponse) => {
        setAuth(loginData);
    }, []);

    const getUser = useCallback(async () => {
        try {
            const response: LoginResponse = await invoke('get_auth_state')
            setAuth(response);
            return response;
        } catch (error) {
            console.error('Error getting auth from BE:', error);
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

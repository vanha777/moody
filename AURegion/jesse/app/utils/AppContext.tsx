'use client';
import { createContext, useContext, ReactNode, useState, useCallback } from 'react';

export interface UserData {
    id?: string;
    email?: string;
    name?: string;
    photo?: string;
    [key: string]: any;
}

export interface CollectionData {
    name?: string;
    symbol?: string;
    size?: number;
    uri?: string;
    description?: string;
    address?: string;
    image?: string;
}

export interface GameData {
    id?: string;
    name?: string;
    genre?: string;
    publisher?: string;
    photo?: string;
    releaseDate?: string;
    description?: string;
    symbol?: string;
    address?: string;
}

export interface NFTData {
    address: string;
    name: string;
    description: string;
    symbol: string;
    image: string;
    external_link: string;
    owner: string;
    supply?: number;
    decimals?: number;
}

export interface TokenData {
    address?: string;
    image?: string;
    name?: string;
    symbol?: string;
    description?: string;
    uri?: string;
}

export interface AuthData {
    accessToken: string | null;
    refreshToken: string | null;
    userData: UserData | null;
    gameData: GameData[] | null;
    tokenData: TokenData | null;
    collectionData: CollectionData[] | null;
    isAuthenticated: boolean;
}

export interface AppContextData {
    auth: AuthData;
    setAccessToken: (accessToken: string) => void;
    setUser: (userData: UserData) => void;
    setGame: (gameData: GameData[]) => void;
    setTokenData: (tokenData: TokenData | null) => void;
    setCollectionData: (collectionData: CollectionData[] | null) => void;
    logout: () => void;
}

const AppContext = createContext<AppContextData | undefined>(undefined);

interface AppProviderProps {
    children: ReactNode;
}

export function AppProvider({ children }: AppProviderProps) {
    const [auth, setAuth] = useState<AuthData>({
        accessToken: null,
        refreshToken: null,
        userData: null,
        gameData: null,
        tokenData: null,
        collectionData: null,
        isAuthenticated: false,

    });

    const setAccessToken = useCallback((accessToken: string) => {
        setAuth(prev => ({
            ...prev,
            accessToken,
            isAuthenticated: true,
        }));
    }, []);

    const setUser = useCallback((userData: UserData) => {
        setAuth(prev => ({
            ...prev,
            userData,
        }));
    }, []);

    const setGame = useCallback((gameData: GameData[]) => {
        setAuth(prev => ({
            ...prev,
            gameData,
        }));
    }, []);

    const setTokenData = useCallback((tokenData: TokenData | null) => {
        setAuth(prev => ({
            ...prev,
            tokenData,
        }));
    }, []);

    const setCollectionData = useCallback((collectionData: CollectionData[] | null) => {
        setAuth(prev => ({
            ...prev,
            collectionData,
        }));
    }, []);
    const logout = useCallback(() => {
        setAuth({
            accessToken: null,
            refreshToken: null,
            userData: null,
            gameData: null,
            tokenData: null,
            collectionData: null,
            isAuthenticated: false,
        });
    }, []);

    const value: AppContextData = {
        auth,
        setAccessToken,
        setUser,
        setGame,
        setTokenData,
        setCollectionData,
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

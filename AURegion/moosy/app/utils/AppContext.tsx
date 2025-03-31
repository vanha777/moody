'use client';
import { createContext, useContext, ReactNode, useState, useCallback, useEffect } from 'react';
import { Db, Server, PrivateKey } from "@/app/utils/db";
import jwt from "jwt-simple";
import { LoginResponse } from '../dashboard/login/page';
import { Auth } from '../auth';
import { invoke } from '@tauri-apps/api/core';
import { listen } from '@tauri-apps/api/event';
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
            console.log("Auth state updated by BE:", response);
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

    // Add useEffect to subscribe to specific database events
    useEffect(() => {
        console.log("activate listening to bookings changes");
        if (auth?.company.id) {

            const subscribeBooking = async () => {
                const channel = Auth.channel('tables_chan');

                // Handler function to fetch full booking details using Supabase client
                const fetchLatestUpdate = async (booking: any) => {
                    try {
                        const response = await invoke('fetch_latest_state');
                        console.log("New Booking updated At:", response);
                    } catch (error) {
                        console.error("Error fetching full booking details:", error);
                    }
                };

                // Subscribe to INSERT events
                channel.on(
                    "postgres_changes",
                    {
                        event: "INSERT",
                        schema: "public",
                        table: "booking",
                        filter: `company_id=eq.${auth.company.id}`,

                    },
                    (payload) => {
                        console.log("New booking added:", payload.new.id);
                        // Fetch the full booking details
                        fetchLatestUpdate(payload.new);
                    }
                );

                // Subscribe to UPDATE events
                channel.on(
                    "postgres_changes",
                    {
                        event: "UPDATE",
                        schema: "public",
                        table: "booking",
                        filter: `company_id=eq.${auth.company.id}`
                    },
                    (payload) => {
                        console.log("Booking updated:", payload.new.id);
                        // Fetch the full booking details
                        fetchLatestUpdate(payload.new);
                    }
                );

                // Subscribe to DELETE events
                channel.on(
                    "postgres_changes",
                    {
                        event: "DELETE",
                        schema: "public",
                        table: "booking",
                        filter: `company_id=eq.${auth.company.id}`
                    },
                    (payload) => {
                        console.log("Booking deleted:", payload.old.id);
                        fetchLatestUpdate(payload.old);
                        // For DELETE events, you might just want to remove the booking from your state
                        // As an alternative, you could also fetch all current bookings to refresh the state
                    }
                );

                const subscription = channel.subscribe();

                // Clean up subscription on unmount
                return () => {
                    subscription.unsubscribe();
                };
            };
            // Function to fetch full booking details
            const fetchFullBookingDetails = async () => {
                console.log("activate listening to update state");
                // Listen for the 'state-updated' event from the backend
                const unlisten = listen('state-updated', (event) => {
                    console.log("State updated event received:", event);
                    getUser();
                });
                // Clean up listener on unmount
                return () => {
                    console.log("unlisten listening to update state");
                    unlisten.then(unlistenFn => unlistenFn());
                };
            };
            fetchFullBookingDetails();
            subscribeBooking();
        }
    }, [auth]);

    // UPDATE STATE BY BE EVENT
    // useEffect(() => {
    //     if (auth?.company.id) {
    //         console.log("activate listening to update state");
    //         // Listen for the 'state-updated' event from the backend
    //         const unlisten = listen('state-updated', (event) => {
    //             console.log("State updated event received:", event);
    //             getUser();
    //         });
    //         // Clean up listener on unmount
    //         return () => {
    //             console.log("unlisten listening to update state");
    //             unlisten.then(unlistenFn => unlistenFn());
    //         };
    //     }
    // }, []);

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

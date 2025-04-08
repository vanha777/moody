'use client';
import { createContext, useContext, ReactNode, useState, useCallback, useEffect } from 'react';
import { Db, Server, PrivateKey } from "@/app/utils/db";
import jwt from "jwt-simple";
import { LoginResponse } from '../dashboard/login/page';
import { Auth } from '../auth';
import { invoke } from '@tauri-apps/api/core';
import { listen } from '@tauri-apps/api/event';
import {
    isPermissionGranted,
    requestPermission,
    sendNotification,
} from '@tauri-apps/plugin-notification';
import { ContactProps } from '../business/clients/components/businesses';

// Add Notification type
interface Notification {
    id: string;
    message: string;
    type: 'success' | 'error' | 'info';
    timestamp: Date;
}

export interface AppContextData {
    auth: LoginResponse | null;
    setAuthentication: (loginData: LoginResponse) => void;
    logout: () => void;
    getUser: () => Promise<LoginResponse | null>;
    // Add notifications to context
    notifications: Notification[];
    addNotification: (message: string, type: 'success' | 'error' | 'info') => void;
    removeNotification: (id: string) => void;
    cancelBooking: (bookingId: string) => Promise<any>;
    rescheduleBooking: (bookingId: string, newDate: Date, endTime: Date) => Promise<any>;
    checkoutBooking: (customerId: string, amount: number, method: string, currency: string, bookingId?: string, servicesId?: string[], discountsId?: string[]) => Promise<any>;
    addCustomer: (customer: any) => Promise<any>;
    editCustomer: (customer: any) => Promise<any>;
    deleteCustomer: (customerId: string) => Promise<any>;
    checkoutWalkin: (customerId: string, amount: number, method: string, currency: string, servicesId?: string[], discountsId?: string[]) => Promise<any>;
    updateCampaign: (campaignId: string, active: boolean) => Promise<any>;
}

const AppContext = createContext<AppContextData | undefined>(undefined);

interface AppProviderProps {
    children: ReactNode;
}

// Add this helper function
// async function sendTauriNotification(title: string, message: string) {
//     try {
//         let permissionGranted = await isPermissionGranted();
//         if (!permissionGranted) {
//             const permission = await requestPermission();
//             permissionGranted = permission === 'granted';
//         }
//         if (permissionGranted) {
//             await sendNotification({
//                 title,
//                 body: message,
//             });
//         }
//     } catch (error) {
//         console.error('Failed to send notification:', error);
//     }
// }

export function AppProvider({ children }: AppProviderProps) {
    const [auth, setAuth] = useState<LoginResponse | null>();
    // Add notifications state
    const [notifications, setNotifications] = useState<Notification[]>([]);

    // Add notification management functions
    const addNotification = useCallback(async (message: string, type: 'success' | 'error' | 'info') => {
        const newNotification: Notification = {
            id: Date.now().toString(),
            message,
            type,
            timestamp: new Date()
        };
        setNotifications(prev => [...prev, newNotification]);

        // Send Tauri notification with appropriate title based on type
        // const title = type.charAt(0).toUpperCase() + type.slice(1); // Capitalize first letter
        // await sendTauriNotification(title, message);
    }, []);

    const removeNotification = useCallback((id: string) => {
        setNotifications(prev => prev.filter(notification => notification.id !== id));
    }, []);

    const setAuthentication = useCallback((loginData: LoginResponse) => {
        setAuth(loginData);
    }, []);

    const getUser = useCallback(async () => {
        try {
            const response: LoginResponse = await invoke('read_auth')
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

    const cancelBooking = useCallback(async (bookingId: string) => {
        try {
            const response = await invoke('cancel_booking', { bookingId })
            return response;
        } catch (error) {
            return error;
        }
    }, []);


    const rescheduleBooking = useCallback(async (bookingId: string, newDate: Date, endTime: Date) => {
        try {
            const response = await invoke('reschedule_booking', { bookingId, newDate, endTime })
            return response;
        } catch (error) {
            return error;
        }
    }, []);

    const addCustomer = useCallback(async (customer: ContactProps) => {
        try {
            const response = await invoke('add_customer', { customer })
            return response;
        } catch (error) {
            return error;
        }
    }, []);

    const editCustomer = useCallback(async (customer: ContactProps) => {
        try {
            const response = await invoke('edit_customer', { customer })
            return response;
        } catch (error) {
            return error;
        }
    }, []);

    const deleteCustomer = useCallback(async (customerId: string) => {
        try {
            console.log("customer Id to delete: ", customerId);
            const response = await invoke('delete_customer', { customerId })
            return response;
        } catch (error) {
            return error;
        }
    }, []);

    const checkoutBooking = useCallback(async (customerId: string, amount: number, method: string, currencyId: string, bookingId?: string, servicesId?: string[], discountsId?: string[]) => {
        try {
            const response = await invoke('checkout_booking', { bookingId, customerId, servicesId, discountsId, currencyId, method, amount, status: "completed" })
            return response;
        } catch (error) {
            return error;
        }
    }, []);

    const checkoutWalkin = useCallback(async (customerId: string, amount: number, method: string, currencyId: string, servicesId?: string[], discountsId?: string[]) => {
        try {
            const response = await invoke('checkout_walkin', { customerId, servicesId, discountsId, currencyId, method, amount, status: "completed" })
            return response;
        } catch (error) {
            return error;
        }
    }, []);

    const updateCampaign = useCallback(async (campaignId: string, active: boolean) => {
        console.log("update campaign :", campaignId, active);
        try {
            //
            const response = await invoke('update_campaign', { campaignId });
            console.log("Campaign update response:", response);
            return response;
        } catch (error) {
            return error;
        }
    }, []);

    // Add useEffect to subscribe to specific database events
    // useEffect(() => {
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
                    console.log("New booking added:", payload.new);
                    // Fetch the full booking details
                    fetchLatestUpdate(payload.new);
                    // Add notification for successful update
                    addNotification(`New booking notice at ${payload.new.created_at}`, 'info');
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
                    console.log("Booking updated:", payload.new);
                    // Fetch the full booking details
                    fetchLatestUpdate(payload.new);
                    // Add notification for successful update
                    const localTime = new Date(payload.new.start_time).toLocaleString();
                    addNotification(`Booking updated notice at ${localTime}`, 'info');
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
                    console.log("Booking deleted:", payload.old);
                    fetchLatestUpdate(payload.old);
                    // Add notification for successful update
                    addNotification(`Cancellation notice`, 'info');
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
                //Debug
                // addNotification(`LISTENING UPDATED`, 'info');
                //End,
                console.log("XXXXXXXXXX State updated event received:", event.payload);
                // Type check the payload before setting it
                if (event.payload && typeof event.payload === 'object') {
                    setAuth(event.payload as LoginResponse);
                } else {
                    console.error("Invalid payload received:", event.payload);
                }
                // getUser();
            });
            // Clean up listener on unmount
            return () => {
                console.log("unlisten listening to update state");
                //Debug
                // addNotification(`UNLISTENING`, 'info');
                //End,
                unlisten.then(unlistenFn => unlistenFn());
            };
        };
        fetchFullBookingDetails();
        subscribeBooking();
    }
    // }, []);

    useEffect(() => {
        if (auth?.company.id) {
            getUser();
        }
    }, [auth?.company.id]);

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
        logout,
        cancelBooking,
        // Add notifications to context value
        notifications,
        addNotification,
        removeNotification,
        rescheduleBooking,
        checkoutBooking,
        addCustomer,
        editCustomer,
        deleteCustomer,
        checkoutWalkin,
        updateCampaign
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

import { useRouter, usePathname } from 'next/navigation';
import React, { useEffect } from 'react';
import Logo from '../../../public/apple.png';
import { AppProvider, useAppContext } from "@/app/utils/AppContext";
interface SimpleSideBarProps {
    children: React.ReactNode;
}

const SimpleSideBar: React.FC<SimpleSideBarProps> = ({
    children,
}) => {
    const router = useRouter();
    const pathname = usePathname();
    const { auth } = useAppContext();
    const [activeItem, setActiveItem] = React.useState<string>('home');

    // Sync activeItem with current route on mount and when route changes
    useEffect(() => {
        if (pathname.includes('/business/clients')) {
            setActiveItem('clients');
        } else if (pathname.includes('/business/checkout')) {
            setActiveItem('checkout');
        } else if (pathname.includes('/business/marketing')) {
            setActiveItem('marketing');
        } else if (pathname.includes('/business/settings')) {
            setActiveItem('settings');
        } else if (pathname.includes('/')) {
            setActiveItem('home');
        }
    }, [pathname]);

    // Function to handle navigation and set active item
    const handleNavigation = (path: string, item: string) => {
        setActiveItem(item);
        router.push(path);
    };

    return (
        <div className="bg-gray-50">
            {/* Main content - add margin/padding for desktop view */}
            <div className="lg:ml-24">
                {children}
            </div>

            {/* Mobile Dock Menu - only visible on small screens */}
            <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-black shadow-lg border-t border-gray-800 z-50">
                <ul className="flex justify-between items-center px-2 py-3">
                    <li>
                        <div
                            onClick={() => handleNavigation('/business', 'home')}
                            className={`flex flex-col items-center p-2 ${activeItem === 'home' ? 'text-white font-medium' : 'text-gray-400'}`}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${activeItem === 'home' ? 'text-white' : 'text-gray-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                            </svg>
                            {activeItem === 'home' && (
                                <span className="text-xs text-white">Home</span>
                            )}
                        </div>
                    </li>
                    <li>
                        <div
                            onClick={() => handleNavigation('/business/clients', 'clients')}
                            className={`flex flex-col items-center p-2 ${activeItem === 'clients' ? 'text-white font-medium' : 'text-gray-400'}`}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${activeItem === 'clients' ? 'text-white' : 'text-gray-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                            </svg>
                            {activeItem === 'clients' && (
                                <span className="text-xs text-white">Clients</span>
                            )}
                        </div>
                    </li>
                    <li>
                        <div
                            onClick={() => handleNavigation(`/business/checkout`, 'checkout')}
                            className={`flex flex-col items-center p-2 ${activeItem === 'checkout' ? 'text-white font-medium' : 'text-gray-400'}`}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${activeItem === 'checkout' ? 'text-white' : 'text-gray-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a4 4 0 014-4z" />
                            </svg>
                            {activeItem === 'checkout' && (
                                <span className="text-xs text-white">CheckOut</span>
                            )}
                        </div>
                    </li>
                    <li>
                        <div
                            onClick={() => handleNavigation(`/business/marketing`, 'marketing')}
                            className={`flex flex-col items-center p-2 ${activeItem === 'marketing' ? 'text-white font-medium' : 'text-gray-400'}`}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${activeItem === 'marketing' ? 'text-white' : 'text-gray-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                            </svg>
                            {activeItem === 'marketing' && (
                                <span className="text-xs text-white">Marketing</span>
                            )}
                        </div>
                    </li>
                    <li>
                        <div
                            onClick={() => handleNavigation(`/business/settings`, 'settings')}
                            className={`flex flex-col items-center p-2 ${activeItem === 'settings' ? 'text-white font-medium' : 'text-gray-400'}`}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${activeItem === 'settings' ? 'text-white' : 'text-gray-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            {activeItem === 'settings' && (
                                <span className="text-xs text-white">Settings</span>
                            )}
                        </div>
                    </li>
                </ul>
            </div>

            {/* Desktop Sidebar - hidden on mobile, visible on lg screens */}
            <div className="hidden lg:block fixed top-0 left-0 h-full">
                <ul className="menu p-4 w-18 min-h-full bg-gray-50 text-base-content flex flex-col items-center gap-4">
                    <li className="mb-4">
                        <div className="relative rounded-full p-[2px] before:absolute before:w-full before:h-full before:rounded-full before:transition-all before:duration-300 hover:before:bg-gradient-to-r hover:before:from-blue-600 hover:before:to-purple-600 before:opacity-0 hover:before:opacity-100">
                            <div
                                onClick={() => router.push('/dashboard')}
                                className="rounded-full bg-white p-2 relative flex items-center justify-center cursor-pointer"
                            >
                                <img
                                    src={Logo.src}
                                    alt="CoLaunch Logo"
                                    className="w-12 h-12 rounded-full"
                                    onError={(e) => { e.currentTarget.src = '/path/to/default/logo.png'; }}
                                />
                            </div>
                        </div>
                    </li>
                    <li className="mt-32">
                        <div className="relative rounded-full p-[2px] before:absolute before:w-full before:h-full before:rounded-full before:transition-all before:duration-300 hover:before:bg-gradient-to-r hover:before:from-blue-600 hover:before:to-purple-600 before:opacity-0 hover:before:opacity-100">
                            <div
                                onClick={() => handleNavigation('/business', 'home')}
                                className="rounded-full bg-white p-4 relative flex items-center justify-center cursor-pointer"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                </svg>
                            </div>
                        </div>
                    </li>
                    <li>
                        <div className="relative rounded-full p-[2px] before:absolute before:w-full before:h-full before:rounded-full before:transition-all before:duration-300 hover:before:bg-gradient-to-r hover:before:from-blue-600 hover:before:to-purple-600 before:opacity-0 hover:before:opacity-100">
                            <div
                                onClick={() => handleNavigation('/business/clients', 'clients')}
                                className="rounded-full bg-white p-4 relative flex items-center justify-center cursor-pointer"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                </svg>
                            </div>
                        </div>
                    </li>
                    <li>
                        <div className="relative rounded-full p-[2px] before:absolute before:w-full before:h-full before:rounded-full before:transition-all before:duration-300 hover:before:bg-gradient-to-r hover:before:from-blue-600 hover:before:to-purple-600 before:opacity-0 hover:before:opacity-100">
                            <div
                                onClick={() => handleNavigation('/business/checkout', 'checkout')}
                                className="rounded-full bg-white p-4 relative flex items-center justify-center cursor-pointer"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a4 4 0 014-4z" />
                                </svg>
                            </div>
                        </div>
                    </li>
                    <li>
                        <div className="relative rounded-full p-[2px] before:absolute before:w-full before:h-full before:rounded-full before:transition-all before:duration-300 hover:before:bg-gradient-to-r hover:before:from-blue-600 hover:before:to-purple-600 before:opacity-0 hover:before:opacity-100">
                            <div
                                onClick={() => handleNavigation('/business/marketing', 'marketing')}
                                className="rounded-full bg-white p-4 relative flex items-center justify-center cursor-pointer"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                </svg>
                            </div>
                        </div>
                    </li>
                    <li className="mt-auto mb-4">
                        <div className="relative rounded-full p-[2px] before:absolute before:w-full before:h-full before:rounded-full before:transition-all before:duration-300 hover:before:bg-gradient-to-r hover:before:from-blue-600 hover:before:to-purple-600 before:opacity-0 hover:before:opacity-100">
                            <div
                                onClick={() => handleNavigation('/business/settings', 'settings')}
                                className="rounded-full bg-white p-2 relative flex items-center justify-center cursor-pointer"
                            >
                                <img
                                    src={typeof auth?.company?.logo === 'string' ? auth?.company?.logo : Logo.src}
                                    alt="Profile"
                                    className="w-10 h-10 rounded-full ring-2 ring-transparent hover:ring-purple-600 transition-all duration-300"
                                    onError={(e) => { e.currentTarget.src = Logo.src }}
                                />
                            </div>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default SimpleSideBar;

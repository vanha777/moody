'use client'
import SimpleSideBar from "@/app/dashboard/components/simpleSideBar";
import AiSocialPost from './aiSocialPost';
import Promotions from './promotions';
import Sms from './sms';
import { useEffect, useState } from 'react';
import { motion } from "framer-motion";
import { useAppContext } from '@/app/utils/AppContext';
import { useRouter } from 'next/navigation';

// Define the marketing option type
interface MarketingOption {
    id: number;
    title: string;
    description: string;
    disabled?: boolean;
}

// Create array of marketing options
const marketingOptions: MarketingOption[] = [
    {
        id: 1,
        title: "SMS Marketing",
        description: "Create and manage SMS campaigns for direct customer engagement"
    },
    {
        id: 2,
        title: "Promotions",
        description: "Design and track promotional campaigns and special offers",
        disabled: true
    },
    {
        id: 3,
        title: "AI Social Post Creator",
        description: "Generate engaging social media content using AI",
        disabled: true
    }
];

export default function Main() {
    const router = useRouter();
    const { auth } = useAppContext();
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    useEffect(() => {
        if (!auth) {
            router.push('/dashboard/login');
        }
        console.log("campaign :", auth?.company.campaigns)
    }, [auth?.company.campaigns]);

    const handleClose = () => {
        setSelectedOption(null);
    };

    const renderSelectedComponent = () => {
        switch (selectedOption) {
            case 1:
                return <Sms initialAutomations={auth?.company.campaigns?.message} close={handleClose} />;
            case 2:
                return <Promotions close={handleClose} />;
            case 3:
                return <AiSocialPost close={handleClose} />;
            default:
                return null;
        }
    };

    return (
        <>
            {!selectedOption ? (
                <SimpleSideBar>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        transition={{
                            duration: 0.3,
                            ease: "easeInOut"
                        }}
                    >
                        {/* Header */}
                        <div className="bg-white shadow-sm p-4 sticky top-0 z-10">
                            <div className="flex items-center">
                                <h1 className="text-3xl font-bold p-6">Marketing</h1>
                            </div>
                        </div>
                        {/* <h1 className="text-3xl font-bold p-6">Marketing</h1> */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
                            {marketingOptions.map((option) => (
                                <div
                                    key={option.id}
                                    className={`bg-white p-6 rounded-lg shadow-md transition-shadow ${option.disabled ? 'opacity-60 cursor-not-allowed' : 'hover:shadow-lg cursor-pointer'}`}
                                    onClick={() => !option.disabled && setSelectedOption(option.id)}
                                >
                                    <h3 className="text-xl font-semibold mb-2">{option.title}</h3>
                                    <p className="text-gray-600">{option.description}</p>
                                    {option.disabled && (
                                        <p className="text-red-500 mt-2 text-sm">Coming soon</p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </SimpleSideBar>
            ) : (
                renderSelectedComponent()
            )}
        </>
    );
}
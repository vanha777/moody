'use client'
import SimpleNavBar from "@/app/dashboard/components/simpleNavBar";
import SimpleSideBar from "@/app/dashboard/components/simpleSideBar";
import AiSocialPost from './aiSocialPost';
import Promotions from './promotions';
import Sms from './sms';
import { useState } from 'react';

// Define the marketing option type
interface MarketingOption {
    id: number;
    title: string;
    description: string;
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
        description: "Design and track promotional campaigns and special offers"
    },
    {
        id: 3,
        title: "AI Social Post Creator",
        description: "Generate engaging social media content using AI"
    }
];

export default function Main() {
    const [selectedOption, setSelectedOption] = useState<number | null>(null);

    const handleClose = () => {
        setSelectedOption(null);
    };

    const renderSelectedComponent = () => {
        switch (selectedOption) {
            case 1:
                return <Sms close={handleClose} />;
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
                    <>
                        <SimpleSideBar>
                        <h1 className="text-3xl font-bold p-6">Marketing</h1>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
                            {marketingOptions.map((option) => (
                                <div
                                    key={option.id}
                                    className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer"
                                    onClick={() => setSelectedOption(option.id)}
                                >
                                    <h3 className="text-xl font-semibold mb-2">{option.title}</h3>
                                    <p className="text-gray-600">{option.description}</p>
                                </div>
                            ))}
                        </div>
                        </SimpleSideBar>
                    </>

                ) : (
                    renderSelectedComponent()
                )}
        
        </>
    );
}
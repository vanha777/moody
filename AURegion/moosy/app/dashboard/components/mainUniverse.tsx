"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import {
    IoGameControllerOutline,
    IoGameControllerSharp,
    IoStatsChartOutline,
    IoStatsChartSharp,
    IoImagesOutline,
    IoImagesSharp,
    IoSettingsOutline,
    IoSettingsSharp,
    IoCodeSlashOutline,
    IoCodeSlashSharp,
    IoStorefrontOutline,
    IoStorefrontSharp
} from "react-icons/io5";
import { MdGeneratingTokens, MdOutlineGeneratingTokens, MdOutlineWebhook, MdWebhook } from "react-icons/md";
import { CollectionData, GameData, UserData } from '@/app/utils/AppContext'
import { AppProvider, useAppContext } from "@/app/utils/AppContext";
import { Db } from "@/app/utils/db";
import SimpleLoading from "./simpleLoading";
import Navbar from "./navBarV2";
import IdeaComponent, { Idea } from "./ideaComponent";
import SimpleNav from "./simpleNav";
import SimpleSideBar from "./simpleSideBar";
import SimpleNavBar from "./simpleNavBar";
import ChatInstruction from "./chatInstruction";
import BusinessComponent from "./businessComponent";
import BookingList from "./booking";
import Calendar from "./calendar";
import { useRouter, useSearchParams } from "next/navigation";

interface InitialUserProps {
    rawUser?: any;
}


export default function MainUniverse({ rawUser }: InitialUserProps) {
    const router = useRouter();
    const { auth, setTokenData, setAccessToken, setCollectionData, setUser, setGame, logout,getUser } = useAppContext();
    const [ideas, setIdeas] = useState<Idea[]>([]);
    const [activeMenu, setActiveMenu] = useState("software");
    const [activeView, setActiveView] = useState("view1");
    const [selectedGameData, setSelectedGameData] = useState<GameData | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [showCalendar, setShowCalendar] = useState(false);

    // useEffect(() => {
    //     console.log("this is auth", auth);
    //     if (auth.userData == null) {
    //         console.log("no user");
    //         // window.location.href = '/dashboard/login';
    //     }
    // }, [auth.userData]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                let initialUser: UserData;
                if (rawUser) {
                    initialUser = JSON.parse(rawUser) as UserData;
                } else {
                    const user = getUser();
                    if (!user) {
                        throw new Error('No user found');
                    }
                    initialUser = user;
                }
                // setIsLoading(true);
                console.log("this is data", initialUser);
                setUser(initialUser);
            } catch (error) {
                console.error('Error fetching data:', error);
                router.push("/dashboard/login");
            } finally {
                // setIsLoading(false);
                // alert("Thank you for registering with CoLaunch!, Dashboard will publicly accessible soon!");
                // router.push("/");
            }
        };

        fetchData();
    }, []);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.3,
                delayChildren: 0.2,
            },
        },
    };

    const industries = [
        {
            id: "software",
            label: "Software",
            icon: IoCodeSlashOutline,
            selectedIcon: IoCodeSlashSharp
        },
        {
            id: "healthcare",
            label: "Healthcare",
            icon: MdOutlineGeneratingTokens,
            selectedIcon: MdGeneratingTokens
        },
        {
            id: "fintech",
            label: "Fintech",
            icon: IoStorefrontOutline,
            selectedIcon: IoImagesSharp
        },
        {
            id: "ecommerce",
            label: "E-Commerce",
            icon: IoStorefrontOutline,
            selectedIcon: IoStorefrontSharp
        },
        {
            id: "ai",
            label: "AI & ML",
            icon: IoStatsChartOutline,
            selectedIcon: IoStatsChartSharp
        },
        {
            id: "blockchain",
            label: "Blockchain",
            icon: IoSettingsOutline,
            selectedIcon: IoSettingsSharp
        }
    ];

    return (
        <>
            {isLoading ? (
                <SimpleLoading />
            ) : (
                <>
                    <SimpleSideBar>
                        <BookingList />
                    </SimpleSideBar>
                </>
            )}
        </>
    );
}

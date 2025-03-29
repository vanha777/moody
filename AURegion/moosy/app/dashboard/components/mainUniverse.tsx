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
import { LoginResponse } from '../login/page';
import { useAppContext } from "@/app/utils/AppContext";
import SimpleLoading from "./simpleLoading";
import IdeaComponent, { Idea } from "./ideaComponent";
import SimpleSideBar from "./simpleSideBar";
import BookingList from "./booking";
import { useRouter, useSearchParams } from "next/navigation";

export default function MainUniverse() {
    const router = useRouter();
    const { auth, getUser } = useAppContext();
    // const [ideas, setIdeas] = useState<Idea[]>([]);
    // const [activeMenu, setActiveMenu] = useState("software");
    // const [activeView, setActiveView] = useState("view1");
    // const [selectedGameData, setSelectedGameData] = useState<GameData | null>(null);
    // const [isLoading, setIsLoading] = useState(false);
    // const [showCalendar, setShowCalendar] = useState(false);

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
                let initialUser: LoginResponse;
                if (auth) {
                    initialUser = auth;
                } else {
                    const user = getUser();
                    if (!user) {
                        throw new Error('No user found');
                        router.push("/dashboard/login");
                    }
                    initialUser = user;
                }
                // setIsLoading(true);
                console.log("this is data", initialUser);
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

    return (
        <>
            {/* <SimpleSideBar> */}
                {/* <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{
                        duration: 0.3,
                        ease: "easeInOut"
                    }}
                > */}
                    <BookingList />
                {/* </motion.div> */}
            {/* </SimpleSideBar> */}
        </>
    );
}

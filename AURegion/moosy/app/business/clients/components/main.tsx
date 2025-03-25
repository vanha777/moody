'use client'
import SimpleNavBar from "@/app/dashboard/components/simpleNavBar";
import SimpleSideBar from "@/app/dashboard/components/simpleSideBar";
import IdeaCard from "./businesses";
import { motion } from "framer-motion";

export default function Main() {
    return (
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
                <IdeaCard />
            </motion.div>
        </SimpleSideBar>
    );
}
'use client'
import SimpleSideBar from "@/app/dashboard/components/simpleSideBar";
import BusinessPerformance from "./profile";
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
                <BusinessPerformance />
            </motion.div>
        </SimpleSideBar>
    );
}
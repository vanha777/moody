'use client'
import SimpleNavBar from "@/app/dashboard/components/simpleNavBar";
import SimpleSideBar from "@/app/dashboard/components/simpleSideBar";
import BusinessPerformance from "./profile";

export default function Main() {
    return (
        <>
            <SimpleSideBar>
                <BusinessPerformance />
            </SimpleSideBar>
        </>
    );
}
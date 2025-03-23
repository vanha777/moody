'use client'
import SimpleNavBar from "@/app/dashboard/components/simpleNavBar";
import SimpleSideBar from "@/app/dashboard/components/simpleSideBar";
import IdeaCard from "./ideaCard";

export default function Main() {
    return (
        <>
            <SimpleSideBar>
                    <IdeaCard />
            </SimpleSideBar>
        </>
    );
}
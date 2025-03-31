"use client";
import { AppProvider, useAppContext} from "@/app/utils/AppContext";
import MainUniverse from "./components/mainUniverse";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { Db, Server } from "@/app/utils/db";
import SimpleLoading from "./components/simpleLoading";
import { set } from "date-fns";
import { LoginResponse } from "./login/page";

interface InitialUserProps {
    rawUser?: any;
}

export default function DashboardClient({ rawUser }: InitialUserProps) {
    const { auth, logout, getUser } = useAppContext();
    const router = useRouter();
    const searchParams = useSearchParams();
    // const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                let initialUser: LoginResponse;
                if (rawUser) {
                    initialUser = JSON.parse(rawUser) as LoginResponse;
                } else {
                    const user = await getUser();
                    if (!user) {
                        throw new Error('No user found');
                    }
                    initialUser = await user;
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

    return <MainUniverse />;
}

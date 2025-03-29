'use client'
import { Suspense } from "react";
import SimpleLoading from "./dashboard/components/simpleLoading";
import DashboardClient from "./dashboard/DashboardClient";
import { redirect } from "next/navigation";
import { useAppContext } from "./utils/AppContext";
import type { Metadata } from 'next'
import { useSearchParams } from "next/navigation";
import MainUniverse from "./dashboard/components/mainUniverse";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const { auth, getUser } = useAppContext();
  const router = useRouter();
  if (auth) {
    return <MainUniverse />
  } else {
    const user = getUser();
    if (user) {
      return <MainUniverse />
    } else {
      router.push('/dashboard/login')
    }
  }
}

'use client'
import { Suspense } from "react";
import SimpleLoading from "../dashboard/components/simpleLoading";
import DashboardClient from "../dashboard/DashboardClient";
import { redirect } from "next/navigation";
import { useAppContext } from "../utils/AppContext";
import type { Metadata } from 'next'
import { useSearchParams } from "next/navigation";
import MainUniverse from "../dashboard/components/mainUniverse";
import { motion } from "framer-motion";

export default function Dashboard() {
  return (
      <MainUniverse />
  );
}

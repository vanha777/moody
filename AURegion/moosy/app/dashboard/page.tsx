'use client'
import { Suspense } from "react";
import SimpleLoading from "./components/simpleLoading";
import DashboardClient from "./DashboardClient";
import { redirect } from "next/navigation";
import { UserData } from "../utils/AppContext";
import type { Metadata } from 'next'
import { useSearchParams } from "next/navigation";
import MainUniverse from "./components/mainUniverse";

// export const metadata: Metadata = {
//   title: 'CoLaunch - Connect Business and Scale Up',
//   description: 'CoLaunch is a platform that connects businesses and scale ups with the right people and resources to help them grow.',
//   openGraph: {
//     title: 'CoLaunch - Connect Business and Scale Up',
//     description: 'CoLaunch is a platform that connects businesses and scale ups with the right people and resources to help them grow.',
//     // url: 'https://www.metaloot.dev/',
//     images: [
//       {
//         url: 'https://vbfejmafjqgcfrzxewcd.supabase.co/storage/v1/object/public/general//colaunchit.jpeg',
//         alt: 'CoLaunch - Connect Business and Scale Up',
//       },
//     ],
//   },
//   icons: {
//     icon: '/logo.png',
//     // You can also specify different sizes
//     apple: [
//       { url: '/logo.png' },
//       { url: '/apple.png', sizes: '180x180' }
//     ],
//     shortcut: '/favicon.ico'
//   },
// };

export default function Dashboard() {
  const searchParams = useSearchParams();
  const initialUser = searchParams.get('user');
  console.log("initialUser", initialUser);
  return (
    // <Suspense fallback={<SimpleLoading />}>
      // <DashboardClient rawUser={initialUser} />
      <MainUniverse rawUser={initialUser} />
    // </Suspense>
  );
}

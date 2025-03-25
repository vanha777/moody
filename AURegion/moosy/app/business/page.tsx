'use client'
import { Suspense } from "react";
import SimpleLoading from "../dashboard/components/simpleLoading";
import DashboardClient from "../dashboard/DashboardClient";
import { redirect } from "next/navigation";
import { UserData } from "../utils/AppContext";
import type { Metadata } from 'next'
import { useSearchParams } from "next/navigation";
import MainUniverse from "../dashboard/components/mainUniverse";
import { motion } from "framer-motion";

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
  const initialUser = JSON.stringify({"id":1,"created_at":"2025-02-20T04:07:48.884114+00:00","email":"vanha101096@gmail.com","name":"Minion Van","type":"founder","photo":"https://lh3.googleusercontent.com/a/ACg8ocLpvZKCFXsRyAqki7sk-ak2UifnOIH6oBL6Biz7ROzxGPiUve0U=s96-c","x":"https://x.com/patricksaturnor","github":"https://github.com/vanha777","linkedin":"","website":"","instagram":""});
  // const searchParams = useSearchParams();
  // const initialUser = searchParams.get('user');
  // console.log("initialUser", initialUser);
  return (
    // <Suspense fallback={<SimpleLoading />}>
    // <DashboardClient rawUser={initialUser} />
      <MainUniverse rawUser={initialUser} />
    // </Suspense>
  );
}

'use client'
import { Suspense } from "react";
import SimpleLoading from "./components/simpleLoading";
import DashboardClient from "./DashboardClient";
import { redirect } from "next/navigation";
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
  // const searchParams = useSearchParams();
  // const initialUser = searchParams.get('user');
  // console.log("initialUser", initialUser);
  const initialUser = {"id":1,"created_at":"2025-02-20T04:07:48.884114+00:00","email":"vanha101096@gmail.com","name":"Minion Van","type":"founder","photo":"https://lh3.googleusercontent.com/a/ACg8ocLpvZKCFXsRyAqki7sk-ak2UifnOIH6oBL6Biz7ROzxGPiUve0U=s96-c","x":"https://x.com/patricksaturnor","github":"https://github.com/vanha777","linkedin":"","website":"","instagram":""};
  return (
    // <Suspense fallback={<SimpleLoading />}>
      // <DashboardClient rawUser={initialUser} />
      <MainUniverse  />
    // </Suspense>
  );
}

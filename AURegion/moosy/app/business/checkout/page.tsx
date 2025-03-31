"use client"; // Mark as client component
import { Suspense } from 'react';
import Main from './components/main';
import SimpleLoading from '@/app/dashboard/components/simpleLoading';

export default function Page() {
    return (
        <Suspense fallback={<SimpleLoading />}>
            <Main />
        </Suspense>
    );
}

import type { Metadata } from 'next'
import Main from './components/main';

export const revalidate = 0
export default async function IdeaPage() {
    return (
        <Main />
    )
}

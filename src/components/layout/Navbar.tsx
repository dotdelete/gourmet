import { signIn, signOut, useSession } from 'next-auth/react';
import Link from 'next/link';

export default function Navbar() {
    const { data: session } = useSession();

    return (
        <header className="bg-white shadow-md">
            <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                <Link
                    className="mt-2 inline-block bg-linear-to-r/oklab
                    from-orange-300 to-orange-500
                    bg-clip-text font-serif text-2xl font-bold italic text-transparent md:mt-0"
                    href="/" hx-boost="true" hx-target="#page" hx-select="#page"
                    hx-swap="outerHTML show:window:top">Gourmet</Link>
                <nav className="flex items-center space-x-6">
                    {session ? (
                        <>
                            <Link href="/profile" className="text-gray-600 hover:text-gray-900">
                                Profile
                            </Link>
                            <Link href="/favorites" className="text-gray-600 hover:text-gray-900">
                                Favoris
                            </Link>
                            <button onClick={() => signOut()} className="text-gray-600 hover:text-gray-900">
                                Logout
                            </button>
                        </>
                    ) : (
                        <button onClick={() => signIn()} className="text-gray-600 hover:text-gray-900">
                            Login
                        </button>
                    )}
                </nav>
            </div>
        </header>
    );
}
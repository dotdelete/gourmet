import React from "react";
import Link from "next/link";

export default function Navbar() {
    return (
        <header className="bg-white shadow-md">
            <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                <Link
                    className="mt-2 inline-block bg-linear-to-r/oklab
                    from-orange-300 to-orange-500
                    bg-clip-text font-serif text-2xl font-bold italic text-transparent md:mt-0"
                    href="/" hx-boost="true" hx-target="#page" hx-select="#page"
                    hx-swap="outerHTML show:window:top">Gourmet</Link>
                <input
                    className="h-full w-64 max-w-[90vh] rounded-full border border-stone-200
                    dark:border-stone-800 p-2 px-4 text-stone-500 dark:text-zinc-400
                    hover:bg-stone-100 dark:hover:bg-stone-700 dark:bg-zinc-600 focus:border-transparent
                    focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                    type="text" id="searchInput" name="q" placeholder="orange, crème brulée..." hx-get="/search"
                    hx-push-url="true" hx-trigger="keyup changed delay:100ms, search" hx-target="#page"
                    hx-select="#page" hx-swap="outerHTML" hx-indicator="#search-indicator"/>
                <nav className="flex items-center space-x-6">
                    <Link href="/login" className="text-gray-600 hover:text-gray-900">
                        Login
                    </Link>
                </nav>
            </div>
        </header>
    );
};
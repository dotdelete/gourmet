import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import React, { useState } from "react";

interface NavbarProps {
  onSearch: (query: string) => void;
}

export default function Navbar({ onSearch }: NavbarProps) {
  const { data: session } = useSession();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    onSearch(e.target.value);
  };

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link
          className="mt-2 inline-block bg-linear-to-r/oklab
          from-orange-300 to-orange-500
          bg-clip-text font-serif text-2xl font-bold italic text-transparent md:mt-0"
          href="/"
          hx-boost="true"
          hx-target="#page"
          hx-select="#page"
          hx-swap="outerHTML show:window:top"
        >
          Gourmet
        </Link>
        <input
          className="h-full w-64 max-w-[90vh] rounded-full border border-stone-200
          dark:border-stone-800 p-2 px-4 text-stone-500 dark:text-zinc-400
          hover:bg-stone-100 dark:hover:bg-stone-700 dark:bg-zinc-600 focus:border-transparent
          focus:outline-hidden focus:ring-2 focus:ring-blue-500"
          type="text"
          id="searchInput"
          name="q"
          placeholder="orange, crème brulée..."
          value={searchQuery}
          onChange={handleSearchChange}
        />
        <nav className="flex items-center space-x-6">
          {session ? (
            <>
              <Link
                href="/profile"
                className="text-gray-600 hover:text-gray-900"
              >
                Profile
              </Link>
              <Link
                href="/favorites"
                className="text-gray-600 hover:text-gray-900"
              >
                Favoris
              </Link>
              <button
                onClick={() => signOut()}
                className="text-gray-600 hover:text-gray-900"
              >
                Logout
              </button>
            </>
          ) : (
            <button
              onClick={() => signIn()}
              className="text-gray-600 hover:text-gray-900"
            >
              Login
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}

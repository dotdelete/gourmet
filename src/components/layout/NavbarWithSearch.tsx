import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import React, { useState, useRef, useEffect } from "react";
import { SearchIcon } from "@/components/icons";

interface NavbarProps {
  onSearch: (query: string) => void;
}

export default function Navbar({ onSearch }: NavbarProps) {
  const { data: session } = useSession();
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [shortcutText, setShortcutText] = useState("⌘K");
  
  // Déplacer la détection du système vers useEffect pour éviter les erreurs d'hydratation
  useEffect(() => {
    // Déterminer le système d'exploitation pour afficher le bon raccourci
    const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
    setShortcutText(isMac ? '⌘K' : 'Ctrl+K');
    
    // Gérer le raccourci clavier pour focus la recherche
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check for CMD+K or CTRL+K
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Gestionnaire pour la touche Échap
  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      searchInputRef.current?.blur();
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  return (
    <>
      {/* Fixed header */}
      <header className="fixed top-0 left-0 right-0 bg-white shadow-md z-20">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link
            className="inline-block bg-linear-to-r/oklab
            from-orange-300 to-orange-500
            bg-clip-text font-serif text-2xl font-bold italic text-transparent"
            href="/"
            hx-boost="true"
            hx-target="#page"
            hx-select="#page"
            hx-swap="outerHTML show:window:top"
          >
            Gourmet
          </Link>
          
          <div className="flex-1 max-w-xl mx-4 relative">
            <form onSubmit={handleSearchSubmit} className="relative flex items-center">
              <input
                ref={searchInputRef}
                className="h-10 w-full rounded-md border border-gray-300
                p-2 px-4 pr-12 text-gray-600
                hover:border-gray-400 focus:outline-none focus:border-orange-300
                focus:ring-0"
                type="text"
                id="searchInput"
                name="q"
                placeholder="Search for recipes..."
                value={searchQuery}
                onChange={handleSearchChange}
                onKeyDown={handleSearchKeyDown}
              />
              <div className="absolute right-12 flex items-center pointer-events-none">
                <span className="text-xs text-gray-400 border border-gray-300 rounded px-1">
                  {shortcutText}
                </span>
              </div>
              <button 
                type="submit"
                className="absolute right-0 h-10 w-10 flex items-center justify-center bg-orange-500 hover:bg-orange-600 text-white rounded-r-md"
                aria-label="Search"
              >
                <SearchIcon className="h-5 w-5" />
              </button>
            </form>
          </div>

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

      {/* Spacer div to prevent content from hiding under the fixed navbar */}
      <div className="h-[72px]"></div>
    </>
  );
}

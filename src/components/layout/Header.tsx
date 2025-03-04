"use client";

import Link from "next/link";
import { useAuth } from "@/lib/auth/auth-context";

export default function Header() {
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-gray-800">
          Gourmet
        </Link>
        
        <nav className="flex items-center space-x-6">
          <Link href="/" className="text-gray-600 hover:text-gray-900">
            Accueil
          </Link>
          {isAuthenticated ? (
            <>
              <Link href="/favorites" className="text-gray-600 hover:text-gray-900">
                Mes Favoris
              </Link>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">
                  Bonjour, {user?.full_name || user?.username}
                </span>
                <button
                  onClick={() => logout()}
                  className="text-sm text-red-600 hover:text-red-800"
                >
                  Déconnexion
                </button>
              </div>
            </>
          ) : (
            <Link
              href="/login"
              className="text-gray-600 hover:text-gray-900"
            >
              Connexion
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import MainLayout from "@/components/layout/MainLayout";
import { useAuth } from "@/lib/auth/auth-context";
import { favoritesApi } from "@/lib/api/client";
import { GetFavoritesByUserRow } from "@/types";
import RecipeCard from "@/components/recipes/RecipeCard";

export default function FavoritesPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [favorites, setFavorites] = useState<GetFavoritesByUserRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!authLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, authLoading, router]);

  useEffect(() => {
    const fetchFavorites = async () => {
      if (!isAuthenticated) return;
      
      try {
        setIsLoading(true);
        const data = await favoritesApi.getMyFavorites();
        setFavorites(data);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch favorites:", err);
        setError("Impossible de charger vos recettes favorites. Veuillez réessayer plus tard.");
      } finally {
        setIsLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchFavorites();
    }
  }, [isAuthenticated]);

  if (authLoading) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </MainLayout>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect to login
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Mes recettes favorites</h1>
        
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        ) : favorites.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">Vous n'avez pas encore de recettes favorites.</p>
            <a 
              href="/"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded"
            >
              Découvrir des recettes
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favorites.map((favorite) => (
              <RecipeCard key={favorite.recipe.id} recipe={favorite.recipe} />
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
}

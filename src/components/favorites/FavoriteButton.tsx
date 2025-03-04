"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth/auth-context";
import { favoritesApi } from "@/lib/api/client";

interface FavoriteButtonProps {
  recipeId: string;
}

export default function FavoriteButton({ recipeId }: FavoriteButtonProps) {
  const { user } = useAuth();
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Check if recipe is in favorites when component mounts
  useEffect(() => {
    const checkFavoriteStatus = async () => {
      if (!user) return;
      
      try {
        const favorites = await favoritesApi.getMyFavorites();
        const isFav = favorites.some(fav => fav.recipe.id === recipeId);
        setIsFavorite(isFav);
      } catch (error) {
        console.error("Error checking favorite status:", error);
      }
    };

    checkFavoriteStatus();
  }, [recipeId, user]);

  const toggleFavorite = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      if (isFavorite) {
        await favoritesApi.removeFavorite(user.username, recipeId);
        setIsFavorite(false);
      } else {
        await favoritesApi.addFavorite(user.username, recipeId);
        setIsFavorite(true);
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={toggleFavorite}
      disabled={isLoading}
      className={`p-1 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
        isLoading ? "opacity-50 cursor-not-allowed" : ""
      }`}
      aria-label={isFavorite ? "Retirer des favoris" : "Ajouter aux favoris"}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill={isFavorite ? "currentColor" : "none"}
        stroke="currentColor"
        className={`w-6 h-6 ${
          isFavorite ? "text-red-500" : "text-gray-400"
        }`}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
        />
      </svg>
    </button>
  );
}

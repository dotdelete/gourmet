import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { favoritesApi } from '@/lib/api/client';
import { HeartIcon, HeartSolidIcon } from "@/components/icons";

interface FavoriteButtonProps {
  recipeId: string;
  variant?: 'default' | 'contained';
}

const FavoriteButton: React.FC<FavoriteButtonProps> = ({ recipeId, variant = 'default' }) => {
  const { data: session } = useSession();
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const checkIsFavorite = async () => {
      if (!session?.user?.id) {
        return;
      }

      try {
        const favorites = await favoritesApi.getMyFavorites();
        const isCurrentlyFavorite = favorites?.some?.(
          (favorite) => favorite.recipe.id === recipeId
        ) ?? false;
        setIsFavorite(isCurrentlyFavorite);
      } catch (error) {
        console.error('Error fetching favorites:', error);
        // Handle error (e.g., display a message)
      }
    };

    checkIsFavorite();
  }, [recipeId, session]);

  const toggleFavorite = async () => {
    if (!session) {
      window.location.href = '/login';
      return;
    }

    setLoading(true);
    try {
      if (isFavorite) {
        // Remove from favorites
        await favoritesApi.removeFavorite(session.user.id, recipeId);
        setIsFavorite(false);
      } else {
        // Add to favorites
        await favoritesApi.addFavorite(session.user.id, recipeId);
        setIsFavorite(true);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      // Display error message to the user
    } finally {
      setLoading(false);
    }
  };

  const baseButtonClasses = "focus:outline-none hover:cursor-pointer";
  const variantClasses = variant === 'contained' 
    ? "bg-gray-100 hover:bg-gray-200 p-2 rounded-full flex items-center justify-center" 
    : "text-orange-500 hover:text-orange-700";

  return (
    <button
      onClick={toggleFavorite}
      disabled={loading}
      className={`${baseButtonClasses} ${variantClasses}`}
    >
      {isFavorite ? <HeartSolidIcon className="h-6 w-6 text-orange-500" /> : <HeartIcon className="h-6 w-6 text-orange-500" />}
    </button>
  );
};

export default FavoriteButton;

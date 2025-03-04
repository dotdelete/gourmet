"use client";

import Image from "next/image";
import Link from "next/link";
import { Recipe } from "@/types";
import { useAuth } from "@/lib/auth/auth-context";
import FavoriteButton from "@/components/favorites/FavoriteButton";

interface RecipeCardProps {
  recipe: Recipe;
}

export default function RecipeCard({ recipe }: RecipeCardProps) {
  const { isAuthenticated } = useAuth();
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative h-48 w-full">
        {recipe.image_url ? (
          <Image
            src={recipe.image_url}
            alt={recipe.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-400">Pas d'image</span>
          </div>
        )}
      </div>
      
      <div className="p-4">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-semibold mb-2 text-gray-800">
            <Link href={`/recettes/${recipe.id}`} className="hover:text-blue-600">
              {recipe.name}
            </Link>
          </h3>
          {isAuthenticated && (
            <FavoriteButton recipeId={recipe.id} />
          )}
        </div>
        
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {recipe.description}
        </p>
        
        <div className="flex justify-between text-xs text-gray-500">
          <span>Préparation: {recipe.prep_time} min</span>
          <span>Cuisson: {recipe.cook_time} min</span>
        </div>
        
        <div className="mt-3 pt-3 border-t border-gray-100 flex justify-between items-center">
          <span className="inline-block bg-gray-100 rounded-full px-3 py-1 text-xs font-semibold text-gray-600">
            {recipe.category}
          </span>
          <Link 
            href={`/recettes/${recipe.id}`}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            Voir la recette
          </Link>
        </div>
      </div>
    </div>
  );
}

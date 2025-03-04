"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import MainLayout from "@/components/layout/MainLayout";
import { Recipe } from "@/types";
import { recipesApi } from "@/lib/api/client";
import { useAuth } from "@/lib/auth/auth-context";
import FavoriteButton from "@/components/favorites/FavoriteButton";

export default function RecipeDetailPage() {
  const { id } = useParams();
  const { isAuthenticated } = useAuth();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [relatedRecipes, setRelatedRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecipe = async () => {
      if (!id) return;
      
      try {
        setIsLoading(true);
        const recipeId = Array.isArray(id) ? id[0] : id;
        const data = await recipesApi.getById(recipeId);
        setRecipe(data);
        
        // Fetch related recipes
        const related = await recipesApi.getRelated(recipeId);
        setRelatedRecipes(related);
        
        setError(null);
      } catch (err) {
        console.error("Failed to fetch recipe:", err);
        setError("Impossible de charger la recette. Veuillez réessayer plus tard.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecipe();
  }, [id]);

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </MainLayout>
    );
  }

  if (error || !recipe) {
    return (
      <MainLayout>
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Erreur!</strong>
          <span className="block sm:inline"> {error || "Recette introuvable"}</span>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-8">
        {/* Recipe Header */}
        <div className="flex flex-col md:flex-row justify-between items-start gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">{recipe.name}</h1>
            <p className="text-gray-600 mt-2">{recipe.description}</p>
          </div>
          {isAuthenticated && (
            <FavoriteButton recipeId={recipe.id} />
          )}
        </div>
        
        {/* Recipe Image */}
        <div className="relative h-64 md:h-96 w-full rounded-lg overflow-hidden">
          {recipe.image_url ? (
            <Image
              src={recipe.image_url}
              alt={recipe.name}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-400">Pas d'image</span>
            </div>
          )}
        </div>
        
        {/* Recipe Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-700">Préparation</h3>
            <p className="text-gray-600">{recipe.prep_time} minutes</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-700">Cuisson</h3>
            <p className="text-gray-600">{recipe.cook_time} minutes</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-700">Portions</h3>
            <p className="text-gray-600">{recipe.servings} personnes</p>
          </div>
        </div>
        
        {/* Recipe Instructions */}
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Instructions</h2>
          <div className="prose max-w-none">
            {recipe.instructions.split('\n').map((paragraph, index) => (
              <p key={index} className="mb-4">{paragraph}</p>
            ))}
          </div>
        </div>
        
        {/* Related Recipes */}
        {relatedRecipes.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Recettes similaires</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedRecipes.slice(0, 3).map((relatedRecipe) => (
                <div key={relatedRecipe.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="relative h-40 w-full">
                    {relatedRecipe.image_url ? (
                      <Image
                        src={relatedRecipe.image_url}
                        alt={relatedRecipe.name}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw"
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-400">Pas d'image</span>
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-semibold mb-2 text-gray-800">
                      <a href={`/recettes/${relatedRecipe.id}`} className="hover:text-blue-600">
                        {relatedRecipe.name}
                      </a>
                    </h3>
                    <p className="text-gray-600 text-sm line-clamp-2">
                      {relatedRecipe.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}

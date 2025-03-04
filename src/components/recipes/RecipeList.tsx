"use client";

import { useState, useEffect } from "react";
import { Recipe } from "@/types";
import { recipesApi } from "@/lib/api/client";
import RecipeCard from "./RecipeCard";

export default function RecipeList() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        setIsLoading(true);
        const data = await recipesApi.getAll();
        setRecipes(data);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch recipes:", err);
        setError("Impossible de charger les recettes. Veuillez réessayer plus tard.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecipes();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Erreur!</strong>
        <span className="block sm:inline"> {error}</span>
      </div>
    );
  }

  if (recipes.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Aucune recette disponible pour le moment.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {recipes.map((recipe) => (
        <RecipeCard key={recipe.id} recipe={recipe} />
      ))}
    </div>
  );
}

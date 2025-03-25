import React, { ReactElement, useEffect, useRef, useState } from "react";
import RecipeCard from "@/components/RecipeCard";
import { Recipe } from "@/types";
import { favoritesApi, recipesApi } from "@/lib/api/client";
import {  Loader2 } from "lucide-react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import PageLayout from "@/components/layout/PageLayout";

export default function FavoritesPage() {
  const [favoriteRecipes, setFavoriteRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const recipeGridRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { status } = useSession();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }

    if (status === "authenticated") {
      async function fetchFavoriteRecipes() {
        try {
          setIsLoading(true);
          const favorites = await favoritesApi.getMyFavorites();
          const recipePromises = (favorites ?? []).map((fav) =>
            recipesApi.getById(fav.recipe.id.toString())
          );
          const recipes = await Promise.all(recipePromises);
          setFavoriteRecipes(recipes);
        } catch (error) {
          console.error("Failed to fetch favorites:", error);
        } finally {
          setIsLoading(false);
        }
      }

      fetchFavoriteRecipes();
    }
  }, [status, router]);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Main Content */}
      <div className="flex-grow">
        <div
          ref={recipeGridRef}
          className="container mx-auto px-4 py-12 space-y-6"
        >
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">
              Votre Collection Personnelle
            </h2>
            <p className="text-gray-600 max-w-xl mx-auto">
              {favoriteRecipes.length} recettes favorites
            </p>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-12 w-12 text-gray-400 animate-spin" />
            </div>
          ) : favoriteRecipes.length === 0 ? (
            <div className="text-center text-gray-500 py-12">
              {"Vous n'avez pas encore de recettes favorites"}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
              {favoriteRecipes.map((recipe) => (
                <RecipeCard key={recipe.id} recipe={recipe} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

FavoritesPage.getLayout = function getLayout(page: ReactElement) {
  return (
    <PageLayout>{page as ReactElement<{ searchQuery?: string }>}</PageLayout>
  );
};

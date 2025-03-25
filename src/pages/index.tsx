import React, { ReactElement, useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import HomePageLayout from '@/components/layout/HomePageLayout';
import RecipeCard from '@/components/RecipeCard';
import { Recipe } from '@/types';
import { recipesApi } from '@/lib/api/client';
import { ChevronDown } from 'lucide-react';

export default function Home({ searchQuery }: { searchQuery: string }) {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [filteredRecipes, setFilteredRecipes] = useState<Recipe[]>([]);
  const recipeGridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchRecipes() {
      try {
        const data = await recipesApi.getAll();
        setRecipes(data);
        setFilteredRecipes(data);
      } catch (error) {
        console.error('Failed to fetch recipes:', error);
      }
    }
    fetchRecipes();
  }, []);

  useEffect(() => {
    const filtered = recipes.filter(recipe =>
      recipe.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredRecipes(filtered);
  }, [searchQuery, recipes]);

  const scrollToRecipes = () => {
    recipeGridRef.current?.scrollIntoView({ 
      behavior: 'smooth' 
    });
  };

  return (
    <div className="relative">
      {/* Banner Section */}
      <div className="relative h-[80vh] w-full overflow-hidden">
        {/* Background Image */}
        <Image 
          src="/cuisine-banner.webp" 
          alt="Culinary Delights Banner" 
          fill
          priority
          className="object-cover brightness-50"
        />
        
        {/* Overlay Content */}
        <div className="absolute inset-0 flex flex-col justify-center items-center text-center text-white px-4">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 drop-shadow-lg">
            Découvrez nos recettes
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-2xl drop-shadow-md">
            Explorez une collection de recettes qui transformeront votre cuisine en un chef-d&apos;œuvre
          </p>
          
          {/* Scroll Down Button */}
          <button 
            onClick={scrollToRecipes}
            className="animate-bounce bg-white/20 hover:bg-white/30 transition-all 
                       rounded-full p-4 group focus:cursor-pointer focus:outline-none"
            aria-label="Scroll to Recipes"
          >
            <ChevronDown 
              className="text-white group-hover:scale-110 transition-transform" 
              size={40} 
            />
          </button>
        </div>
      </div>

      {/* Recipe Grid Section */}
      <div 
        ref={recipeGridRef} 
        className="container mx-auto px-4 py-12 space-y-6"
      >
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">
            Nos Délicieuses Recettes
          </h2>
          <p className="text-gray-600 max-w-xl mx-auto">
            {filteredRecipes.length} recettes prêtes à être découvertes
          </p>
        </div>

        {filteredRecipes.length === 0 ? (
          <div className="text-center text-gray-500 py-12">
            Aucune recette ne correspond à votre recherche
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
            {filteredRecipes.map(recipe => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

Home.getLayout = function getLayout(page: ReactElement) {
    return <HomePageLayout>{page as ReactElement<{searchQuery?: string}>}</HomePageLayout>;
};
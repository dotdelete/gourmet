import { ReactElement, useEffect, useState } from 'react';
import HomePageLayout from '@/components/layout/HomePageLayout';
import RecipeCard from '@/components/RecipeCard';
import { Recipe } from '@/types';
import { recipesApi } from '@/lib/api/client';

export default function Home({ searchQuery }: { searchQuery: string }) {
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [filteredRecipes, setFilteredRecipes] = useState<Recipe[]>([]);

    useEffect(() => {
        async function fetchRecipes() {
            const data = await recipesApi.getAll();
            setRecipes(data);
            setFilteredRecipes(data);
        }

        fetchRecipes();
    }, []);

    useEffect(() => {
        const filtered = recipes.filter(recipe =>
            recipe.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredRecipes(filtered);
    }, [searchQuery, recipes]);

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Découvrez nos recettes</h1>
            <p className="text-gray-600">
                Explorez notre collection de recettes délicieuses et faciles à préparer.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredRecipes.map(recipe => (
                    <RecipeCard key={recipe.id} recipe={recipe} />
                ))}
            </div>
        </div>
    );
}

Home.getLayout = function getLayout(page: ReactElement) {
    return <HomePageLayout>{page as ReactElement<{searchQuery?: string}>}</HomePageLayout>;
};
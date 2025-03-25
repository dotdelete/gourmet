import React from 'react';
import Link from 'next/link';
import { Recipe } from '@/types';

interface RecipeCardProps {
    recipe: Recipe;
}

const RecipeCard: React.FC<RecipeCardProps> = ({ recipe }) => {
    return (
        <Link href={`/recipes/${recipe.id}`}>
            <div className="border rounded-lg p-4 shadow-md cursor-pointer">
                <img src={recipe.image_url} alt={recipe.name} className="w-full h-48 object-cover rounded-md" />
                <h2 className="text-xl font-bold mt-2">{recipe.name}</h2>
                <p className="text-gray-600">{recipe.description}</p>
            </div>
        </Link>
    );
};

export default RecipeCard;
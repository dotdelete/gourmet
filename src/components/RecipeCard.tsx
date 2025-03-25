import React from 'react';
import Link from 'next/link';
import { Recipe } from '@/types';

interface RecipeCardProps {
    recipe: Recipe;
}

const RecipeCard: React.FC<RecipeCardProps> = ({ recipe }) => {
    return (
        <Link href={`/recipes/${recipe.id}`}>
            <div className="rounded-lg p-4 shadow-lg cursor-pointer">
                <div className="relative">
                    <img
                        src={recipe.image_url || ''}
                        alt={recipe.image_url ? recipe.name : ''}
                        className="w-full h-48 object-cover rounded-md flex items-center justify-center border-none"
                        style={{
                            background: recipe.image_url ? 'none' : 'linear-gradient(to right, #f5f5dc,rgb(230, 215, 194))', // soft beige gradient
                        }}
                    />
                    {!recipe.image_url && (
                        <div className="absolute inset-0 flex items-center justify-center text-4xl text-orange-500">
                            🍽 
                        </div>
                    )}
                </div>
                <h2 className="text-xl font-bold mt-2">{recipe.name}</h2>
                <p className="text-gray-600 mt-2">{recipe.description}</p>
                <p className="text-gray-800 font-medium mt-4">{recipe.cook_time} mins</p>
            </div>
        </Link>
    );
};

export default RecipeCard;
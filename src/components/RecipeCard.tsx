import React from "react";
import Link from "next/link";
import { Recipe } from "@/types";
import Image from "next/image";
import FavoriteButton from "./FavoriteButton";

interface RecipeCardProps {
  recipe: Recipe;
}

const RecipeCard: React.FC<RecipeCardProps> = ({ recipe }) => {
  return (
    <div className="border rounded-lg p-4 shadow-md relative">
      <div>
        <Link href={`/recipes/${recipe.id}`} className="block cursor-pointer relative">
          <Image
            src={recipe.image_url}
            alt={recipe.image_url ? recipe.name : ""}
            width={500}
            height={300}
            className="w-full h-48 object-cover rounded-md flex items-center justify-center border-none"
            style={{
              background: recipe.image_url
          ? "none"
          : "linear-gradient(to right, #f5f5dc,rgb(230, 215, 194))", // soft beige gradient
            }}
          />
          {!recipe.image_url && (
            <div className="absolute inset-0 flex items-center justify-center text-4xl text-orange-500">
              🍽
            </div>
          )}
        </Link>
        <div>
          <div className="mt-2 flex justify-between items-center">
            <Link
              href={`/recipes/${recipe.id}`}
              className="block cursor-pointer"
            >
              <div className="flex-1">
                <h2 className="text-xl font-bold">{recipe.name}</h2>
                <p className="text-gray-600">{recipe.description}</p>
              </div>
            </Link>
            <div>
              <FavoriteButton recipeId={recipe.id} />
            </div>
          </div>
          <p className="text-gray-800 font-medium mt-4">
            {recipe.cook_time} mins
          </p>
        </div>
      </div>
    </div>
  );
};

export default RecipeCard;

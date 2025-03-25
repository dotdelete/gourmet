import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import Image from "next/image";
import { Recipe } from "@/types";
import { recipesApi } from "@/lib/api/client";
import PageLayout from "@/components/layout/PageLayout";
import {
  ClockIcon,
  UsersIcon,
  TagIcon,
  CalendarIcon,
  DollarSignIcon,
  ActivityIcon,
} from "lucide-react";
import { useMemo } from "react";

interface RecipeDetailsProps {
  recipe: Recipe;
}

const RecipeDetails: React.FC<RecipeDetailsProps> = ({ recipe }) => {
  const router = useRouter();

  /**
   * Cleans and formats instruction text by:
   * - Removing bullet points or numbered list markers
   * - Converting Markdown bold syntax (**text**) to HTML strong tags
   * - Converting Markdown italic syntax (*text*) to HTML em tags
   * - Converting Markdown links ([text](url)) to HTML anchor tags
   * - Removing any HTML tags
   * - Removing function-like patterns (name(params))
   *
   * @param instruction - The raw instruction text to clean
   * @returns The cleaned and formatted instruction text
   */
  const cleanInstructiontext = (instruction: string) => {
    return instruction
      .replace(/^(?:-|[0-9]\.)\s+/, "")
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.*?)\*/g, "<em>$1</em>")
      .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2">$1</a>')
      .replace(/<.*?>/g, "")
      .replace(/([a-zA-Z0-9]+)\((.*?)\)/g, "");
  };

  const instructionsFiltered = useMemo(
    () =>
      recipe.instructions
        .split("\n")
        .map((instruction) => cleanInstructiontext(instruction.trim()))
        .filter((instruction) => instruction),
    [recipe.instructions]
  );

  if (router.isFallback) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-pulse text-xl font-medium text-gray-700">
          Loading recipe...
        </div>
      </div>
    );
  }

  return (
    <PageLayout>
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Hero Section with Overlay */}
        <div className="relative h-96 rounded-xl overflow-hidden shadow-xl mb-8">
          <Image
            src={recipe.image_url}
            alt={recipe.name}
            fill
            sizes="(max-width: 1200px) 100vw, 1200px"
            style={{ objectFit: "cover" }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end">
            <div className="p-8 w-full">
              <h1 className="text-4xl font-extrabold text-white mb-2">
                {recipe.name}
              </h1>
              <p className="text-white/90 text-lg">{recipe.description}</p>
            </div>
          </div>
        </div>

        {/* Recipe Details Card */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 bg-orange-50 border-b border-orange-100">
            <div className="flex items-center gap-2">
              <ClockIcon className="w-5 h-5 text-orange-500" />
              <div>
                <p className="text-xs text-gray-500">Prep Time</p>
                <p className="font-medium">{recipe.prep_time} min</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <ClockIcon className="w-5 h-5 text-orange-500" />
              <div>
                <p className="text-xs text-gray-500">Cook Time</p>
                <p className="font-medium">{recipe.cook_time} min</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <UsersIcon className="w-5 h-5 text-orange-500" />
              <div>
                <p className="text-xs text-gray-500">Servings</p>
                <p className="font-medium">{recipe.servings}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <CalendarIcon className="w-5 h-5 text-orange-500" />
              <div>
                <p className="text-xs text-gray-500">When to Eat</p>
                <p className="font-medium">{recipe.when_to_eat}</p>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="p-6">
            <div className="mb-6">
              <div className="flex gap-2 items-center mb-2">
                <TagIcon className="w-5 h-5 text-orange-500" />
                <h3 className="text-lg font-semibold">Category</h3>
              </div>
              <p className="ml-7 text-gray-700">{recipe.category}</p>
            </div>

            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">
                Instructions
              </h3>
              <div className="whitespace-pre-line text-gray-700 leading-relaxed">
                {instructionsFiltered.map((instruction, index) => (
                  <div key={index} className="mb-4 flex">
                    <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-orange-100 text-orange-800 font-medium text-sm mr-2 flex-shrink-0 mt-1">
                      {index + 1}
                    </span>
                    <p>{instruction}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Additional Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 bg-gray-50 p-4 rounded-lg">
              {recipe.calories && (
                <div className="flex items-center gap-2">
                  <ActivityIcon className="w-5 h-5 text-orange-500" />
                  <div>
                    <p className="text-xs text-gray-500">Calories</p>
                    <p className="font-medium">{recipe.calories}</p>
                  </div>
                </div>
              )}
              {recipe.cost && (
                <div className="flex items-center gap-2">
                  <DollarSignIcon className="w-5 h-5 text-orange-500" />
                  <div>
                    <p className="text-xs text-gray-500">Estimated Cost</p>
                    <p className="font-medium">${recipe.cost.toFixed(2)}</p>
                  </div>
                </div>
              )}
            </div>

            {recipe.disclaimer && (
              <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
                <h4 className="font-medium text-blue-800 mb-1">Disclaimer</h4>
                <p className="text-sm text-blue-700">{recipe.disclaimer}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.params!;
  const recipe = await recipesApi.getById(id as string);

  if (!recipe) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      recipe,
    },
  };
};

export default RecipeDetails;

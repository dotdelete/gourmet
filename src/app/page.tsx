import MainLayout from "@/components/layout/MainLayout";
import RecipeList from "@/components/recipes/RecipeList";

export default function Home() {
  return (
    <MainLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Découvrez nos recettes</h1>
        <p className="text-gray-600">
          Explorez notre collection de recettes délicieuses et faciles à préparer.
        </p>
        <RecipeList />
      </div>
    </MainLayout>
  );
}

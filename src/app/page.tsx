import PageLayout from "@/components/layout/PageLayout";

export default function Home() {
  return (
      <PageLayout>
        <div className="space-y-6">
          <h1 className="text-3xl font-bold">Découvrez nos recettes</h1>
          <p className="text-gray-600">
            Explorez notre collection de recettes délicieuses et faciles à préparer.
          </p>
        </div>
      </PageLayout>
  );
}
import PageLayout from "@/components/layout/PageLayout";
import {ReactElement} from "react";

export default function Home() {
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Découvrez nos recettes</h1>
            <p className="text-gray-600">
                Explorez notre collection de recettes délicieuses et faciles à préparer.
            </p>
        </div>
    );
}

Home.getLayout = function getLayout(page: ReactElement) {
    return (
        <PageLayout>
            {page}
        </PageLayout>
    )
}
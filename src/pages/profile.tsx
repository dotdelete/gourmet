import { useSession } from 'next-auth/react';
import {ReactElement} from "react";
import PageLayout from "@/components/layout/PageLayout";

export default function Profile() {
    const { data: session } = useSession();

    if (!session) {
        return <p className="text-center text-red-500">You must be logged in to view this page.</p>;
    }

    return (
        <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-center text-gray-800">Profile</h2>
            <div className="mt-4">
                <p><strong>Name:</strong> {session.user?.name}</p>
                <p><strong>Email:</strong> {session.user?.email}</p>
            </div>
        </div>
    );
}

Profile.getLayout = function getLayout(page: ReactElement) {
    return (
        <PageLayout>
            {page}
        </PageLayout>
    )
}
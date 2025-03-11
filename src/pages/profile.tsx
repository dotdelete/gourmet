import { useSession } from 'next-auth/react';
import { ReactElement, useEffect, useState } from 'react';
import PageLayout from "@/components/layout/PageLayout";
import {apiFetch} from "@/lib/api/client";
import { User } from "@/types";
import Link from "next/link";

export default function Profile() {
    const { data: session } = useSession();
    const [userData, setUserData] = useState<User | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (session?.accessToken) {
            setLoading(true);
            // Fetch user data using the token from the session
            apiFetch<User>("/me", {
                headers: {
                    Authorization: `Bearer ${session?.accessToken}`,
                },
            })
                .then((user) => {
                    setUserData(user);
                    setLoading(false);
                })
                .catch((error) => {
                    setError(error.message);
                    setLoading(false);
                });
        }
    }, [session]);

    if (!session) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gray-50">
                <div className="text-center p-8 bg-white rounded-lg shadow-md">
                    <div className="text-red-500 text-xl mb-2">⚠️ Access Denied</div>
                    <p className="text-gray-700">You must be logged in to view this page.</p>
                    <Link href="/login" className="mt-4 inline-block px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200">
                        Go to Login
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
                {error && (
                    <div className="bg-red-50 p-4 border-l-4 border-red-500">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm text-red-700">{error}</p>
                            </div>
                        </div>
                    </div>
                )}

                <div className="md:flex">
                    <div className="md:shrink-0 bg-gradient-to-r from-orange-300 to-orange-500 p-6 flex items-center justify-center">
                        <div className="h-24 w-24 rounded-full bg-white/30 flex items-center justify-center text-white text-4xl font-bold">
                            {userData?.full_name ? userData.full_name.charAt(0).toUpperCase() : '?'}
                        </div>
                    </div>
                    <div className="p-8">
                        <div className="tracking-wide text-sm text-blue-500 font-semibold mb-1">PROFILE</div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">Welcome Back!</h2>

                        {loading ? (
                            <div className="animate-pulse space-y-4">
                                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                            </div>
                        ) : userData ? (
                            <div className="space-y-4">
                                <div className="flex items-center border-b border-gray-200 pb-3">
                                    <svg className="h-5 w-5 text-gray-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                    <div>
                                        <div className="text-xs text-gray-500">Full Name</div>
                                        <div className="font-medium text-gray-800">{userData.full_name}</div>
                                    </div>
                                </div>

                                <div className="flex items-center border-b border-gray-200 pb-3">
                                    <svg className="h-5 w-5 text-gray-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                    <div>
                                        <div className="text-xs text-gray-500">Email</div>
                                        <div className="font-medium text-gray-800">{userData.email}</div>
                                    </div>
                                </div>

                                <div className="flex items-center border-b border-gray-200 pb-3">
                                    <svg className="h-5 w-5 text-gray-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                                    </svg>
                                    <div>
                                        <div className="text-xs text-gray-500">Username</div>
                                        <div className="font-medium text-gray-800">{userData.username}</div>
                                    </div>
                                </div>

                                <div className="flex items-center">
                                    <svg className="h-5 w-5 text-gray-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    <div>
                                        <div className="text-xs text-gray-500">Member Since</div>
                                        <div className="font-medium text-gray-800">
                                            {new Date(userData.created_at).toLocaleDateString()}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <p className="text-gray-600">Unable to load profile data.</p>
                        )}

                        <div className="mt-6 pt-6 border-t border-gray-200">
                            <Link href="/" className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150">
                                <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                                </svg>
                                Return to Home
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

Profile.getLayout = function getLayout(page: ReactElement) {
    return (
        <PageLayout>
            {page}
        </PageLayout>
    );
};
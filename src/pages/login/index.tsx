import { useState, FormEvent, ReactElement } from 'react';
import { useRouter } from 'next/router';
import PageLayout from "@/components/layout/PageLayout";
import { signIn, getSession } from 'next-auth/react';
import Cookies from 'js-cookie';

export default function LoginPage(): ReactElement {
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    // In your login page (index.tsx)
    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setError(null);
        setLoading(true);

        const formData = new FormData(event.currentTarget);
        const username = formData.get('username') as string;
        const password = formData.get('password') as string;

        try {
            const result = await signIn('credentials', {
                redirect: false,
                username,
                password,
            });

            if (result?.error) {
                setError("Invalid username or password");
                console.error("Login error:", result.error);
            } else if (result?.ok) {
                // Get the session to access the token
                const session = await getSession();
                if (session?.accessToken) {
                    // Set the token in a cookie
                    Cookies.set("auth_token", `Bearer ${session.accessToken}`, {
                        expires: 7,
                        sameSite: "strict",
                        path: "/"
                    });
                }
                await router.push('/profile');
            }
        } catch (error) {
            console.error("Unexpected error:", error);
            setError('An unexpected error occurred');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100">
            <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold text-center text-gray-800">Login</h2>

                {error && <p className="mt-2 text-center text-red-500">{error}</p>}

                <form onSubmit={handleSubmit} className="mt-4">
                    <div className="mb-4">
                        <label className="block text-gray-700 font-semibold mb-1">Username</label>
                        <input
                            type="text"
                            name="username"
                            placeholder="Enter your username"
                            required
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 font-semibold mb-1">Password</label>
                        <input
                            type="password"
                            name="password"
                            placeholder="Enter your password"
                            required
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition duration-200"
                        disabled={loading}
                    >
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>
            </div>
        </div>
    );
}

LoginPage.getLayout = function getLayout(page: ReactElement) {
    return (
        <PageLayout>
            {page}
        </PageLayout>
    );
};
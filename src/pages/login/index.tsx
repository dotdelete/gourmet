import { useState, FormEvent, ReactElement } from 'react';
import { useRouter } from 'next/router';
import { signIn } from 'next-auth/react';
import { authApi } from "@/lib/api/client";
import PageLayout from "@/components/layout/PageLayout";

type CustomError = {
    type?: string;
    message?: string;
};

export default function LoginPage(): ReactElement {
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setError(null);
        setLoading(true);

        const formData = new FormData(event.currentTarget);
        const email = formData.get('email') as string;
        const password = formData.get('password') as string;

        try {
            const response = await authApi.login({ username: email, password });

            if (response.token) {
                const result = await signIn('credentials', {
                    redirect: false,
                    email,
                    password,
                });

                if (result?.error) {
                    setError(result.error);
                } else {
                    await router.push('/profile');
                }
            } else {
                setError('Invalid email or password');
            }
        } catch (error) {
            const customError = error as CustomError;
            if (customError.type === 'CredentialsSignin') {
                setError('Invalid credentials.');
                // res.status(401).json({ error: 'Invalid credentials.' });
            } else {
                setError('An unexpected error occurred');
                // res.status(500).json({ error: 'Something went wrong.' });
            }
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
                        <label className="block text-gray-700 font-semibold mb-1">Email</label>
                        <input
                            type="email"
                            name="email"
                            placeholder="Enter your email"
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

                <p className="mt-4 text-center text-gray-600">
                    No account?{' '}
                    <a href="/register" className="text-blue-500 font-semibold hover:underline">
                        Sign up
                    </a>
                </p>
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
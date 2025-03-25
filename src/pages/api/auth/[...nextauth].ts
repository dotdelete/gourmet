import NextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import Cookies from "js-cookie";

const API_BASE_URL = "https://gourmet.cours.quimerch.com";

const authOptions: AuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                username: { label: "Username", type: "text" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                try {
                    if (!credentials?.username || !credentials?.password) {
                        return null;
                    }

                    const res = await fetch(`${API_BASE_URL}/login`, {
                        method: "POST",
                        body: JSON.stringify({
                            username: credentials.username,
                            password: credentials.password
                        }),
                        headers: {
                            "Content-Type": "application/json",
                            "Accept": "application/json, application/xml"
                        },
                    });

                    if (!res.ok) return null;

                    const { token } = await res.json();
                    const userRes = await fetch(`${API_BASE_URL}/me`, {
                        headers: {
                            "Authorization": `Bearer ${token}`
                        }
                    });

                    if (!userRes.ok) return null;

                    const user = await userRes.json();
                    return {
                        id: user.username,
                        name: user.full_name,
                        email: user.email,
                        token
                    };
                } catch (error) {
                    console.error("Auth error:", error);
                    return null;
                }
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.accessToken = user.token;
                token.id = user.id;
            }
            return token;
        },
        async session({ session, token }) {
            if (token.accessToken) {
                session.accessToken = token.accessToken;
                session.user.id = token.id as string;
            }

            if (typeof window !== 'undefined') {
                Cookies.set("auth_token", `Bearer ${token.accessToken}`, {
                    expires: 7,
                    sameSite: "strict",
                    path: "/"
                });
            }

            return session;
        },
    },
    secret: process.env.NEXTAUTH_SECRET,
    session: {
        strategy: "jwt",
    },
    pages: {
        signIn: "/login",
    }
};

export default NextAuth(authOptions);
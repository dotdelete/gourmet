import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { authApi } from "@/lib/api/client";

export const authOptions = {
    // Configure one or more authentication providers
    jwt: {
        // The maximum age of the NextAuth.js issued JWT in seconds.
        // Defaults to `session.maxAge`.
        maxAge: 60 * 60 * 24 * 30,
        async encode({ token }) {
            return JSON.stringify(token);
        },
        async decode({ token }) {
            return JSON.parse(token);
        },
    },
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                username: { label: "Username", type: "text", placeholder: "jsmith" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials, req) { // Include the req parameter
                const token = await authApi.login({ username: credentials.username, password: credentials.password }).then(res => res.token);
                // If no error and we have user data, return it
                if (token) {
                    return authApi.getMe();
                }
                // Return null if user data could not be retrieved
                return null;
            }
        })
    ],
    pages: {
        signIn: '/login',
    },
}

export default NextAuth(authOptions);
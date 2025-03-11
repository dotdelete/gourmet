import NextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { authApi } from "@/lib/api/client";
import { JWT } from "next-auth/jwt";

export const authOptions: AuthOptions = {
    jwt: {
        maxAge: 60 * 60 * 24 * 30,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        async encode({ secret, token }) {
            if (!token) return "";
            return JSON.stringify(token);
        },
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        async decode({ secret, token }) {
            if (!token) return null;
            return JSON.parse(token as string) as JWT;
        },
    },
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                username: { label: "Username", type: "text", placeholder: "jsmith" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.username || !credentials?.password) {
                    return null;
                }

                const token = await authApi.login({
                    username: credentials.username,
                    password: credentials.password
                }).then(res => res.token);

                if (token) {
                    return authApi.getMe();
                }
                return null;
            }
        })
    ],
    pages: {
        signIn: '/login',
    },
};

export default NextAuth(authOptions);
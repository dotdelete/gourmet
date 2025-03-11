import "next-auth";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
    interface Session {
        accessToken?: string;
        user: {
            id: string;
            name?: string | null;
            email?: string | null;
        };
    }

    interface User {
        id: string;
        name?: string | null;
        email?: string | null;
        token?: string;
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        accessToken?: string;
        id?: string;
    }
}
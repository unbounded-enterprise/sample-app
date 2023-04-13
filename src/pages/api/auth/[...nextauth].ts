import { NextApiRequest, NextApiResponse } from "next/types";
import NextAuth, { RequestInternal } from "next-auth";
import { unstable_getServerSession } from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import jwt from 'jsonwebtoken';
import User from "src/types/user";
import { rk } from "src/utils/random-key";
import { getUserFromHandcash } from "../handcash/getToken";
import { JWT } from "next-auth/jwt/types";
import { omit } from "lodash";
import { BasicError } from "src/types/error";

const authSecret = process.env.NEXTAUTH_SECRET;

export async function getSession(req:NextApiRequest, res:NextApiResponse) {
    const session = await unstable_getServerSession(req, res, authOptions);

    return session;
}

export async function getSessionUser(req:NextApiRequest, res:NextApiResponse) {
    const session = await unstable_getServerSession(req, res, authOptions);

    if (!(session?.user)) throw new BasicError('Unable to retrieve session', 409);

    return session.user;
}

export const HandcashProvider = CredentialsProvider({
    // The name to display on the sign in form (e.g. 'Sign in with...')
    name: 'Handcash',
    // The credentials is used to generate a suitable form on the sign in page.
    // You can specify whatever fields you are expecting to be submitted.
    // e.g. domain, username, password, 2FA token, etc.
    // You can pass any HTML attribute to the <input> tag through the object.
    credentials: {
        handcashtoken: { label: "HandcashToken", type: "text", placeholder: "" },
        // username: { label: "Username", type: "text", placeholder: "jsmith" },
        // password: {  label: "Password", type: "password" }
    },
    async authorize(credentials, req) {
        // destructure handcashtoken from credentials, assume it exists for now
        const { handcashtoken } = credentials!;
        
        // if no handcashtoken, return null
        if (!handcashtoken) return null;

        // get user from handcash
        const user:User = await getUserFromHandcash(handcashtoken);

        // if we have user data, return it
        if (user?.handle) return user;

        // otherwise return null
        return null;
    }
});

export const authOptions = {  
    // Configure one or more authentication providers  
    providers: [    
        HandcashProvider,
        // ...add more providers here  
    ],
    session: {
        // Choose how you want to save the user session.
        // The default is `"jwt"`, an encrypted JWT (JWE) stored in the session cookie.
        // If you use an `adapter` however, we default it to `"database"` instead.
        // You can still force a JWT session by explicitly defining `"jwt"`.
        // When using `"database"`, the session cookie will only contain a `sessionToken` value,
        // which is used to look up the session in the database.
        // strategy: "database",
      
        // Seconds - How long until an idle session expires and is no longer valid.
        maxAge: (3 * 60 * 60), // 3 hours
      
        // Seconds - Throttle how frequently to write to database to extend a session.
        // Use it to limit write operations. Set to 0 to always update the database.
        // Note: This option is ignored if using JSON Web Tokens
        // updateAge: 24 * 60 * 60, // 24 hours
        
        // The session token is usually either a random UUID or string, however if you
        // need a more customized session token string, you can define your own generate function.
        generateSessionToken: () => {
            return rk();
        },
    },
    callbacks: {
        async jwt({ token, user }:any) {
            if (user) return { ...token, ...user };

            return token;
        },
        async session({ session, token }:any) {
            if (token) session.user = omit(token, 'sub');
            return session;
        }
    },
    jwt: {
        async encode({ token }:any) {
            return jwt.sign(token, authSecret!);
        },
        async decode({ token }:any) {
            return jwt.verify(token!, authSecret!) as JWT;
        },
    },
}

export default NextAuth(authOptions);
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { type GetServerSidePropsContext } from "next";
import {
  getServerSession,
  type DefaultSession,
  type NextAuthOptions,
} from "next-auth";
import DiscordProvider from "next-auth/providers/discord";

import { env } from "~/env";
import { db } from "~/server/db";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from 'bcrypt';
import { ToyBrick } from "lucide-react";
// import { tokenOnWeek } from "~/utils/jwtHelper";
// import { tokenOneDay } from "~/utils/jwtHelper";
// import { AuthUser, jwtHelper } from "~/utils/jwtHelper";


/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.name = user.name
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id,
          session.user.name = token.name
      }
      return session
    }
  },
  adapter: PrismaAdapter(db),
  session: {
    strategy: "jwt",
    // maxAge: 60 * 60
  },
  pages: {
    signIn: '/signin',
  },
  providers: [
    // DiscordProvider({
    //   clientId: env.DISCORD_CLIENT_ID,
    //   clientSecret: env.DISCORD_CLIENT_SECRET,
    // }),
    /**
     * ...add more providers here.
     *
     * Most other providers require a bit more work than the Discord provider. For example, the
     * GitHub provider requires you to add the `refresh_token_expires_in` field to the Account
     * model. Refer to the NextAuth.js docs for the provider you want to use. Example:
     *
     * @see https://next-auth.js.org/providers/github
     */
    CredentialsProvider({
      credentials: {
        username: {
          label: "Username",
          type: "text",
          placeholder: "jsmith",
        },
        password: {
          label: "Password",
          type: "password",
        },
      },
      async authorize(credentials, req) {

        try {
          const user = await db.user.findFirst({
            where: {
              name: credentials?.username
            }
          });

          if (user && credentials) {
            const validPassword = await bcrypt.compare(credentials?.password, user.password);
            if (!validPassword) {
              throw new Error('Invalid Password')
            }

            return {
              id: user.id,
              name: user.name,
            }
          }
          //  else if (!user && credentials) {
          //   const isUser = await db.user.findFirst({
          //     where: {
          //       name: credentials.username
          //     }
          //   });

          //   if (!isUser) {
          //     const hashPassword = await bcrypt.hash(credentials.password, 10);
          //     const newUser = await db.user.create({
          //       data: {
          //         name: credentials.username,
          //         password: hashPassword
          //       }
          //     })

          //     return {
          //       id: newUser.id,
          //       name: newUser.name
          //     }
          //   }
          // }
        } catch (error) {
          console.log(error)
        }
        return null;

      },
    })
  ],
};

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = (ctx: {
  req: GetServerSidePropsContext["req"];
  res: GetServerSidePropsContext["res"];
}) => {
  return getServerSession(ctx.req, ctx.res, authOptions);
};

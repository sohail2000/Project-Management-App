import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { type GetServerSidePropsContext } from "next";
import {
  getServerSession,
  type NextAuthOptions,
} from "next-auth";
import { db } from "~/server/db";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from 'bcryptjs';

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
  },
  pages: {
    signIn: '/signin',
  },
  providers: [
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
      async authorize(credentials) {
        try {
          const user = await db.user.findFirst({
            where: {
              name: credentials?.username
            }
          });

          if (user && credentials) {
            const validPassword = await bcrypt.compare(credentials?.password, user.password);
            if (!validPassword) {
              return null;
            }

            return {
              id: user.id,
              name: user.name,
            }
          }
          else if (!user && credentials) {
            const isUser = await db.user.findFirst({
              where: {
                name: credentials.username
              }
            });

            if (!isUser) {
              const hashPassword = await bcrypt.hash(credentials.password, 10);
              const newUser = await db.user.create({
                data: {
                  name: credentials.username,
                  password: hashPassword
                }
              })

              return {
                id: newUser.id,
                name: newUser.name
              }
            }
          }
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

import NextAuth from "next-auth/next";
import { JWT } from "next-auth/jwt"
import { AuthUser } from "@/utils/jwtHelper";
import { type DefaultSession } from 'next-auth'

declare module "next-auth" {
  interface User {
    id?: string,
    name?: string
  }

  interface Session {
    user: {
      id?: string,
      name?: string
    } & DefaultSession['user'],
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string,
    name?: string
  }
}
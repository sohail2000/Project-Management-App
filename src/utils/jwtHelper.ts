// import { encode, decode, JWT } from "next-auth/jwt";
// import { env } from "~/env.js";
// import { User } from "@prisma/client";

// export interface AuthUser extends Omit<User, "Password">{}

// export const tokenOneDay = 24 * 60 * 60;
// export const tokenOnWeek = tokenOneDay * 7 

// const craeteJWT = (token:JWT, duration: number) => encode({token, secret: env.JWT_SECRET, maxAge: duration})

// export const jwtHelper = {
//   createAcessToken: (token:JWT) => craeteJWT(token, tokenOneDay),
//   createRefreshToken: (token:JWT) => craeteJWT(token, tokenOnWeek),
//   verifyToken: (token:string) => decode({token, secret: env.JWT_SECRET})
// }
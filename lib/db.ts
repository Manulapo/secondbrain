import postgres from "@prisma/orm-postgres/runtime";
import type { Contract } from "../prisma/schema";
import contractJson from "../prisma/schema.json" with { type: "json" };

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not defined");
}

export const db = postgres<Contract>({
  contractJson, //this is made for typescript to know the type of the contract
  url: process.env.DATABASE_URL,
});

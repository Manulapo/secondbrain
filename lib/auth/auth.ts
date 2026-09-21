import { betterAuth } from "better-auth";
import { Pool } from "pg";

export const auth = betterAuth({
  database: new Pool({
    connectionString: process.env.DATABASE_URL,
  }),

  emailAndPassword: {
    enabled: true,
  },

  user: {
    fields: {
      name: "username",
    },

    additionalFields: {
      role: {
        type: ["USER", "ADMIN"],
        defaultValue: "USER",
        input: false, // it doesnt display it
      },
    },
  },

  advanced: {
    database: {
      generateId: "serial",
    },
  },
});

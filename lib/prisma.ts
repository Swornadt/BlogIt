import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient();

//creating this prisma client to interact with our models and db.
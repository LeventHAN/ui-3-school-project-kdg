import { PrismaClient } from "@prisma/client";
import { Router } from "express";

export const tags = Router();
const prisma = new PrismaClient();

tags.get("/tags", async (req, res) => {
  const tags = await prisma.pointOfInterest.findMany({
    select: {
      tags: true,
    },
  });

  const mappedToOneSet = [...new Set(tags.map((tag) => tag.tags).flat(1))];

  res.json(mappedToOneSet);
});

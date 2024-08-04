import { PrismaClient, PointOfInterest } from "@prisma/client";

const prisma = new PrismaClient();

async function getPointOfInterestById(
  id: string
): Promise<PointOfInterest | null> {
  const pointOfInterest = await prisma.pointOfInterest.findUnique({
    where: { id },
  });
  return pointOfInterest;
}

async function getAllPointsOfInterest(): Promise<PointOfInterest[]> {
  const pointsOfInterest = await prisma.pointOfInterest.findMany();
  return pointsOfInterest;
}

async function savePointOfInterest(
  data: Omit<PointOfInterest, "id">
): Promise<PointOfInterest> {
  const pointOfInterest = await prisma.pointOfInterest.create({
    data,
  });
  return pointOfInterest;
}

async function editPointOfInterest(
  id: string,
  data: Partial<PointOfInterest>
): Promise<PointOfInterest | null> {
  const pointOfInterest = await prisma.pointOfInterest.update({
    where: { id },
    data,
  });
  return pointOfInterest;
}

async function deletePointOfInterest(
  id: string
): Promise<PointOfInterest | null> {
  const pointOfInterest = await prisma.pointOfInterest.delete({
    where: { id },
  });
  return pointOfInterest;
}

export {
  getPointOfInterestById,
  getAllPointsOfInterest,
  savePointOfInterest,
  editPointOfInterest,
  deletePointOfInterest,
};

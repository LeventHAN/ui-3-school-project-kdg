import { Response, Request, Router } from "express";
import {
  Category,
  Coordinates,
  PointOfInterest,
  Prisma,
  PrismaClient,
  TargetGroup,
} from "@prisma/client";
import {
  createPointOfInterestSchema,
  editPointOfInterestSchema,
} from "../validators/validatePointOfInterest";

const prisma = new PrismaClient();

export const pointOfInterest = Router();

function getCurrentTimeHHMM() {
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const formattedHours = hours < 10 ? `0${hours}` : hours.toString();
  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes.toString();
  return `${formattedHours}:${formattedMinutes}`;
}

pointOfInterest.post(
  "/pointOfInterest",
  createPointOfInterestSchema,
  async (req: Request, res: Response) => {
    try {
      const {
        name,
        category,
        image,
        description,
        tags,
        targetGroup,
        requiredMinLength,
        poiOpensDoorsAt,
        poiClosesDoorsAt,
        coordinates,
        relatedToAttractionIds,
      } = req.body as Omit<PointOfInterest, "id"> & {
        tags: string;
        targetGroup: number;
        category: number;
        relatedToAttractionIds: string[];
      };
      const tagsArray = (tags as string).split(",").map((tag) => tag.trim());

      const data = {
        name,
        category: category,
        image,
        description,
        tags: tagsArray,
        targetGroup: targetGroup,
        requiredMinLength: parseInt(requiredMinLength),
        poiOpensDoorsAt,
        poiClosesDoorsAt,
        currentQueueLength: 0,
        relatedPoi: relatedToAttractionIds ? relatedToAttractionIds : [],
      };

      const pointOfInterest = await prisma.pointOfInterest.create({
        data: {
          ...data,
          relatedPoi: {
            connect: data.relatedPoi.map((id: string) => ({ id })),
          },
          coordinates: {
            createMany: {
              data: (coordinates[0] as Coordinates[]).map(
                (coordinate: Coordinates) => ({
                  poiXCoordinate: String(coordinate.poiXCoordinate),
                  poiYCoordinate: String(coordinate.poiYCoordinate),
                })
              ),
            },
          },
        },
      });

      res.json({
        message: "Point of Interest created successfully",
        pointOfInterest,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

interface PointOfInterestQueryParams {
  name?: string;
  typeCategory?: Category;
  targetGroup?: TargetGroup;
  minLength?: string;
  maxCurrentQueueLength?: string;
  isOpen?: "0" | "1";
  tags?: string[];
}

pointOfInterest.get("/pointOfInterest", async (req: Request, res: Response) => {
  try {
    // Extract query parameters for filtering
    const {
      name,
      typeCategory,
      targetGroup,
      minLength,
      maxCurrentQueueLength,
      isOpen,
      tags,
    } = req.query as PointOfInterestQueryParams;

    // Define a filter object based on query parameters
    const filters: Prisma.PointOfInterestWhereInput = {};

    if (name) {
      filters.name = {
        contains: name as string,
        mode: "insensitive",
      };
    }
    if (typeCategory && typeCategory !== ("ALL" as Category)) {
      filters.category = {
        equals: typeCategory,
      };
    }
    if (targetGroup && targetGroup !== ("NO_FILTER" as TargetGroup)) {
      filters.targetGroup = {
        equals: targetGroup as TargetGroup,
      };
    }
    if (minLength) {
      filters.requiredMinLength = {
        gte: parseInt(minLength as string),
      };
    }

    if (isOpen === "1") {
      filters.poiOpensDoorsAt = {
        lte: getCurrentTimeHHMM(),
      };
      filters.poiClosesDoorsAt = {
        gte: getCurrentTimeHHMM(),
      };
    } else if (isOpen === "0") {
      filters.poiOpensDoorsAt = {
        gt: getCurrentTimeHHMM(),
      };
      filters.poiClosesDoorsAt = {
        lt: getCurrentTimeHHMM(),
      };
    }

    if (maxCurrentQueueLength) {
      filters.currentQueueLength = {
        lte: parseInt(maxCurrentQueueLength as string),
      };
    }

    if (tags) {
      filters.tags = {
        hasSome: tags as string[],
      };
    }

    // Fetch points of interest with applied filters
    const pointsOfInterest = await prisma.pointOfInterest.findMany({
      where: filters,
      include: {
        coordinates: true,
      },
    });

    res.json(pointsOfInterest);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

pointOfInterest.get(
  "/pointOfInterest/:id",
  async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const pointOfInterest = await prisma.pointOfInterest.findUnique({
        where: { id },
        include: {
          relatedPoi: {
            include: {
              coordinates: true,
            },
          },
          relatingToPoi: {
            include: {
              coordinates: true,
            },
          },
          coordinates: true,
        },
      });

      if (!pointOfInterest) {
        res.status(404).json({ message: "Point of Interest not found" });
      } else {
        res.json(pointOfInterest);
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

pointOfInterest.put(
  "/pointOfInterest/:id", // Update the endpoint URL to include the point of interest ID
  editPointOfInterestSchema, // Define an edit schema if necessary
  async (req: Request, res: Response) => {
    try {
      const {
        name,
        category,
        image,
        description,
        tags,
        targetGroup,
        requiredMinLength,
        poiOpensDoorsAt,
        poiClosesDoorsAt,
        coordinates,
        relatedToAttractionIds,
      } = req.body as Omit<PointOfInterest, "id"> & {
        tags: string;
        targetGroup: number;
        category: number;
        relatedToAttractionIds: string[];
      };

      const tagsArray = (tags as string).split(",").map((tag) => tag.trim());

      const data = {
        name,
        category: category,
        image,
        description,
        tags: tagsArray,
        targetGroup: targetGroup,
        requiredMinLength: parseInt(requiredMinLength),
        poiOpensDoorsAt,
        poiClosesDoorsAt,
        relatedPoi: relatedToAttractionIds ? relatedToAttractionIds : [],
      };

      await prisma.coordinates.deleteMany({
        where: {
          pointOfInterestId: req.params.id, // Replace 'id' with the actual point of interest ID
        },
      });

      // get current relatedPoi of this point of interest and put the ids in an array
      // so we can disconnect those when adding below
      const currentRelatedPoi = await prisma.pointOfInterest.findUnique({
        where: { id: req.params.id },
        select: { relatedPoi: { select: { id: true } } },
      });

      if (currentRelatedPoi) {
        const currentRelatedPoiIds = currentRelatedPoi.relatedPoi.map(
          (poi) => poi.id
        );

        const newRelatedPoiIds = data.relatedPoi as string[];

        const idsToDisconnect = currentRelatedPoiIds.filter(
          (id) => !newRelatedPoiIds.includes(id)
        );

        const idsToConnect = newRelatedPoiIds.filter(
          (id) => !currentRelatedPoiIds.includes(id) && id !== req.params.id
        );

        const updatedPointOfInterest = await prisma.pointOfInterest.update({
          where: { id: req.params.id },
          data: {
            ...data,
            relatedPoi: {
              disconnect: idsToDisconnect.map((id) => ({ id })),
              connect: idsToConnect.map((id) => ({ id })),
            },
            relatingToPoi: {
              disconnect: idsToDisconnect.map((id) => ({ id })),
            },
            coordinates: {
              deleteMany: {},
              createMany: {
                data: (coordinates[0] as Coordinates[]).map(
                  (coordinate: Coordinates) => ({
                    poiXCoordinate: String(coordinate.poiXCoordinate),
                    poiYCoordinate: String(coordinate.poiYCoordinate),
                  })
                ),
              },
            },
          },
        });
        return res.json({
          message: "Point of Interest updated successfully",
          pointOfInterest: updatedPointOfInterest,
        });
      }
      return res.status(404).json({ message: "Point of Interest not found" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

// single delete
pointOfInterest.delete(
  "/pointOfInterest/:id",
  async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      await prisma.pointOfInterest.delete({ where: { id } });
      res.json({ message: "Point of Interest deleted successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

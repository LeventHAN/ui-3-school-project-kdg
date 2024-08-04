export enum TargetGroup {
  NO_FILTER = "NO_FILTER",
  PRESCHOOLERS = "PRESCHOOLERS",
  TEENS = "TEENS",
  ADULTS = "ADULTS",
  ALL = "ALL",
}

export enum Category {
  ALL = "ALL",
  ATTRACTION = "ATTRACTION",
  TOILET = "TOILET",
  RESTAURANT = "RESTAURANT",
  FOODTRUCK = "FOODTRUCK",
  LOCKER = "LOCKER",
  SHOP = "SHOP",
  OTHER = "OTHER",
}

export interface Coordinate {
  poiXCoordinate: number;
  poiYCoordinate: number;
}

export interface MarkerData {
  id: string;
  name: string;
  category: Category;
  image: string;
  description: string;
  tags: string[] | string;
  targetGroup: TargetGroup;
  requiredMinLength: number;
  poiOpensDoorsAt: string;
  poiClosesDoorsAt: string;
  currentQueueLength: number;
  coordinates: Coordinate[][];
  relatedPoi: MarkerData[];
  relatingToPoi: MarkerData[];
}

export type CreateMarkerDataInput = Omit<
  MarkerData,
  | "id"
  | "currentQueueLength"
  | "coordinates"
  | "relatedPoi"
  | "relatingToPoi"
  | "requiredMinLength"
> & { relatedToAttractionIds: string[]; requiredMinLength: string };

export type CreateMarkerReqBody = Omit<
  MarkerData,
  "id" | "relatedPoi" | "relatingToPoi"
> & { requiredMinLength: string };

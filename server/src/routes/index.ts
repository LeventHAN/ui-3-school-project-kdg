import express from "express";
import { tags } from "./tags";
import { pointOfInterest } from "./pointOfInterest";

export const routes = express.Router();

routes.use(tags);
routes.use(pointOfInterest);

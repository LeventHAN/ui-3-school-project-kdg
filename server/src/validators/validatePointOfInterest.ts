import { checkSchema } from "express-validator";

const createPointOfInterestSchema = checkSchema({
  name: {
    in: "body",
    notEmpty: true,
    errorMessage: "Name is required",
  },
  description: {
    in: "body",
    notEmpty: true,
    errorMessage: "Description is required",
  },
  image: {
    in: "body",
    notEmpty: true,
    errorMessage: "Image is required",
  },
  category: {
    in: "body",
    notEmpty: true,
    errorMessage: "Category is required",
  },
  tags: {
    in: "body",
    notEmpty: true,
    errorMessage: "Tags is required",
  },
  targetGroup: {
    in: "body",
    notEmpty: true,
    errorMessage: "Target Group is required",
  },
  requiredMinLength: {
    in: "body",
    notEmpty: true,
    errorMessage: "Required Min Length is required",
  },
  poiOpensDoorsAt: {
    in: "body",
    notEmpty: true,
    errorMessage: "POI Opens Doors At is required",
  },
  poiClosesDoorsAt: {
    in: "body",
    notEmpty: true,
    errorMessage: "POI Closes Doors At is required",
  },
  poiXCoordinate: {
    in: "body",
    notEmpty: true,
    errorMessage: "POI X Coordinate is required",
  },
  poiYCoordinate: {
    in: "body",
    notEmpty: true,
    errorMessage: "POI Y Coordinate is required",
  },
});

const editPointOfInterestSchema = checkSchema({
  name: {
    in: "body",
    optional: true,
    notEmpty: true,
    errorMessage: "Name is required",
  },
  description: {
    in: "body",
    optional: true,
    notEmpty: true,
    errorMessage: "Description is required",
  },
  image: {
    in: "body",
    optional: true,
    notEmpty: true,
    errorMessage: "Image is required",
  },
  category: {
    in: "body",
    optional: true,
    notEmpty: true,
    errorMessage: "Category is required",
  },
  tags: {
    in: "body",
    optional: true,
    notEmpty: true,
    errorMessage: "Tags is required",
  },
  targetGroup: {
    in: "body",
    optional: true,
    notEmpty: true,
    errorMessage: "Target Group is required",
  },
  requiredMinLength: {
    in: "body",
    optional: true,
    notEmpty: true,
    errorMessage: "Required Min Length is required",
  },
  poiOpensDoorsAt: {
    in: "body",
    optional: true,
    notEmpty: true,
    errorMessage: "POI Opens Doors At is required",
  },
  poiClosesDoorsAt: {
    in: "body",
    optional: true,
    notEmpty: true,
    errorMessage: "POI Closes Doors At is required",
  },
  poiXCoordinate: {
    in: "body",
    optional: true,
    notEmpty: true,
    errorMessage: "POI X Coordinate is required",
  },
  poiYCoordinate: {
    in: "body",
    optional: true,
    notEmpty: true,
    errorMessage: "POI Y Coordinate is required",
  },
});

export { createPointOfInterestSchema, editPointOfInterestSchema };

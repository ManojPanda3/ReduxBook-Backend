import Tags from "../models/tag.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

export const createTag = asyncHandler(async (req, res) => {
  const { name } = req.body;
  if (!name?.trim().toLowerCase()) throw new ApiError(400, "tag name is required");

  const tag = await Tags.create({
    name: name.trim().toLowerCase()
  });

  if (!tag) throw new ApiError(500, "Unable to create tag");

  return res.status(200).json(
    new ApiResponse(200, tag, "Successfully tags created")
  )
});

export const getTag = asyncHandler(async (req, res) => {
  const { name } = req.body;
  if (!name?.trim().toLowerCase()) throw new ApiError(400, "tag name is required");

  const tag = await Tags.findOne(name);
  if (!tag) throw new ApiError(404, "tag not found");

  return res.status(200).json(
    new ApiResponse(200, tag, "Successfully tags created")
  )
}); 

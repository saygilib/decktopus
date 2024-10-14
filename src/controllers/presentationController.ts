import { Request, Response } from "express";
import Presentations from "../models/presentations";
import fs from "fs";
import path from "path";

export const getAllPresentations = async (req: Request, res: Response) => {
  try {
    const allPresentations = await Presentations.findAll({
      include: ["user"],
    });
    if (allPresentations)
      res
        .status(200)
        .send({ presentations: allPresentations, isSuccess: true });
    else
      return res
        .status(400)
        .json({
          message: "Failed to retrieve presentations.",
          isSuccess: false,
        });
  } catch (error) {
    res.status(500).send({
      message: "Error retrieving presentations",
      error,
      isSuccess: false,
    });
  }
};

export const createNewPresentation = async (req: Request, res: Response) => {
  try {
    const { presentationName, createdBy } = req.body;

    if (!presentationName || !createdBy) {
      return res
        .status(400)
        .json({ message: "Missing information!", isSuccess: false });
    }

    if (!req.file) {
      return res
        .status(400)
        .json({ message: "Thumbnail image is required.", isSuccess: false });
    }

    const newPresentation = await Presentations.create({
      presentationName,
      createdBy: createdBy,
      thumbnail: `/uploads/${req.file.filename}`,
    });

    return res.status(201).json({
      message: "Presentation created successfully!",
      presentation: newPresentation,
      isSuccess: true,
    });
  } catch (error) {
    if (error)
      res.status(500).json({
        message: "Error creating presentation.",
        error,
        isSuccess: false,
      });
  }
};

export const deletePresentation = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const presentation = await Presentations.findByPk(id);
    if (!presentation) {
      return res
        .status(404)
        .json({ message: "Presentation not found", isSuccess: false });
    }

    const filePath = path.join(__dirname, "..", "..", presentation.thumbnail);
    console.log("Deleting file from path:", filePath);
    fs.unlink(filePath, async (err) => {
      if (err) {
        console.log("ERROR:", err);

        return res
          .status(500)
          .json({
            message: "Error deleting file",
            error: err,
            isSuccess: false,
          });
      }

      await presentation.destroy();

      return res
        .status(200)
        .json({
          message: "Presentation and file deleted successfully.",
          isSuccess: true,
        });
    });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting presentation",
      error,
      isSuccess: false,
    });
  }
};

export const updatePresentationName = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { newName, createdBy } = req.body;

    const presentation = await Presentations.findByPk(id);
    if (!presentation) {
      return res
        .status(404)
        .json({ message: "Presentation not found", isSuccess: false });
    }
    if (presentation.createdBy === createdBy) {
      presentation.presentationName = newName;
      await presentation.save();

      res.status(200).json({
        message: "Presentation name updated successfully.",
        presentation,
        isSuccess: true,
      });
    } else
      res.status(200).json({
        message: "You can't alter another user's presentation.",
        isSuccess: false,
      });
  } catch (error) {
    res.status(500).json({
      message: "Error updating presentation.",
      error,
      isSuccess: false,
    });
  }
};

import { Request, Response } from "express";
import Presentations from "../models/presentations";
import fs from "fs";
import path from "path";

// this function returns all presentations for dashboard page
export const getAllPresentations = async (req: Request, res: Response) => {
  try {
    // in here i include user to search because i need username info for displaying createdBy section in dashboard
    const allPresentations = await Presentations.findAll({
      include: ["user"],
    });
    
    //null check
    if (allPresentations )
      return res
        .status(200)
        .send({ presentations: allPresentations, isSuccess: true });
  
    else
      return res.status(400).json({
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
  // for creating a new presentation user needs to provide presentation name , created by (username) and thumbnail image (file)
  try {
    const { presentationName, createdBy } = req.body;
    // if any info is missing return error
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
    // i stored the thumbnail in a folder called uploads , however in larger projects this shouldn't be done.
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

// presentation delete function
export const deletePresentation = async (req: Request, res: Response) => {
  try {
    const { id } = req.params; // presentation id for searching in db

    const presentation = await Presentations.findByPk(id);
    if (!presentation) {
      return res
        .status(404)
        .json({ message: "Presentation not found", isSuccess: false });
    }
    // if user removes a presentations i also delete it from the uploads folder
    const filePath = path.join(__dirname, "..", "..", presentation.thumbnail); // this is the path for uploads folder , /uploads/image
    console.log("Deleting file from path:", filePath); // log for filepath , checking if i got the correct path
    fs.unlink(filePath, async (err) => {
      if (err) {
        console.log("ERROR:", err); // in case of any error , error log

        return res.status(500).json({
          message: "Error deleting file",
          error: err,
          isSuccess: false,
        });
      }

      await presentation.destroy(); // deleting presentation from db

      return res.status(200).json({
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

// function for editing presentation name
export const updatePresentationName = async (req: Request, res: Response) => {
  // a user can only edit their own presentations. if they try to alter another users presentation it throws an error
  try {
    //necessarry parameters and body
    const { id } = req.params;
    const { newName, createdBy } = req.body;
    //find presentation by id
    const presentation = await Presentations.findByPk(id);
    if (!presentation) {
      // null check
      return res
        .status(404)
        .json({ message: "Presentation not found", isSuccess: false });
    }
    // check if user is the one who created the presentation
    if (presentation.createdBy === createdBy) {
      presentation.presentationName = newName; // save new name
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

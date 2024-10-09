import { Request, Response } from "express";
import Presentations from "../models/presentations";

export const getAllPresentations = async (req: Request, res: Response) => {
  try {
    const allPresentations = await Presentations.findAll({
      include: ["user"],
    });

    res.status(200).send(allPresentations);
  } catch (error) {
    res.status(500).send({ message: "Error retrieving presentations", error });
  }
};

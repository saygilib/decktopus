import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import Users from "../models/users";


// this is authentication middleware for protecting my routes.
//only signup and login routes are not protected
//when a request comes to any other route , this function checks the token provided from front-end
export const authenticateToken = async (
  req: Request | any,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader 
    const payload = await jwt.verify(token, process.env.JWT_SECRET as string);
    const { id } = payload as any;
    if (!id) return res.send("invalid token");
    const user = Users.findByPk(id);
    if (!user) return res.send("no user found");
    req.user = user;
    next();
  } catch (error) {
    if (error) res.status(500).send("error occured");
  }
};

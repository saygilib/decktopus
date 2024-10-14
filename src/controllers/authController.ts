import { Request, Response } from "express";
import Users from "../models/users";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const signup = async (req: Request, res: Response) => {
  const { username, password, email } = req.body;

  if (!username || !password || !email) {
    return res.status(400).json({ message: "missing information" });
  }

  await Users.findOne({
    where: {
      email: email,
    },
  })
    .then((user) => {
      if (!user) {
        Users.create({
          username: username,
          password: bcrypt.hashSync(password, 8),

          email: email,
        })
          .then((data) => {
            res.status(200).send(data);
          })
          .catch((err) => {
            res.status(500).send({
              message: err.message || "error ocurred while creating the user",
            });
          });
      } else {
        res.json({
          error: "user already exists",
        });
      }
    })
    .catch((err) => {
      res.send("error" + err);
    });
};

export const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username and password are required" });
  }

 
  const user = await Users.findOne({ where: { username } });
  if (!user) {
    return res.status(401).json({ message: "Invalid username or password" });
  }

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    return res.status(401).json({ message: "Invalid username or password" });
  }

  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET as string, {
    expiresIn: "1h",
  });
  res.status(200).json({ message: "Login successful", token , user});
};

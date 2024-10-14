import { Request, Response } from "express";
import Users from "../models/users";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

//function for signing up
export const signup = async (req: Request, res: Response) => {
  const { username, password, email } = req.body; // getting user information from the body

  // if any info is missing return error
  if (!username || !password || !email) {
    return res
      .status(400)
      .json({ message: "missing information", isSucces: false });
  }
  //checking if user already exists , if not create. 
  // i checked by email but username could be used here.
  await Users.findOne({
    where: {
      email: email,
    },
  })
    .then((user) => {
      if (!user) {
        //user creation here
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
              isSucces: false,
            });
          });
      } else {
        res.status(500).json({
          error: "user already exists",
          isSucces: false,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "error ocurred while creating the user",
        isSucces: false,
      });
    });
};

//function for login
export const login = async (req: Request, res: Response) => {
  // i designed login with username and password so we dont need email here 
  const { username, password } = req.body;  
 // if any info is missing return error
  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username and password are required"  ,isSucces: false});
  }
  //if any info is wrong return error
  const user = await Users.findOne({ where: { username } });
  if (!user) {
    return res.status(401).json({ message: "Invalid username or password" ,isSucces: false });
  } 
  //check if password matches the encrypted password
  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    return res.status(401).json({ message: "Invalid username or password",isSucces: false });
  }
  //creating token for auth
  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET as string, {
    expiresIn: "24h",
  });
  //return user info with token
  res.status(200).json({ message: "Login successful", token, user  , isSucces: true , id:user.id});
};

import * as express from "express";
import { PrismaClient } from "@prisma/client";
import * as dotenv from "dotenv";
import * as jwt from "jsonwebtoken";
dotenv.config();

const privateKey = process.env.privateKey;
const publicKey = process.env.publicKey;
const app = express();

app.use(express.json());

type User = {
  name: string;
  password: string;
};
const prisma = new PrismaClient();

const registerUser = async (req, res) => {
  const data = req.body;
  if (!data.name || !data.password) {
    return res.status(400).send({ message: "invalid body" });
  }

  const user = await prisma.user.create({
    data: {
      name: data.name,
      password: data.password,
    },
  });
  const accessToken = signJwt(user);
return res.send({accessToken});
};
const loginUser = async (req, res) => {
  const data = req.body;
  if (!data.name || !data.password) {
    return res.status(400).send({ message: "invalid body" });
  }

  const user = await prisma.user.findFirst({ where: { name: data.name } });
  if (!user)
    return res.status(400).send({ message: "invalid name or password" });
  if (user.password != data.password)
    return res.status(400).send({ message: "invalid name or password" });

  const accessToken = signJwt(user);
  return res.send({accessToken})
};
app.post("/register", registerUser);
app.post("/login", loginUser);

const signJwt = (user: User) => {
  const accessToken = jwt.sign({ ...user }, privateKey, { expiresIn: "1y" });
  return accessToken;
};

app.listen(8000, () => {});

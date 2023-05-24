import fastify from "fastify";
import cors from "@fastify/cors";
import dotenv from "dotenv";
import jwt from "@fastify/jwt";
import { memoriesRoutes } from "./routes/memories";
import { authRoutes } from "./routes/auth";

const app = fastify();
dotenv.config();

app.register(cors, {
  origin: true, //todas url de front end pode acessa o backend
  //origin: ["endereço de desenvolv","endereço de produção"],
});
app.register(jwt, {
  secret: "spacetime",
});
app.register(memoriesRoutes);
app.register(authRoutes);

app
  .listen({
    port: 3333,
  })
  .then(() => console.log("server running on 3333"));

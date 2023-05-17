import fastify from "fastify";
import cors from "@fastify/cors";
import { memoriesRoutes } from "./routes/memories";

const app = fastify();

app.register(cors, {
  origin: true, //todas url de front end pode acessa o backend
  //origin: ["endereço de desenvolv","endereço de produção"],
});
app.register(memoriesRoutes);

app
  .listen({
    port: 3333,
  })
  .then(() => console.log("server running on 3333"));

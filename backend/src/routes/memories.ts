import { FastifyInstance } from "fastify";
import z from "zod";
import { prisma } from "../lib/prisma";

export async function memoriesRoutes(app: FastifyInstance) {
  app.get("/memories", async () => {
    const memories = await prisma.memory.findMany({
      orderBy: {
        CreatedAt: "asc", //ordenar pela mais antiga ate a mais nova
      },
    });
    return memories.map((memory) => {
      return {
        id: memory.id,
        coverUrl: memory.coverUrl,
        excerpt: memory.content.substring(0, 115).concat("..."),
      };
    });
  });

  app.get("/memories/:id", async (req) => {
    //const { id } = req.params;
    //zod valida o id se nao o ts fica puto
    const paramsSchema = z.object({
      id: z.string().uuid(),
    });
    const { id } = paramsSchema.parse(req.params);

    const memory = await prisma.user.findUniqueOrThrow({
      where: { id },
    }); /*id e o mesmo que id: id */
    return memory;
  });

  app.post("/memories/", async (req) => {
    const bodySchema = z.object({
      content: z.string(),
      coverUrl: z.string(),
      isPublic: z.coerce.boolean().default(false), //coerce torna valores comparaveis a boolean em true ou false
    });

    const { content, coverUrl, isPublic } = bodySchema.parse(req.body);

    const memory = await prisma.memory.create({
      data: {
        content,
        coverUrl,
        isPublic,
        userId: "pegar um id do studio",
      },
    });

    return memory;
  });

  app.put("/memories/:id", async (req) => {
    const paramsSchema = z.object({
      id: z.string().uuid(),
    });

    const { id } = paramsSchema.parse(req.params);

    const bodySchema = z.object({
      content: z.string(),
      coverUrl: z.string(),
      isPublic: z.coerce.boolean().default(false), //coerce torna valores comparaveis a boolean em true ou false
    });

    const { content, coverUrl, isPublic } = bodySchema.parse(req.body);

    const updatedMemory = await prisma.memory.update({
      where: {
        id,
      },
      data: {
        content,
        coverUrl,
        isPublic,
      },
    });

    return updatedMemory;
  });

  app.delete("/memories/:id", async (req) => {
    const paramsSchema = z.object({
      id: z.string().uuid(),
    });
    const { id } = paramsSchema.parse(req.params);

    await prisma.user.delete({
      where: { id },
    }); /*id e o mesmo que id: id */
  });
}

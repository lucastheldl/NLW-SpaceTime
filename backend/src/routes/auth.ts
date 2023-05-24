import { FastifyInstance } from "fastify";
import axios from "axios";
import { z } from "zod";
import process from "process";
import { prisma } from "../lib/prisma";

export async function authRoutes(app: FastifyInstance) {
  app.post("/register", async (req) => {
    const bodySchema = z.object({
      code: z.string(),
    });

    const { code } = bodySchema.parse(req.body);
    //axios vai pegar esse e vai mandar pr github pra que receba de volta o token
    const accessTokenResponse = await axios.post(
      "https://github.com/login/oauth/access_token",
      null,
      {
        params: {
          client_id: process.env.GITHUB_CLIENT_ID,
          client_secret: process.env.GITHUB_CLIENT_SECRET,
          code,
        },
        headers: {
          Accept: "application/json",
        },
      }
    );
    //pega o token da resposta do axios
    const { access_token } = accessTokenResponse.data;

    //faz uma chamada usando o token para receber os dados do usuario
    const userResponse = await axios.get("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    const userSchema = z.object({
      id: z.number(),
      login: z.string(),
      name: z.string(),
      avatar_url: z.string().url(),
    });

    //pega e valida os dados do usuario
    const userInfo = userSchema.parse(userResponse.data);

    let user = await prisma.user.findUnique({
      where: {
        githubId: userInfo.id,
      },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          githubId: userInfo.id,
          login: userInfo.login,
          name: userInfo.name,
          avatarUrl: userInfo.avatar_url,
        },
      });
    }

    const token = app.jwt.sign(
      {
        name: user.name,
        avatarUrl: user.avatarUrl,
      },
      {
        sub: user.id,
        expiresIn: "30 days",
      }
    );

    return {
      token,
    };
  });
}

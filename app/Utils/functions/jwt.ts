import jwt from "jsonwebtoken";
import Env from "@ioc:Adonis/Core/Env";

export const decodeJWT = (token: string) => {
  try {
    let payload = jwt.verify(token, Env.get("APP_KEY") || "secret");
    return payload;
  } catch (error) {
    console.error(error);
  }
};

import jwt from "jsonwebtoken";
import Env from "@ioc:Adonis/Core/Env";
import { IDataToken } from "../interfaces";

export const decodeJWT = (token: string): IDataToken => {
  try {
    return jwt.verify(token, Env.get("APP_KEY") || "secret");
  } catch (error) {
    console.error(error);
    return { id: -1, iat: -1 };
  }
};

export const getToken = (
  headers
): { token: string; headerAuthorization: string; payloadToken: IDataToken } => {
  let token: string = "";
  let headerAuthorization = headers.authorization ? headers.authorization : "";

  if (headerAuthorization !== "") {
    token = headerAuthorization.replace("Bearer ", "").trim();
  }

  const payloadToken: IDataToken = decodeJWT(token);

  return { token, headerAuthorization, payloadToken };
};

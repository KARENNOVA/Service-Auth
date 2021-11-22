import crypto from "crypto";
import bcrypt from "bcrypt";
import moment from "moment";
import Env from "@ioc:Adonis/Core/Env";

// Authentification
export const authenticationUme = async () => {
  // CADENA
  let hexdec = crypto.randomBytes(20).toString("hex").toUpperCase();
  // let lsthexdec = "10681D4015638022C919FCB3A8A996B75997C66B"

  // FECHA
  let dateNow = moment().format().trim();

  // CONTRASEÑA
  let password = Env.get("UME_PASSWORD");
  let passwordbas: string = await base64encode(password);

  // USUARIO
  let user = Env.get("UME_USER");
  let userBase64: string = await base64encode(user);

  // llave
  let key = `${hexdec}${dateNow}${passwordbas}`;
  let encryption: string = await sha256(key);
  let keybas: string = await base64encode(encryption);

  return {
    fecha: dateNow,
    usuario: userBase64,
    cadena: hexdec,
    llave: keybas,
  };
};

export const base64encode = async (string: string) => {
  let tmp: any;
  try {
    // create a buffer
    const buff = await Buffer.from(string, "utf-8");

    // decode buffer as Base64
    tmp = await buff.toString("base64");
  } catch (error) {
    console.error(error);

    tmp = Promise.reject("Error");
  }
  return tmp;
};

const sha256 = async (str: string) => {
  // secret or salt to be hashed with
  const secret = "4xc3lS0fTw4r3.*";

  // create a sha-256 hasher
  const sha256Hasher = await crypto.createHmac("sha256", secret);

  // hash the string
  // and set the output format
  let tmp = await sha256Hasher.update(str).digest("hex").toUpperCase();
  return tmp;
};

export const bcryptEncode = async (passwordNaked: string): Promise<string> => {
  const saltRounds = 10;
  try {
    const hash = await bcrypt.hash(passwordNaked, saltRounds);

    // Store hash in your password DB.
    console.log(hash);
    return hash;
  } catch (error) {
    console.log(error);

    return Promise.reject("Error hashing the password");
  }
};

export const bcryptCompare = async (password, hash) => {
  try {
    const flag = bcrypt.compare(password, hash);

    return flag;
  } catch (error) {
    console.error(error);
    return false;
  }
};

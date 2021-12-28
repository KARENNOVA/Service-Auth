import crypto from "crypto";
import bcrypt from "bcrypt";
import moment from "moment";
import Env from "@ioc:Adonis/Core/Env";
import { sha256 } from "js-sha256";

// Authentification
export const authenticationUme = async () => {
  // CADENA
  let hexdec = crypto.randomBytes(20).toString("hex").toUpperCase();
  // let lsthexdec = "10681D4015638022C919FCB3A8A996B75997C66B"

  // FECHA
  let dateNow = moment();
  let dateFormated = moment(dateNow)
    .add(moment(dateNow).utcOffset(), "m")
    .utc()
    .format();

  // CONTRASEÑA
  let password = Env.get("UME_PASSWORD");
  let passwordbas: string = await base64encode(password);

  // USUARIO
  let user = Env.get("UME_USER");
  let userBase64: string = await base64encode(user);

  // llave
  let key = `${hexdec}${dateFormated}${passwordbas}`;
  let encryption: string = await sha256(key);
  let keybas: string = await base64encode(encryption);

  return {
    fecha: dateFormated,
    usuario: userBase64,
    cadena: hexdec,
    llave: keybas,
  };
};

export async function generarAutentificacion() {
  let usuario = "USR_UABI_UME";
  // let usuario = Env.get("UME_PASSWORD");
  let bufferObj = Buffer.from(usuario, "utf8");
  let usuarioBase64 = bufferObj.toString("base64");
  // let contrasenia = Env.get("UME_USER");
  let contrasenia = "6tC8dvgfr@C";
  let bufferObj2 = Buffer.from(contrasenia, "utf8");
  let contraseniaBase64 = bufferObj2.toString("base64");
  // let contraseniaBase64 = btoa(contrasenia)
  let fechaActual = moment();
  let fechaFormateada = moment(fechaActual)
    .add(moment(fechaActual).utcOffset(), "m")
    .utc()
    .format();
  let cadena = generateRandomString().trim();

  let llave = `${cadena}${fechaFormateada}${contraseniaBase64}`;

  let llavesha256 = sha256(llave);
  let llavesha256Mayusculas = llavesha256.toUpperCase();
  let bufferObj3 = Buffer.from(llavesha256Mayusculas, "utf8");
  let llaveFinal = bufferObj3.toString("base64");
  //  let llaveFinal =  btoa(llavesha256Mayusculas)

  return {
    fecha: fechaFormateada,
    usuario: usuarioBase64,
    llave: llaveFinal,
    cadena: cadena,
  };
}

function generateRandomString() {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result1 = " ";
  const charactersLength = characters.length;
  for (let i = 0; i < 40; i++) {
    result1 += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return result1;
}

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

// const sha256 = async (str: string) => {
//   // secret or salt to be hashed with
//   const secret = "4xc3lS0fTw4r3.*";

//   // create a sha-256 hasher
//   const sha256Hasher = await crypto.createHmac("sha256", secret);

//   // hash the string
//   // and set the output format
//   let tmp = await sha256Hasher.update(str).digest("hex").toUpperCase();
//   return tmp;
// };

export const bcryptEncode = async (passwordNaked: string): Promise<string> => {
  const saltRounds = 10;
  try {
    const hash = await bcrypt.hash(passwordNaked, saltRounds);

    // Store hash in your password DB.
    return hash;
  } catch (error) {
    console.error(error);

    return Promise.reject("Error hashing the password");
  }
};

export const bcryptCompare = async (password, hash) => {
  try {
    return bcrypt.compare(password, hash);
  } catch (error) {
    console.error(error);
    return false;
  }
};

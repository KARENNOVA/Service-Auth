// UTILS
import AuditTrail from "App/Utils/classes/AuditTrail";
import { IResponseData } from "App/Utils/interfaces/index";
import { decodeJWT } from "App/Utils/functions/jwt";

// MODELS
import DetailsUser from "App/Models/DetailsUser";
import UserRole from "App/Models/UserRole";
import UserPermit from "App/Models/UserPermit";
import { Action } from "../_types";
import { IPaginationValidated } from "../interfaces/pagination";

export const changeStatus = async (
  model: any,
  id: string | number,
  action: Action,
  token: string
) => {
  try {
    const data = await model.findOrFail(id);

    const auditTrail = new AuditTrail(token, data.audit_trail);

    if (action === "inactivate") {
      if (data.status != 0) data.status = 0;
      else
        return {
          success: false,
          results: {
            name: "Already inactivate",
            message:
              "Already inactivate, please defore inactivate, activate it.",
          },
        };
    }

    if (action === "activate") data.status = 1;

    auditTrail.update({ status: data.status }, data);
    const tmpModel = await data.save();

    return { success: true, results: tmpModel };
  } catch (error) {
    console.error(`Error changing status:\n${error}`);
    return { success: false, results: error };
  }
};

export const messageError = (
  error: any = {
    name: "Desconocido",
    message: "Error desconocido.\nRevisar Terminal.",
  },
  response: any,
  initialMessage: string = "Ha ocurrido un error inesperado",
  initialStatus: number = 500
) => {
  let responseData: IResponseData = {
    message: initialMessage,
    status: initialStatus,
  };
  responseData.error = { name: error.name, message: error.message };

  // Error 23505
  if (error.routine === "_bt_check_unique")
    responseData.message = "Valor ya existente.";
  if (error.type === "user_key_duplicated") {
    responseData.message =
      'El usuario ya existe.\nSi no recuerda la contraseña ir a la sección de "¿Olvidó su Contraseña?"';
    responseData.status = 400;
  }

  if (Number(error.code) === 23505)
    responseData.message =
      "Error interno controlable. Realice la consulta hasta que le funcione. :)";

  if (responseData["status"] === 401)
    responseData["error"] = {
      name: "Unauthorized",
      message:
        "No se encuentra autorizado para obtener la información solicitada.",
    };

  if (responseData["status"] === 400)
    responseData["error"] = {
      name: "Bad Request",
      message:
        "Sintaxis inválida. El servidor no puede entender la información solicitada o no enviada.",
    };

  console.error(error);
  return response.status(responseData["status"]).json(responseData);
};

export const getDataUser = async (token: string) => {
  const { id } = decodeJWT(token);

  try {
    const detailsUser = await DetailsUser.query().where("user_id", id);

    return detailsUser[0];
  } catch (error) {
    console.error(error);
  }
};

export const deleteDuplicates = (array: any[]) => {
  let hash = {};
  return array.filter((o) => (hash[o.id] ? false : (hash[o.id] = true)));
};
// Esto funciona correctamente, ¿Cómo? Sabrá Dios y mi yo del pasado.
export const getPermitsAndRoles = async (request, response, id?) => {
  let permits: any[] = [],
    roles: any[] = [];

  let payloadToken;
  const token = request
    .headers()
    ["authorization"]?.split("Bearer")
    .pop()
    ?.trim();
  if (token) payloadToken = decodeJWT(token);

  let userId = typeof id !== "undefined" ? id : payloadToken.id;

  try {
    const userRoles = await UserRole.query()
      .from("user_roles as ur")
      .innerJoin("role_permits as rp", "ur.role_id", "rp.role_id")
      .innerJoin("permits as p", "rp.permit_id", "p.id")
      .innerJoin("roles as r", "ur.role_id", "r.id")
      .where("ur.user_id", userId);

    const userPermits = await UserPermit.query()
      .from("user_permits as up")
      .innerJoin("permits as p", "up.permit_id", "p.id")
      .where("up.user_id", userId);

    userRoles.map((userRole) => {
      roles.push({
        id: userRole["$original"]["role_id"],
        name: userRole["$extras"]["role_name"],
      });
    });

    userPermits.map((userRole) => {
      permits.push({
        id: userRole["$original"]["permit_id"],
        name: userRole["$extras"]["permit_name"],
      });
    });

    userRoles.map((userRole) => {
      permits.push({
        id: userRole["$extras"]["permit_id"],
        name: userRole["$extras"]["permit_name"],
      });
    });

    permits = deleteDuplicates(permits);
    roles = deleteDuplicates(roles);

    return { permits, roles, token };
  } catch (error) {
    console.error(error);
    response.unauthorized({
      error: "No tiene los permisos para realizar esta acción.",
    });
    return { permits: [], roles: [], token: "" };
  }
};

export const hasPermit = (permits: any[], permitToValidate: string) => {
  const permitsValidated = permits.filter(
    (permit) => permit["name"] === permitToValidate
  );

  if (permitsValidated.length === 0) return false;

  return true;
};

export const validatePagination = (
  searchKey: string,
  searchQ?: string | number,
  page?: number,
  pageSize?: number
): IPaginationValidated => {
  let tmpSearch: { key: string; value: string },
    tmpPage: number,
    tmpPageSize: number;

  if (!searchQ) tmpSearch = { key: searchKey, value: "" };
  else tmpSearch = { key: searchKey, value: String(searchQ) };

  if (tmpSearch["key"] === "name") tmpSearch["key"] = "names ->> 'firstName'";

  if (!pageSize) tmpPageSize = 10;
  else tmpPageSize = Number(pageSize);

  if (!page) tmpPage = 1;
  else tmpPage = Number(page);

  return { search: tmpSearch, page: tmpPage, pageSize: tmpPageSize };
};

export const sum = (num1: number, num2: number): number => {
  return num1 + num2;
};

export * from "./auth";
export * from "./permit";
export * from "./jwt";

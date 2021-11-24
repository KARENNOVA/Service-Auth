// UTILS
import AuditTrail from "App/Utils/classes/AuditTrail";
import { IResponseData } from "App/Utils/interfaces/index";
import { decodeJWT } from "App/Utils/functions/jwt";

// MODELS
import DetailsUser from "App/Models/DetailsUser";
import UserRole from "App/Models/UserRole";
import UserPermit from "App/Models/UserPermit";

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
  error: any,
  response: any,
  initialMessage: string = "Ha ocurrido un error inesperado"
) => {
  let errorData: IResponseData = { message: initialMessage };
  console.error(error);
  console.error(error.name);
  console.error(error.message);

  errorData.error = { name: error.name, message: error.message };

  return response.status(500).json(errorData);
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

    console.log(payloadToken);

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
    return {};
  }
};

export const validatePagination = (q?, page?, pageSize?) => {
  let tmpQ: string, tmpPage: number, tmpPageSize: number;

  if (!q) tmpQ = "";
  else tmpQ = String(q).toUpperCase().trim();

  if (!pageSize) tmpPageSize = 10;
  else tmpPageSize = Number(pageSize);

  if (!page) tmpPage = 1;
  else tmpPage = Number(page);

  return { q: tmpQ, page: tmpPage, pageSize: tmpPageSize };
};

export const sum = (num1: number, num2: number): number => {
  return num1 + num2;
};

export * from "./auth";
export * from "./permit";

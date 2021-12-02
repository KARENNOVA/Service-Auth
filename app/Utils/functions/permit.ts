import RolPermit from "App/Models/RolePermit";
import UserPermit from "App/Models/UserPermit";
import { getPermitsAndRoles, hasPermit } from ".";
import AuditTrail from "../classes/AuditTrail";
import { decodeJWT } from "./jwt";

export const assignPermits = async (
  permits: number[],
  auditTrail: AuditTrail,
  idRole?: number,
  idUser?: number
) => {
  try {
    permits.map(async (permit) => {
      let tmp: any = {
        permit_id: permit,
        status: 1,
        audit_trail: auditTrail.getAsJson(),
      };
      if (idRole) {
        tmp.rol_id = idRole;
        await RolPermit.create(tmp);
      } else {
        tmp.user_id = idUser;
        await UserPermit.create(tmp);
      }
    });
    return { success: true };
  } catch (error) {
    console.error(error);

    return { success: false };
  }
};

export const validatePermit = async (
  response,
  request,
  token: string,
  permitToValidate: string
): Promise<boolean> => {
  const { id } = decodeJWT(token);

  const { permits } = await getPermitsAndRoles(request, response, id);

  const boolHasPermit = hasPermit(permits, permitToValidate);

  return boolHasPermit;
};

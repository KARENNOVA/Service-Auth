import RolPermit from "App/Models/RolePermit";
import UserPermit from "App/Models/UserPermit";
import AuditTrail from "../classes/AuditTrail";

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

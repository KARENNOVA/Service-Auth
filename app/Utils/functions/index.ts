export * from "./auth";
import RolPermit from "App/Models/RolPermit";
import AuditTrail from "App/Utils/classes/AuditTrail";
import UserPermit from "./../../Models/UserPermit";

type Action = "inactivate" | "activate";

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

export const changeStatus = async (
  model: any,
  id: string | number,
  action: Action
) => {
  try {
    const data = await model.findOrFail(id);

    const auditTrail = new AuditTrail(undefined, data.audit_trail);

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

    auditTrail.update("Administrador", { status: data.status }, data);
    const tmpModel = await data.save();

    return { success: true, results: tmpModel };
  } catch (error) {
    console.error(`Error changing status:\n${error}`);
    return { success: false, results: error };
  }
};

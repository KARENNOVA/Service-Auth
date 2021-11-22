import AuditTrail from "App/Utils/classes/AuditTrail";
import { IResponseData } from "App/Utils/interfaces/index";

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

export * from "./auth";
export * from "./permit";

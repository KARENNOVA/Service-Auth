import Role from "App/Models/Role";

export const getRoleId = async (role: string): Promise<number> => {
  const usersRole = await Role.query().select(["id"]).where("role_name", role);

  return Number(usersRole[0]["$attributes"]["id"]);
};

import DetailsUser from "App/Models/DetailsUser";
import { IPaginationValidated } from "../interfaces/pagination";

type TModel = typeof DetailsUser;

export const paginate = async (
  model: TModel,
  pagination: IPaginationValidated,
  select: string[] = ["*"]
  //   from: string = ""
) => {
  let count: number =
    pagination["page"] * pagination["pageSize"] - pagination["pageSize"];

  return await model
    .query()
    .from("details_users as du")
    .innerJoin("status as s", "du.status", "s.id")
    .select(select)
    .where("du.status", 1)
    .orderBy("du.id", "desc")
    .limit(pagination["pageSize"])
    .offset(count);
};

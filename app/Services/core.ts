import axios from "axios";
import Env from "@ioc:Adonis/Core/Env";

const URI = Env.get("URI_SERVICE_CORE");
const VERSION = Env.get("API_CORE_VERSION");

export const getDependencies = async (id, headerAuthorization) => {
  try {
    const axiosResponse = await axios.get(`${URI}${VERSION}/dependencies`, {
      params: { id: id },
      headers: { authorization: headerAuthorization },
    });

    return axiosResponse.data.results;
  } catch (error) {
    console.error(error);
    return Promise.reject("");
  }
};

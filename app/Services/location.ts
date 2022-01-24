import axios from "axios";
import Env from "@ioc:Adonis/Core/Env";

const URI = Env.get("URI_SERVICE_LOCATION");
const VERSION = Env.get("API_LOCATION_VERSION");

export const getAddressById = async (id, headerAuthorization) => {
  try {
    const axiosResponse = await axios.get(`${URI}${VERSION}/addresses`, {
      params: { id: id },
      headers: { authorization: headerAuthorization },
    });

    return axiosResponse.data.results;
  } catch (error) {
    console.error(error);
    return Promise.reject("");
  }
};

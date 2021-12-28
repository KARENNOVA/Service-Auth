import axios from "axios";
import Env from "@ioc:Adonis/Core/Env";

const URI = Env.get("URI_SERVICE_ALC");
const VERSION = Env.get("API_ALC_VERSION");

export const registerUser = async (tmp) => {
  console.log(tmp);
  console.log(JSON.stringify(tmp));

  try {
    const axiosResponse = await axios.post(
      `${URI}${VERSION}/servicio-usuarios/auth`,
      { data: JSON.stringify(tmp) },

      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Cookie:
            "cookiesession1=678B2869RSTUVWXABCDEFGHIJKLM77E2; saplb_*=(J2EE5204120)5204150",
        },
      }
    );
    console.log(axiosResponse);

    return axiosResponse.data;
  } catch (error) {
    console.error(error);
    return Promise.reject("");
  }
};

export const logInUser = async (tmp) => {
  console.log(tmp);
  console.log(JSON.stringify(tmp));

  try {
    const axiosResponse = await axios.post(
      `${URI}${VERSION}/servicio-usuarios/auth`,
      { data: JSON.stringify(tmp) },
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Cookie:
            "cookiesession1=678B2869RSTUVWXABCDEFGHIJKLM77E2; saplb_*=(J2EE5204120)5204150",
        },
      }
    );
    console.log(axiosResponse);

    return axiosResponse.data;
  } catch (error) {
    console.error(error);
    return Promise.reject("");
  }
};

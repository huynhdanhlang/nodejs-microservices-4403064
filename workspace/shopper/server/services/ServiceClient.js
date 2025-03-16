const axios = require("axios");
const config = require("../config/index");

class ServiceClient {
  static async getService(serviceName) {
    try {
      const result = await axios.get(
        `${config.registry.url}/find/${serviceName}/${config.registry.version}`
      );

      return result.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  /**
   *
   * @param {string} serviceName
   * @param {import('axios').AxiosRequestConfig} requestOptions
   * @returns
   */
  static async callService(serviceName, requestOptions = {}) {
    const { ip, port } = await this.getService(serviceName);

    requestOptions["url"] = `http://${ip}:${port}${requestOptions["url"]}`;

    try {
      const result = await axios(requestOptions);

      return result.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}

module.exports = ServiceClient;

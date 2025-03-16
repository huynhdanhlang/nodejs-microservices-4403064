const express = require("express");

const Registry = require("../lib/Registry");
const registry = new Registry();

const router = express.Router();

/**
 *
 * @param {import("express").Request} req
 * @returns
 */
const getReqArgument = (req) => {
  const { serviceName, serviceVersion, servicePort } = req.params;

  let serviceIp = req.ip;

  if (serviceIp.includes("::1") || serviceIp.includes("::ffff:127.0.0.1")) {
    serviceIp = "127.0.0.1";
  }

  return { serviceName, serviceVersion, servicePort, serviceIp };
};

router.put(
  "/register/:serviceName/:serviceVersion/:servicePort",
  (req, res, next) => {
    const { serviceName, serviceVersion, servicePort, serviceIp } =
      getReqArgument(req);

    const key = registry.register(
      serviceName,
      serviceVersion,
      serviceIp,
      servicePort
    );

    return res.json({ result: key });
  }
);

router.delete(
  "/register/:serviceName/:serviceVersion/:servicePort",
  (req, res, next) => {
    const { serviceName, serviceVersion, servicePort, serviceIp } =
      getReqArgument(req);

    const key = registry.unregister(
      serviceName,
      serviceVersion,
      serviceIp,
      servicePort
    );

    return res.json({
      result: key
    });
  }
);

router.get("/find/:serviceName/:serviceVersion", (req, res, next) => {
  const { serviceName, serviceVersion } = getReqArgument(req);

  const service = registry.get(serviceName, serviceVersion);

  if (!service) {
    return res.status(404).json({
      error: "Service not found"
    });
  }

  return res.json(service);
});

module.exports = router;

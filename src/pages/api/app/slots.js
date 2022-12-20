const axios = require("axios");

const headers = { appsecret: String(process.env.ASSETLAYER_APP_SECRET) };

module.exports = function getSlotsHandler(req, res) {
  return new Promise((resolve, reject) => {
    const errorHandling = (e) => {
      const err = parseError(e);
      console.log(err?.message);
      return resolve(
        res.status(parseInt(err?.custom || "500")).json({ error: err?.message })
      );
    };

    try {
      const { appId, idOnly } = req.body;

      if (!appId) return resolve(res.status(409).json("missing appId"));

      getSlots(appId, idOnly)
        .then((app) => {
          resolve(res.status(200).json(app));
        })
        .catch(errorHandling);
    } catch (e) {
      errorHandling(e);
    }
  });
};

async function getSlots(appId, idOnly = false) {
  const response = await axios.get(
    "https://api.assetlayer.com/api/v1/app/slots",
    {
      data: { appId, idOnly },
      headers,
    }
  );
  const app = response.data.body.app;

  return app;
}

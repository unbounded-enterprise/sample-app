const axios = require("axios");

const headers = { appsecret: String(process.env.ASSETLAYER_APP_SECRET) };

module.exports = function getAppHandler(req, res) {
  return new Promise((resolve, reject) => {
    const errorHandling = (e) => {
      const err = parseError(e);
      console.log(err?.message);
      return resolve(
        res.status(parseInt(err?.custom || "500")).json({ error: err?.message })
      );
    };

    try {
      const { appId } = req.body;

      if (!appId) return resolve(res.status(409).json("missing appId"));

      getApp(appId)
        .then((app) => {
          resolve(res.status(200).json(app));
        })
        .catch(errorHandling);
    } catch (e) {
      errorHandling(e);
    }
  });
};

async function getApp(appId) {
  const response = await axios.get(
    "https://api.assetlayer.com/api/v1/app/info",
    {
      data: { appId },
      headers,
    }
  );
  const app = response.data.body.app;

  return app;
}

async function tryGetApp(appId) {
  try {
    if (!appId) throw new CustomError("missing appId", "409");

    const response = await axios.get(
      "https://api.assetlayer.com/api/v1/app/info",
      {
        data: { appId },
        headers,
      }
    );

    if (response.data.success) return response.data.body.app;
    else return null;
  } catch (e) {
    return null;
  }
}

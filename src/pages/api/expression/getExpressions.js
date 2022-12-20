const axios = require("axios");

const headers = { appsecret: String(process.env.ASSETLAYER_APP_SECRET) };

module.exports = function getExpressionsHandler(req, res) {
  return new Promise((resolve, reject) => {
    const errorHandling = (e) => {
      const err = parseError(e);
      console.log(err?.message);
      return resolve(
        res.status(parseInt(err?.custom || "500")).json({ error: err?.message })
      );
    };

    try {
      const { slotId } = req.body;

      if (!slotId) return resolve(res.status(409).json("missing slotId"));

      getExpressions(slotId)
        .then((expressions) => {
          resolve(res.status(200).json(expressions));
        })
        .catch(errorHandling);
    } catch (e) {
      errorHandling(e);
    }
  });
};

async function getExpressions(slotId) {
  const response = await axios.get(
    "https://api.assetlayer.com/api/v1/expression/slot",
    {
      data: { slotId },
      headers,
    }
  );
  const expressions = response.data.body.expressions;

  return expressions;
}

async function tryGetExpressions(slotId) {
  try {
    if (!slotId) throw new CustomError("missing slotId", "409");

    const response = await axios.get(
      "https://api.assetlayer.com/api/v1/expression/slot",
      {
        data: { slotId },
        headers,
      }
    );

    if (response.data.success) return response.data.body.expressions;
    else return null;
  } catch (e) {
    return null;
  }
}

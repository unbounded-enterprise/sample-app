const axios = require("axios");
const { parseError, validateToken } = require("../validate");

const headers = { appsecret: String(process.env.ASSETLAYER_APP_SECRET) };

module.exports = function getSlotHandler(req, res) {
  return new Promise((resolve, reject) => {
    const errorHandling = (e) => {
      const err = parseError(e);
      console.log(err?.message);
      return resolve(
        res
          .status(parseInt(err?.custom || "500"))
          .json({ error: err?.message })
      );
    };

    try {
      const { slotId } = req.body;

      if (!slotId) return resolve(res.status(409).json("missing slotId"));

      getSlot(slotId)
        .then((slot) => {
          resolve(res.status(200).json(slot));
        })
        .catch(errorHandling);
    } catch (e) {
      errorHandling(e);
    }
  });
};

module.exports.getSlot = async function getSlot(slotId) {
  const response = await axios.get(
    "https://api.assetlayer.com/api/v1/slot/info",
    {
      data: { slotId },
      headers,
    }
  );
  const slot = response.data.body.slot;

  return slot;
};

module.exports.tryGetSlot = async function tryGetSlot(slotId) {
  try {
    if (!slotId) throw new CustomError("missing appId", "409");

    const response = await axios.get(
      "https://api.assetlayer.com/api/v1/slot/info",
      {
        data: { slotId },
        headers,
      }
    );

    if (response.data.success) return response.data.body.slot;
    else return null;
  } catch (e) {
    return null;
  }
};

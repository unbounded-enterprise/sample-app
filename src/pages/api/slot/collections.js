const axios = require("axios");
const { parseError, validateToken } = require("../validate");

const headers = { appsecret: String(process.env.APP_SECRET) };

module.exports = function getCollectionsHandler(req, res) {
  try {
    return new Promise((resolve, reject) => {
      const errorHandling = (err) => {
        const e = parseError(err);
        console.log("get Collection error: ", e.message);
        if (e.custom === "401") {
          resolve(res.status(401).json({ error: e.message }));
        }
        resolve(
          res.status(e.custom ? parseInt(e.custom) : 500).json({ error: e.message })
        );
      };
      try {
        const { token, slotId } = req.body;
        if (!token || !slotId || slotId === "" || token === "") {
          resolve(res.status(409).json("wrong input"));
        }
        getCollections(token, slotId)
          .then((collections) => {
            resolve(res.status(200).json(collections));
          })
          .catch(errorHandling);
      } catch (e) {
        errorHandling(e);
      }
    });
  } catch (e) {
    res.status(500);
  }
};

async function getCollections(token, slotId) {
  const user = await validateToken(token);
  if (!user || !user.id) {
    return [];
  }
  const collectionsResponse = await axios.get(
    "https://api.assetlayer.com/api/v1/slot/collections",
    {
      data: { slotId, idOnly: false, includeDeactivated: true, handle: user.id },
      headers,
    }
  );
  const collections = collectionsResponse.data.body.slot.collections;

  return collections;
}

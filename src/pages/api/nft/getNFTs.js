const axios = require("axios");
const { parseError, validateToken } = require("../validate");

const headers = { appsecret: String(process.env.ASSETLAYER_APP_SECRET) };

module.exports = function getNFTsHandler(req, res) {
  try {
    return new Promise((resolve, reject) => {
      const errorHandling = (err) => {
        const e = parseError(err);
        console.log("get Nfts error: ", e.message);
        if (e.custom === "401") {
          resolve(res.status(401).json({ error: e.message }));
        }
        resolve(res.status(e.custom ? parseInt(e.custom) : 500).json({ error: e.message }));
      };
      try {
        const { token, slots, idOnly } = req.body;
        if (!token || !slots || !slots[0] || token === "") {
          resolve(res.status(409).json("wrong input"));
        }
        getNFTs(token, slots, idOnly)
          .then((nfts) => {
            resolve(res.status(200).json(nfts));
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

async function getNFTs(token, slots, idOnly = false) {
  const user = await validateToken(token);
  if (!user || !user.id) {
    return [];
  }
  const collectionsResponse = await axios.get(
    "https://api.assetlayer.com/api/v1/nft/slots",
    {
      data: { slotIds: slots, idOnly, handle: user.id },
      headers,
    }
  );
  const collections = collectionsResponse.data.body.nfts;

  return collections;
}

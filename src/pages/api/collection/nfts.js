const axios = require("axios");

const headers = { appsecret: String(process.env.ASSETLAYER_APP_SECRET) };

function getCollectionNFTsHandler(req, res) {
  try {
    return new Promise((resolve, reject) => {
      const errorHandling = (err) => {
        const e = parseError(err);
        console.log("get Nfts error: ", e.message);
        if (e.custom === "401") {
          resolve(res.status(401).json({ error: e.message }));
        }
        resolve(
          res
            .status(e.custom ? parseInt(e.custom) : 500)
            .json({ error: e.message })
        );
      };
      try {
        const { token, collectionId, idOnly, from, to } = req.body;
        if (!token || !collectionId || token === "") {
          resolve(res.status(409).json("wrong input"));
        }
        getCollectionNFTs(token, collectionId, idOnly, from, to)
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
}

async function getCollectionNFTs(token, collectionId, idOnly = false, from, to) {
  const user = await validateToken(token);
  if (!user || !user.id) {
    return [];
  }
  const body = { collectionId, idOnly, handle: user.id };
  if (to) {
    body.serials = `${from}-${to}`;
  }
  const collectionsResponse = await axios.get(
    "https://api.assetlayer.com/api/v1/collection/nfts",
    {
      data: body,
      headers,
    }
  );
  const collections = collectionsResponse.data.body.collection.nfts;

  return collections;
}

module.exports = { getCollectionNFTsHandler, getCollectionNFTs };

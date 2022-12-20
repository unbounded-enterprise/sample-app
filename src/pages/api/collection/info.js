const axios = require("axios");

const headers = { appsecret: String(process.env.ASSETLAYER_APP_SECRET) };

function getCollectionHandler(req, res) {
  return new Promise((resolve, reject) => {
    const errorHandling = (e) => {
      const err = parseError(e);
      console.log(err?.message);
      return resolve(res.status(parseInt(err?.custom || "500")).json({ error: err?.message }));
    };

    try {
      const { collectionId } = req.body;

      if (!collectionId) return resolve(res.status(409).json("missing collectionId"));

      getCollection(collectionId)
        .then((collection) => {
          resolve(res.status(200).json(collection));
        })
        .catch(errorHandling);
    } catch (e) {
      errorHandling(e);
    }
  });
}

async function getCollection(collectionId) {
  const response = await axios.get("https://api.assetlayer.com/api/v1/collection/info", {
    data: { collectionId },
    headers,
  });
  const collection = response.data.body.collection;

  return collection;
}

async function tryGetCollection(collectionId) {
  try {
    if (!collectionId) throw new CustomError("missing collectionId", "409");

    const response = await axios.get("https://api.assetlayer.com/api/v1/collection/info", {
      data: { collectionId },
      headers,
    });

    if (response.data.success) return response.data.body.collection;
    else return null;
  } catch (e) {
    return null;
  }
}

module.exports = { getCollectionHandler, getCollection, tryGetCollection };

const axios = require("axios");

const headers = { appsecret: String(process.env.ASSETLAYER_APP_SECRET) };

function createAppHandler(req, res) {
  return new Promise((resolve, reject) => {
    const errorHandling = (e) => {
      const err = parseError(e);
      console.log(err?.message);
      return resolve(res.status(parseInt(err?.custom || "500")).json({ error: err?.message }));
    };

    try {
      const {
        collectionName,
        slotId,
        type,
        nftMaximum,
        tags,
        handle,
        collectionImage,
      } = req.body;

      createCollection({
        collectionName,
        slotId,
        type,
        nftMaximum,
        tags,
        handle,
        collectionImage,
      })
        .then((collectionId) => {
          resolve(res.status(200).json(collectionId));
        })
        .catch(errorHandling);
    } catch (e) {
      errorHandling(e);
    }
  });
}

async function createCollection(props) {
  const response = await axios.post(
    "https://api.assetlayer.com/api/v1/collection/new",
    props,
    { headers }
  );
  const id = response.data.body.collectionId;

  return id;
}

async function tryCreateCollection(props) {
  try {
    const response = await axios.post(
      "https://api.assetlayer.com/api/v1/collection/new",
      props,
      { headers }
    );

    if (response.data.success) return response.data.body.collectionId;
    else throw new CustomError("collection creation failed", "409");
  } catch (e) {
    throw parseError(e);
  }
}

module.exports = { createAppHandler, createCollection, tryCreateCollection };

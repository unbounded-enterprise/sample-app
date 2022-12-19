const axios = require("axios");

const headers = { appsecret: String(process.env.ASSETLAYER_APP_SECRET) };

function updateCollectionHandler(req, res) {
  return new Promise((resolve, reject) => {
    const errorHandling = (e) => {
      const err = parseError(e);
      console.log(err?.message);
      return resolve(
        res.status(parseInt(err?.custom || "500")).json({ error: err?.message })
      );
    };

    try {
      const { collectionId, tags, collectionImage } = req.body;

      updateCollection({ collectionId, tags, collectionImage })
        .then((data) => {
          resolve(res.status(200).json(data));
        })
        .catch(errorHandling);
    } catch (e) {
      errorHandling(e);
    }
  });
}

async function updateCollection(props) {
  const response = await axios.post(
    "https://api.assetlayer.com/api/v1/collection/update",
    props,
    { headers }
  );
  const data = response.data;

  return data;
}

async function tryUpdateCollection(props) {
  try {
    const response = await axios.post(
      "https://api.assetlayer.com/api/v1/collection/update",
      props,
      { headers }
    );

    if (response.data.success) return response.data.success;
    else throw new CustomError("collection update failed", "409");
  } catch (e) {
    throw parseError(e);
  }
}

module.exports = { updateCollectionHandler, updateCollection, tryUpdateCollection };

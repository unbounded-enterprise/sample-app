import axios from "axios";


export default function getDogsHandler(req, res) {
    try {
      return new Promise((resolve, reject)=>{
          const errorHandling = (err)=>{
              console.log(err.message);
              resolve(res.status(500).json({error: e.message}));
          }
        try {
            const  { from, to } = req.body;
    
            getDogSlice(from, to, false).then((nfts)=>{
                resolve(res.status(200).json(nfts));
            }).catch(errorHandling)
        } catch(e) {
           errorHandling(e);
        }
    })
    } catch(e) {
        res.status(500);
    }
    }



const dogCollectionId = '6376f7428233f567ac633361'; // ONLY TEST DOGS, NOT THE REAL DURODOGS CollectionId, DONT USE THIS
const assetlayerURL = 'https://api.assetlayer.com/api/v1'


async function getDogSlice(from, to, idOnly) {
    try {
      const response = await axios.get(
        `${assetlayerURL}/collection/nfts`,
        {
          data: {
            collectionId: dogCollectionId, serials: `${from}-${to}`, idOnly, handle: 'durodogs',
          },
          headers: { appsecret: process.env.APP_SECRET},
        },
      );
      // console.log(response.data);
      if (response.data.success) {
        return response.data.body?.collection?.nfts;
      }
      return [];
    } catch (e) {
      console.log('error dog Balance: ', e);
      // return false;
    }
    return [];
  }
import axios from "axios";
import { CustomError } from "src/types/error";
import { getCollectionNFTs } from "./collection/nfts";

export default function getDogsHandler(req, res) {
    try {
      return new Promise((resolve, reject)=>{
          const errorHandling = (err)=>{
              console.log(err.message);
              resolve(res.status(500).json({error: err.message}));
          }
        try {
            const  { from, to, serials } = req.body;

            if (!serials && (isNaN(from) || isNaN(to))) throw new BasicError('Invalid Serial Range', 409);
    
            getDogSlice(serials || `${from}-${to}`).then((nfts)=>{
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



const dogCollectionId = process.env.DOG_COLLECTION_ID;
// old test id 6376f7428233f567ac633361
const assetlayerURL = process.env.ASSETLAYER_URL;


async function getDogSlice(serials, idOnly = false) {
    const nfts = await getCollectionNFTs({ collectionId: dogCollectionId, serials, idOnly });
    
    return nfts;
}
import axios from "axios";
import { CustomError } from "../../../types/error";
import Collection from "../../../types/collection";
import { parseError, validateToken } from "../validate";

const headers = { appsecret: String(process.env.APP_SECRET) };

export default function getCollectionHandler(req:any, res:any) {
	return new Promise((resolve, reject)=>{
		const errorHandling = (e:any)=>{
			const err = parseError(e);
			console.log(err?.message);
			return resolve(res.status(parseInt(err?.custom || '500')).json({ error: err?.message }));
		}

		try {
			const { collectionId } = req.body;

			if (!collectionId) return resolve(res.status(409).json('missing collectionId'));
			
			getCollection(collectionId).then((collection)=>{
				resolve(res.status(200).json(collection));
			}).catch(errorHandling)
		} catch(e:any) {
			errorHandling(e);
		}
	})
}


export async function getCollection(collectionId: string): Promise<Collection | null> {
	const response = await axios.get('https://api.assetlayer.com/api/v1/collection/info', { 
		data: { collectionId }, 
		headers },
	);
	const collection = response.data.body.collection;

	return collection;
}

export async function tryGetCollection(collectionId: string): Promise<Collection | null> {
  try {
    if (!collectionId) throw new CustomError('missing collectionId', '409');
	
    const response = await axios.get('https://api.assetlayer.com/api/v1/collection/info', { 
      data: { collectionId }, 
      headers },
    );

    if (response.data.success) return response.data.body.collection;
    else return null;
  } 
  catch(e:any) {
    return null;
  }
}
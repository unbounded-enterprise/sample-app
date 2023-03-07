import axios from "axios";
import { BasicError } from "src/types/error";
import { GetCollectionProps } from "src/types/collection";
import Collection from "src/types/collection";
import { errorHandling } from "../validate";
import { getSessionUser } from "../auth/[...nextauth]";

const headers = { appsecret: String(process.env.ASSETLAYER_APP_SECRET) };

export default function getCollectionHandler(req:any, res:any) {
	return new Promise((resolve, reject) => {
		const handleError = (e:any) => errorHandling(e, resolve, res);

		try {
			const { collectionId, collectionIds } = req.body;

			if (!(collectionId || collectionIds)) throw new BasicError('missing collectionId', 409);
			
			getCollection(req.body)
				.then((body) => resolve(res.status(200).json(body)))
				.catch(handleError)
		} catch(e:any) {
			handleError(e);
		}
	})
}


export async function getCollection(props:GetCollectionProps) {
	const response = await axios.get('https://api.assetlayer.com/api/v1/collection/info', { 
		data: props, 
		headers },
	);

	return response.data.body;
}
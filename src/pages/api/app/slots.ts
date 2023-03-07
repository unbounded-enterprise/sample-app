import axios from "axios";
import { AppFull } from "src/types/app";
import { errorHandling } from "../validate";
import { getSessionUser } from "../auth/[...nextauth]";
import { BasicError } from "src/types/error";
import { GetSlotsProps } from "src/types/app";

const defaultAppId = process.env.ASSETLAYER_APP_ID;
const headers = { appsecret: String(process.env.ASSETLAYER_APP_SECRET) };

export default function getSlotsHandler(req:any, res:any) {
	return new Promise((resolve, reject) => {
		const handleError = (e:any) => errorHandling(e, resolve, res);

		try {
			const { appId, idOnly } = req.body;

			if (!appId) {
				if (!defaultAppId) throw new BasicError('missing appId', 409);
				else req.body.appId = defaultAppId;
			}

			getSlots(req.body)
				.then((body) => resolve(res.status(200).json(body)))
				.catch(handleError)
		} catch(e:any) {
			handleError(e);
		}
	})
}


export async function getSlots(props:GetSlotsProps) {
	const response = await axios.get('https://api.assetlayer.com/api/v1/app/slots', { 
		data: props, 
		headers },
	);

	return response.data.body;
}

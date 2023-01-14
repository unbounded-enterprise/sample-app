import axios from "axios";
import { AppFull } from "src/types/app";
import { errorHandling } from "../validate";
import { getSessionUser } from "../auth/[...nextauth]";
import { BasicError } from "src/types/error";

const headers = { appsecret: String(process.env.ASSETLAYER_APP_SECRET) };

export default function getSlotsHandler(req:any, res:any) {
	return new Promise((resolve, reject) => {
		const handleError = (e:any) => errorHandling(e, resolve, res);

		try {
			const { appId, idOnly } = req.body;

			if (!appId) throw new BasicError('missing appId', 409);
			
			getSessionUser(req, res)
				.then((user) => getSlots(appId, idOnly))
				.then((app) => resolve(res.status(200).json(app)))
				.catch(handleError)
		} catch(e:any) {
			handleError(e);
		}
	})
}


export async function getSlots(appId: string, idOnly: boolean = false): Promise<AppFull> {
	const response = await axios.get('https://api.assetlayer.com/api/v1/app/slots', { 
		data: { appId, idOnly }, 
		headers },
	);
	const app = response.data.body.app;

	return app;
}

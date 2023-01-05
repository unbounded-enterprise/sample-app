import axios from "axios";
import { CustomError } from "../../../types/error";
import App from "../../../types/app";
import { parseError, validateToken } from "../validate";

const headers = { appsecret: String(process.env.APP_SECRET) };

export default function getSlotsHandler(req:any, res:any) {
	return new Promise((resolve, reject)=>{
		const errorHandling = (e:any)=>{
			const err = parseError(e);
			console.log(err?.message);
			return resolve(res.status(parseInt(err?.custom || '500')).json({ error: err?.message }));
		}

		try {
			const { appId, idOnly } = req.body;

			if (!appId) return resolve(res.status(409).json('missing appId'));
			
			getSlots(appId, idOnly).then((app)=>{
				resolve(res.status(200).json(app));
			}).catch(errorHandling)
		} catch(e:any) {
			errorHandling(e);
		}
	})
}


export async function getSlots(appId: string, idOnly: boolean = false): Promise<App | null> {
	const response = await axios.get('https://api.assetlayer.com/api/v1/app/slots', { 
		data: { appId, idOnly }, 
		headers },
	);
	const app = response.data.body.app;

	return app;
}
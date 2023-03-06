import axios from "axios";
import { BasicError } from "src/types/error";
import App from "src/types/app";
import { errorHandling } from "../validate";
import { getSessionUser } from "../auth/[...nextauth]";

const headers = { appsecret: String(process.env.ASSETLAYER_APP_SECRET) };

export default function getAppHandler(req:any, res:any) {
	return new Promise((resolve, reject) => {
		const handleError = (e:any) => errorHandling(e, resolve, res);

		try {
			const { appId } = req.body;

			if (!appId) throw new BasicError('missing appId', 409);

			getApp(appId)
				.then((app) => resolve(res.status(200).json(app)))
				.catch(handleError)
			
			/*
			getSessionUser(req, res)
				.then((user) => getApp(appId))
				.then((app) => resolve(res.status(200).json(app)))
				.catch(handleError)
			*/
		} catch(e:any) {
			handleError(e);
		}
	})
}


export async function getApp(appId: string): Promise<App> {
	if(appId === " "){
		appId = process.env.ASSETLAYER_APP_ID;
	}
	const response = await axios.get('https://api.assetlayer.com/api/v1/app/info', { 
		data: { appId }, 
		headers },
	);
	const app = response.data.body.app;

	return app;
}
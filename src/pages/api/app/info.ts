import axios from "axios";
import { BasicError } from "src/types/error";
import App from "src/types/app";
import { GetAppProps } from "src/types/app";
import { errorHandling } from "../validate";
import { getSessionUser } from "../auth/[...nextauth]";

const defaultAppId = process.env.ASSETLAYER_APP_ID;
const headers = { appsecret: String(process.env.ASSETLAYER_APP_SECRET) };

export default function getAppHandler(req:any, res:any) {
	return new Promise((resolve, reject) => {
		const handleError = (e:any) => errorHandling(e, resolve, res);

		try {
			const { appId } = req.body;

			if (!appId) {
				if (!defaultAppId) throw new BasicError('missing appId', 409);
				else if (defaultAppId === "YOURASSETLAYERAPPID") throw new BasicError('please set ASSETLAYER_APP_ID in your .env', 409);
				else req.body.appId = defaultAppId;
			}

			getApp(req.body)
				.then((body) => resolve(res.status(200).json(body)))
				.catch(handleError)
		} catch(e:any) {
			handleError(e);
		}
	})
}


export async function getApp(props:GetAppProps) {
	const response = await axios.get('https://api.assetlayer.com/api/v1/app/info', { 
		data: props, 
		headers },
	);

	return response.data.body;
}
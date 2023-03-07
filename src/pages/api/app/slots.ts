import axios from "axios";
import { AppFull } from "src/types/app";
import { errorHandling } from "../validate";
import { getSessionUser } from "../auth/[...nextauth]";
import { BasicError } from "src/types/error";
import { GetSlotsProps } from "src/types/app";

const headers = { appsecret: String(process.env.ASSETLAYER_APP_SECRET) };

export default function getSlotsHandler(req:any, res:any) {
	return new Promise((resolve, reject) => {
		const handleError = (e:any) => errorHandling(e, resolve, res);

		try {
			const { appId, idOnly } = req.body;

			if (!appId) throw new BasicError('missing appId', 409);

			getSlots(req.body)
				.then((app) => resolve(res.status(200).json(app)))
				.catch(handleError)
			
			/*
			getSessionUser(req, res)
				.then((user) => getSlots(appId, idOnly))
				.then((app) => resolve(res.status(200).json(app)))
				.catch(handleError)
			*/
		} catch(e:any) {
			handleError(e);
		}
	})
}


export async function getSlots(props:GetSlotsProps): Promise<AppFull> {
	if(props.appId === " "){
		props.appId = process.env.ASSETLAYER_APP_ID;
	};
	const response = await axios.get('https://api.assetlayer.com/api/v1/app/slots', { 
		data: props, 
		headers },
	);
	const app = response.data.body;
	console.log(app);
	return app;
}

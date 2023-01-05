import axios from "axios";
import { CustomError } from "../../../types/error";
import App from "../../../types/app";
import { parseError, validateToken } from "../validate";

const headers = { appsecret: String(process.env.APP_SECRET) };

export default function getAppHandler(req:any, res:any) {
	return new Promise((resolve, reject)=>{
		const errorHandling = (e:any)=>{
			const err = parseError(e);
			console.log(err?.message);
			return resolve(res.status(parseInt(err?.custom || '500')).json({ error: err?.message }));
		}

		try {
			const { appId } = req.body;

			if (!appId) return resolve(res.status(409).json('missing appId'));
			
			getApp(appId).then((app)=>{
				resolve(res.status(200).json(app));
			}).catch(errorHandling)
		} catch(e:any) {
			errorHandling(e);
		}
	})
}


export async function getApp(appId: string): Promise<App | null> {
	const response = await axios.get('https://api.assetlayer.com/api/v1/app/info', { 
		data: { appId }, 
		headers },
	);
	const app = response.data.body.app;

	return app;
}

export async function tryGetApp(appId: string): Promise<App | null> {
  try {
    if (!appId) throw new CustomError('missing appId', '409');
	
    const response = await axios.get('https://api.assetlayer.com/api/v1/app/info', { 
      data: { appId }, 
      headers },
    );

    if (response.data.success) return response.data.body.app;
    else return null;
  } 
  catch(e:any) {
    return null;
  }
}
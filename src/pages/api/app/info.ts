import { NextApiRequest, NextApiResponse } from "next/types";
import { AssetLayer } from "@assetlayer/sdk-client";
import { errorHandling } from "../validate";
import { BasicError } from "src/types/error";

export const assetlayer = new AssetLayer({ 
	appSecret: process.env.ASSETLAYER_APP_SECRET
});

export default function getAppsHandler(req:NextApiRequest, res:NextApiResponse) {
	return new Promise((resolve, reject) => {
		const handleError = (e:any) => errorHandling(e, resolve, res);
		console.log("in getAppsHandler");
		
		try {
			assetlayer.apps.raw.info({ appId:process.env.ASSETLAYER_APP_ID})
				.then((response) => resolve(res.status(200).json(response)))
				.catch(handleError)
		} catch(e:any) {
			handleError(e);
		}
	})
}

export async function getApp() {
	let appResonse = await assetlayer.apps.getApp({ appId:process.env.ASSETLAYER_APP_ID});
	return appResonse;
}
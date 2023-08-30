import { NextApiRequest, NextApiResponse } from "next/types";
import axios from "axios";
import { errorHandling } from "../validate";
import { BasicError } from "src/types/error";
import { GetSlotsProps } from "src/types/app";
import {assetlayer} from "./info";

const defaultAppId = process.env.ASSETLAYER_APP_ID;
const headers = { appsecret: String(process.env.ASSETLAYER_APP_SECRET) };

export default function getSlotsHandler(req:NextApiRequest, res:NextApiResponse) {
	return new Promise((resolve, reject) => {
		const handleError = (e:any) => errorHandling(e, resolve, res);

		try {
			const { idOnly } = req.body;
			let appId = process.env.ASSETLAYER_APP_ID;
			if (!appId) {
				if (!defaultAppId) throw new BasicError('missing appId', 409);
				else if (defaultAppId === "YOURASSETLAYERAPPID") throw new BasicError('please set ASSETLAYER_APP_ID in your .env', 409);
				else req.body.appId = defaultAppId;
			}

			assetlayer.apps.raw.slots({ appId, idOnly })
				.then((body) => resolve(res.status(200).json(body)))
				.catch(handleError)
		} catch(e:any) {
			handleError(e);
		}
	})
}

export async function getSlots(props:GetSlotsProps) {
	return await assetlayer.apps.getAppSlots(props);
}

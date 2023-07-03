import { NextApiRequest, NextApiResponse } from "next/types";
import axios from "axios";
import { BasicError } from "src/types/error";
import {GetSlotProps} from "src/types/slot";
import { getSessionUser } from "../auth/[...nextauth]";
import { errorHandling } from "../validate";

const headers = { appsecret: String(process.env.ASSETLAYER_APP_SECRET) };

export default function getSlotHandler(req:NextApiRequest, res:NextApiResponse) {
	return new Promise((resolve, reject) => {
		const handleError = (e:any) => errorHandling(e, resolve, res);

		try {
			const { slotId } = req.body;

			if (!slotId) throw new BasicError('missing slotId', 409);

			getSlot(req.body)
				.then((body) => resolve(res.status(200).json(body)))
				.catch(handleError)
		} catch(e:any) {
			handleError(e);
		}
	})
}


export async function getSlot(props:GetSlotProps) {
	const response = await axios.get('https://api.assetlayer.com/api/v1/slot/info', { 
		data: props, 
		headers },
	);

	return response.data.body;
}
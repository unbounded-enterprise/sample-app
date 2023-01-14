import axios from "axios";
import { BasicError } from "src/types/error";
import Slot from "src/types/slot";
import { getSessionUser } from "../auth/[...nextauth]";
import { errorHandling } from "../validate";

const headers = { appsecret: String(process.env.ASSETLAYER_APP_SECRET) };

export default function getSlotHandler(req:any, res:any) {
	return new Promise((resolve, reject) => {
		const handleError = (e:any) => errorHandling(e, resolve, res);

		try {
			const { slotId } = req.body;

			if (!slotId) throw new BasicError('missing slotId', 409);

			getSessionUser(req, res)
				.then((user) => getSlot(slotId))
				.then((slot) => resolve(res.status(200).json(slot)))
				.catch(handleError)
		} catch(e:any) {
			handleError(e);
		}
	})
}


export async function getSlot(slotId: string): Promise<Slot> {
	const response = await axios.get('https://api.assetlayer.com/api/v1/slot/info', { 
		data: { slotId }, 
		headers },
	);
	const slot = response.data.body.slot;

	return slot;
}
import axios from "axios";
import { CustomError } from "../../../types/error";
import Slot from "../../../types/slot";
import { parseError, validateToken } from "../validate";

const headers = { appsecret: String(process.env.APP_SECRET) };

export default function getSlotHandler(req:any, res:any) {
	return new Promise((resolve, reject)=>{
		const errorHandling = (e:any)=>{
			const err = parseError(e);
			console.log(err?.message);
			return resolve(res.status(parseInt(err?.custom || '500')).json({ error: err?.message }));
		}

		try {
			const { slotId } = req.body;

			if (!slotId) return resolve(res.status(409).json('missing slotId'));
			
			getSlot(slotId).then((slot)=>{
				resolve(res.status(200).json(slot));
			}).catch(errorHandling)
		} catch(e:any) {
			errorHandling(e);
		}
	})
}


export async function getSlot(slotId: string): Promise<Slot | null> {
	const response = await axios.get('https://api.assetlayer.com/api/v1/slot/info', { 
		data: { slotId }, 
		headers },
	);
	const slot = response.data.body.slot;

	return slot;
}

export async function tryGetSlot(slotId: string): Promise<Slot | null> {
  try {
    if (!slotId) throw new CustomError('missing appId', '409');
	
    const response = await axios.get('https://api.assetlayer.com/api/v1/slot/info', { 
      data: { slotId }, 
      headers },
    );

    if (response.data.success) return response.data.body.slot;
    else return null;
  } 
  catch(e:any) {
    return null;
  }
}
import axios from "axios";
import { CustomError } from "../../../types/error";
import Expression from "../../../types/expression";
import { parseError, validateToken } from "../validate";

const headers = { appsecret: String(process.env.APP_SECRET) };

export default function getExpressionsHandler(req:any, res:any) {
	return new Promise((resolve, reject)=>{
		const errorHandling = (e:any)=>{
			const err = parseError(e);
			console.log(err?.message);
			return resolve(res.status(parseInt(err?.custom || '500')).json({ error: err?.message }));
		}

		try {
			const { slotId } = req.body;

			if (!slotId) return resolve(res.status(409).json('missing slotId'));
			
			getExpressions(slotId).then((expressions)=>{
				resolve(res.status(200).json(expressions));
			}).catch(errorHandling)
		} catch(e:any) {
			errorHandling(e);
		}
	})
}


export async function getExpressions(slotId: string): Promise<Expression[] | null> {
	const response = await axios.get('https://api.assetlayer.com/api/v1/expression/slot', { 
		data: { slotId }, 
		headers },
	);
	const expressions = response.data.body.expressions;

	return expressions;
}

export async function tryGetExpressions(slotId: string): Promise<Expression[] | null> {
  try {
    if (!slotId) throw new CustomError('missing slotId', '409');
	
    const response = await axios.get('https://api.assetlayer.com/api/v1/expression/slot', { 
      data: { slotId }, 
      headers },
    );

    if (response.data.success) return response.data.body.expressions;
    else return null;
  } 
  catch(e:any) {
    return null;
  }
}
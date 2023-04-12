import { BasicError, CustomError } from "src/types/error";
import { User } from "src/types/user";
import jwt from 'jsonwebtoken';
import Account from "src/types/account";
import App from "src/types/app";
import Slot from "src/types/slot";
import Team from "src/types/team";

export const errorHandling = (error:any, resolve:any, res:any)=>{
    const e = parseBasicError(error);
    console.log(e.message);
    return resolve(res.status(e.status).json({ error: e.message }));
}

export function parseError(error: any, fallbackCode: string = '500'):CustomError {
    if (error?.response?.data?.message) { // node js axios errors
      return new CustomError(error.response.data.message, String(error.response.data.statusCode));
    }
    if (error?.response?.data) { // client side axios errors
      return new CustomError(error.response.data, error.response.status?String(error.response.status):fallbackCode);
    }
    if (error?.custom || error?.status) {
      return error;
    } 
    
    return new CustomError(error.message || 'Unknown Error', fallbackCode);
}

export function parseBasicError(error:any, fallbackCode:number = 500):BasicError {
    if (!error) return new BasicError('Unknown Error', fallbackCode);
    
    const message = error.response?.data?.message || error.response?.data || error.data?.message || error.message || 'Unknown Error';
    const status = error.response?.data?.statusCode || error.response?.status || error.status || error.custom || fallbackCode;
    
    return new BasicError(message, status);
}

export function parseErrorMessage(error: any):string {
    if (error?.response?.data) {
        const { error:err, message } = error.response.data;
        if (err) return String(err);
        else if (message) return String(message);

        return JSON.stringify(error.response.data);
    }

    return 'Unknown Error';
}

export async function validateToken(token: string): Promise<User | null> {
    if (!token || !process.env.JWT_SECRET) return null;
    
    const user = (await jwt.verify(token, String(process.env.JWT_SECRET))) as User;
  
    return user;
}

export async function validateTokenT(token: string, returnValue: any = null): Promise<any | null> {
    if (!token) throw new CustomError('Missing Token', '409');
    else if (!process.env.JWT_SECRET) throw new CustomError('Missing JWT_SECRET', '409');
    
    let result:any = null;

    await jwt.verify(token, String(process.env.JWT_SECRET), (error, decode) => {
        result = { error, decode }; 
    });

    if (result.error || !result.decode) throw new CustomError('Invalid Token', '401');
  
    return returnValue || (result.decode as User);
}

export function validateTeamId(account:Account, teamId:string) {
    const role = account.roles.find(role => role.teamId === teamId);

    if (!role) throw new BasicError('Failed to  validate Team ID', 409);

    return role.teamId;
}

export function validateAppId(team:Team, appId:string) {
    const app = team.apps.find((id) => id === appId);
    
    if (!app) throw new BasicError('Failed to validate App ID', 409);

    return appId;
}

export function validateSlotId(app:App, slotId:string) {
    const slot = app.slots.find((id) => id === slotId);
    
    if (!slot) throw new BasicError('Failed to validate Slot ID', 409);

    return slotId;
}

export function validateExpressionId(slot:Slot, expressionId:string) {
    const expression = slot.expressions.find((id) => id === expressionId);
    
    if (!expression) throw new BasicError('Failed to validate Slot ID', 409);

    return expressionId;
}

export default function validationHandler(req:any, res:any) {
    return new Promise((resolve, reject)=>{
		const errorHandling = (e:any)=>{
			const err = parseError(e);
			console.log(err?.message);
			return resolve(res.status(parseInt(err?.custom || '500')).json({ error: err?.message }));
		}

        try {
            const token = req.headers.token;

            validateToken(token).then((user)=>{
                if (!user) throw new CustomError('Invalid Token', '401');
                resolve(res.status(200).json(user));
            }).catch(errorHandling)
        } catch(e:any) {
            errorHandling(e);
        }
    })
    
}
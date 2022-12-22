import { CustomError } from "src/types/error";
import { User } from "src/types/user";
import jwt from 'jsonwebtoken';

export function parseError(error: any, fallbackCode: string = '500'):CustomError {
    if (error?.response?.data?.message) { // node js axios errors
      return new CustomError(error.response.data.message, String(error.response.data.statusCode));
    }
    if (error?.response?.data) { // client side axios errors
      return new CustomError(error.response.data, error.response.status?String(error.response.status):fallbackCode);
    }
    if (error.custom) {
      return error;
    } 
    return new CustomError(error.message, fallbackCode )
}

export async function validateToken(token: string): Promise<User | null> {
    if (!token) return null;
    
    const user = (await jwt.verify(token, String(process.env.JWT_SECRET))) as User;
  
    return user;
}

export async function validateTokenT(token: string, returnValue: any = null): Promise<any | null> {
    if (!token) throw new CustomError('Missing Token', '409');
    
    let result:any = null;

    await jwt.verify(token, String(process.env.JWT_SECRET), (error, decode) => {
        result = { error, decode }; 
    });

    if (result.error || !result.decode) throw new CustomError('Invalid Token', '401');
  
    return returnValue || (result.decode as User);
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
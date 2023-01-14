import { User } from "../../../types/user";
import jwt from 'jsonwebtoken';
import { getAccount, getProfile, getUser } from "./getProfile";
import { errorHandling, parseError } from "../validate";
import { BasicError } from "src/types/error";

const crypto = require('crypto');

export function saltToBuffer(salt:string) {
  const buffer = Buffer.from(salt, 'utf8');
  const bytes = [];
  
  for (let i = 0; i < 32; i+=2) {
    bytes.push((buffer[i] * buffer[i + 1]) % 256);
  }

  return Buffer.from(bytes);
}

interface SaltProps {
  handle: string;
  cookie: any;
  pin: any;
  ip: any;
}

function generateSalt({ handle, cookie, pin, ip }:SaltProps) {
  return crypto.createHash('sha256', handle)
    .update(cookie || 'nom')
    .update(ip || 'address')
    .update(pin || '83')
    .digest('hex');
}

function generateSaltBuffer(props:SaltProps) {
  const salt = generateSalt(props);
  return saltToBuffer(salt)
}

function generateSaltKey(props:SaltProps) {
  const secret = process.env.ENCRYPTION_SECRET;
  const salt = generateSalt(props);
  const key = crypto.scryptSync(secret, salt, 32);
  const iv = saltToBuffer(salt);

  return { key, iv };
}

export function encryptAuthToken(authToken:string, saltData:SaltProps) {
  const algorithm = "aes-256-cbc"; 
  const { key, iv } = generateSaltKey(saltData);
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  const encrypted = cipher.update(authToken);
  const data = Buffer.concat([encrypted, cipher.final()]).toString('hex');

  return data;
}

export function decryptAuthToken(encryptedToken:string, saltData:SaltProps) {
  const algorithm = "aes-256-cbc"; 
  const { key, iv } = generateSaltKey(saltData);
  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  const decryptedToken = decipher.update(encryptedToken, 'hex', 'utf8') + decipher.final('utf8');

  return decryptedToken;
}

export function getToken(user:User):string {
  if (process.env.JWT_SECRET) throw new BasicError('Missing JWT_SECRET', 500);

  const token = jwt.sign(user, String(process.env.JWT_SECRET));

  return token;
}

export function getTokenFromProfile(profile:any) {
  const user = getUser(profile);
  const token = getToken(user);
  return token;
}

export function getTokenFromProfile2(profile:any, req:any) {
  const { handcashtoken, cookie, pin, ['x-forwarded-for']:ip } = req.headers;
  const user = getUser(profile);
  
  // user.pld = encryptAuthToken(handcashtoken, { handle: user.handle, cookie, pin, ip });

  const token = getToken(user);

  return token;
}

export async function getUserFromHandcash(handcashtoken:string) {
  const account = await getAccount(handcashtoken);
  const profile = await getProfile(account, false);
  const user = getUser(profile);

  return user;
}

export async function getTokenFromRequest(req:any) {
  const { handcashtoken, cookie, pin, ['x-forwarded-for']:ip } = req.headers;
  const account = await getAccount(handcashtoken);
  const profile = await getProfile(account, false);
  const user = getUser(profile);

  // user.pld = encryptAuthToken(handcashtoken, { handle: user.handle, cookie, pin, ip });

  const token = getToken(user);

  return token;
}

export default function getHandcashTokenHandler(req:any, res:any) {
  return new Promise((resolve, reject)=>{
		const handleError = (e:any) => errorHandling(e, resolve, res);
    
    try {
      if (!req.headers.handcashtoken) throw new BasicError('no handcash token', 409);
      
      getTokenFromRequest(req)
        .then((token) => resolve(res.status(200).json(token)))
        .catch(handleError);
    } catch(e:any) {
      handleError(e);
    }
  })
}
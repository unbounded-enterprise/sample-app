import { NextApiRequest, NextApiResponse } from "next/types";
import { handCashConnect } from "./handcash/getProfile";

export default function getRedirectionURLHandler(req:NextApiRequest, res:NextApiResponse) {
    return new Promise((resolve, reject)=>{
        try {
            getURL()
                .then((url:any) => {
                    resolve(res.status(200).json(url));
                })
        } catch(e:any) {
            resolve(res.status(200).json(`https://app.handcash.io/#/authorizeApp?appId=${String(process.env.HANDCASH_APP_ID)}`)); 
        }
    })
    
  }


  async function getURL() {
        const state = (process.env.ENVIRONMENT !== 'production') ? { state: process.env.ENVIRONMENT } : {};
        const handcashResponse = await handCashConnect.getRedirectionUrl(state);
        
        return handcashResponse;
  }
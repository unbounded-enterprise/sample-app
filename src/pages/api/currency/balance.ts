import { NextApiRequest, NextApiResponse } from "next/types";
import axios from "axios";
import { BasicError } from "src/types/error";
import { GetCurrencyBalanceProps } from "src/types/currency";
import { errorHandling } from "../validate";
import { assetlayerDidToken } from "../user/register";

export default function getAssetSlotsHandler(req:NextApiRequest, res:NextApiResponse) {
    return new Promise((resolve, reject) => {
        const handleError = (e:any) => errorHandling(e, resolve, res);

        try {
            const { didtoken } = req.headers;

            
            if (!didtoken || Array.isArray(didtoken)) throw new BasicError('missing didtoken', 409);
            
            assetlayerDidToken.currencies.raw.getCurrencyBalance({ appId:"64dc10469f07eb4ceb26ef14"}, { didtoken })
                .then((body) => resolve(res.status(200).json(body)))
                .catch(handleError)
        } catch(e:any) {
            handleError(e);
        }
    })
}

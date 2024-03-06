import { NextApiRequest, NextApiResponse } from "next/types";
import { errorHandling } from "../validate";
import { AssetLayer } from "@assetlayer/sdk";

export const assetlayerDidToken = new AssetLayer({ 
    appSecret: process.env.ASSETLAYER_APP_SECRET
});

export default function registerUserHandler(req:NextApiRequest, res:NextApiResponse) {
    return new Promise((resolve, reject) => {
        const handleError = (e:any) => errorHandling(e, resolve, res);

        try {
            const { otp } = req.body;

            assetlayerDidToken.users.raw.register({ otp }, { didtoken: (req.headers.didtoken as string) })
                .then((response) => resolve(res.status(200).json(response)))
                .catch(handleError);
        } catch(e:any) {
            handleError(e);
        }
    })
}
import { NextApiRequest, NextApiResponse } from "next/types";
import axios from "axios";
import { getSessionUser } from "../auth/[...nextauth]";
import { BasicError } from "src/types/error";
import { errorHandling } from "../validate";
import { assetlayer } from "../app/info";


export default function sendAssetHandler(req:NextApiRequest, res:NextApiResponse) {
    return new Promise((resolve, reject) => {
        const handleError = (e:any) => errorHandling(e, resolve, res);
        console.log("request query:", req.query);
		console.log("request body:", req.body);

        try {
            const { didtoken } = req.headers;
            const { receiver, assetId, collectionId, walletUserId } = req.body;
			const assetIds = req.query.assetIds || req.query['assetIds[]'] || req.body.assetIds;

            if (!didtoken || Array.isArray(didtoken)) throw new BasicError('missing didtoken', 409);
            if (!receiver) throw new BasicError('missing receiver', 409);
            if (!(assetId || assetIds || collectionId)) throw new BasicError('missing assetId(s)', 409);
            
            assetlayer.assets.raw.send({ receiver, assetId, assetIds, collectionId }, { didtoken })
                .then((response) => resolve(res.status(200).json(response)))
                .catch(handleError)
        } catch(e:any) {
            handleError(e);
        }
    })
}

/*const headers = { appsecret: String(process.env.ASSETLAYER_APP_SECRET) };

export default function getNFTsUserHandler(req:NextApiRequest, res:NextApiResponse) {
    return new Promise((resolve, reject) => {
        const handleError = (e:any) => errorHandling(e, resolve, res);

        try {
            const { recipientHandle, nftId } = req.body;

            getSessionUser(req, res)
                .then((user) => getNFTsUser({ handle: user.handle, recipientHandle: recipientHandle, nftId: nftId }))
                .then((body) => resolve(res.status(200).json(body)))
                .catch(handleError)
        } catch(e:any) {
            handleError(e);
        }
    })
}

export async function getNFTsUser(props:SendNFTProps) {
    const response = await axios.post('https://api.assetlayer.com/api/v1/nft/send', 
        props, 
        {headers: headers}
    );

    return response.data.body;
}*/
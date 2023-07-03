import { NextApiRequest, NextApiResponse } from "next/types";
import axios from "axios";
import { BasicError } from "src/types/error";
import { GetCollectionsProps } from "src/types/slot";
import { getSessionUser } from "../auth/[...nextauth]";
import { errorHandling } from "../validate";

const headers = { appsecret: String(process.env.ASSETLAYER_APP_SECRET) };

export default function getCollectionsHandler(req:NextApiRequest, res:NextApiResponse) {
    return new Promise((resolve, reject) => {
        const handleError = (e:any) => errorHandling(e, resolve, res);

        try {
            const { slotId, idOnly, includeDeactivated } = req.body;

            if (!slotId) throw new BasicError('missing slotId', 409);

            getCollections({ slotId, idOnly, includeDeactivated})
                .then((body) => resolve(res.status(200).json(body)))
                .catch(handleError)
        } catch(e:any) {
            handleError(e);
        }
    })
}

export async function getCollections(props:GetCollectionsProps) {
    const response = await axios.get('https://api.assetlayer.com/api/v1/slot/collections', { 
        data: props, 
        headers },
    );

    return response.data.body;
}
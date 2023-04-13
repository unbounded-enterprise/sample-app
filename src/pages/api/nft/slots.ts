import { NextApiRequest, NextApiResponse } from "next/types";
import axios from "axios";
import { BasicError } from "src/types/error";
import { GetNFTSlotsProps } from "src/types/nft";
import { getSessionUser } from "../auth/[...nextauth]";
import { errorHandling } from "../validate";

const headers = { appsecret: String(process.env.ASSETLAYER_APP_SECRET) };

export default function getNFTsSlotsHandler(req:NextApiRequest, res:NextApiResponse) {
    return new Promise((resolve, reject) => {
        const handleError = (e:any) => errorHandling(e, resolve, res);

        try {
            const  { slotIds, idOnly, countsOnly } = req.body;

            if (!slotIds || !slotIds[0]) throw new BasicError('wrong input', 409);
            
            getSessionUser(req, res)
                .then((user) => getNFTsSlots({ handle: user.handle, slotIds, idOnly, countsOnly }))
                .then((body) => resolve(res.status(200).json(body)))
                .catch(handleError)
        } catch(e:any) {
            handleError(e);
        }
    })
}

async function getNFTsSlots(props:GetNFTSlotsProps) {
    const response = await axios.get('https://api.assetlayer.com/api/v1/nft/slots', { 
        data: props, 
        headers },
    );

    return response.data.body;
}
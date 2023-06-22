import { NextApiRequest, NextApiResponse } from "next/types";
import axios from "axios";
import { GetNFTInfoProps } from "src/types/nft";
import { getSessionUser } from "../auth/[...nextauth]";
import { errorHandling } from "../validate";

const headers = { appsecret: String(process.env.ASSETLAYER_APP_SECRET) };

export default function getNFTInfoHandler(req:NextApiRequest, res:NextApiResponse) {
    return new Promise((resolve, reject) => {
        const handleError = (e:any) => errorHandling(e, resolve, res);
        try {
            getNFTInfo(req.body)
                .then((body) => resolve(res.status(200).json(body)))
                .catch(handleError)
        } catch(e:any) {
            handleError(e);
        }
    })
}

async function getNFTInfo(props:GetNFTInfoProps) {
    const response = await axios.get('https://api.assetlayer.com/api/v1/nft/info', { 
        data: props, 
        headers },
    );

    return response.data.body;
}
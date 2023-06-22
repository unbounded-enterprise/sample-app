import { NextApiRequest, NextApiResponse } from "next/types";
import axios from "axios";
import { SendNFTProps } from "src/types/nft";
import { getSessionUser } from "../auth/[...nextauth]";
import { errorHandling } from "../validate";

const headers = { appsecret: String(process.env.ASSETLAYER_APP_SECRET) };

export default function getNFTsUserHandler(req:NextApiRequest, res:NextApiResponse) {
    return new Promise((resolve, reject) => {
        const handleError = (e:any) => errorHandling(e, resolve, res);

        try {
            const  { recipientHandle, nftId } = req.body;

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
}
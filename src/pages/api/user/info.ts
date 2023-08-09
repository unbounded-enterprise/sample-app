import { NextApiRequest, NextApiResponse } from "next/types";
import { errorHandling } from "../validate";
import { assetlayer } from "./register";

export default function getUserHandler(req:NextApiRequest, res:NextApiResponse) {
    return new Promise((resolve, reject) => {
        const handleError = (e:any) => errorHandling(e, resolve, res);

        try {
            assetlayer.users.raw.getUser({ didtoken: (req.headers.didtoken as string) })
                .then((response) => resolve(res.status(200).json(response)))
                .catch(handleError);
        } catch(e:any) {
            handleError(e);
        }
    })
}
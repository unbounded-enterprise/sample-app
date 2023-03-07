import axios from "axios";
import { BasicError } from "src/types/error";
import { getSessionUser } from "../auth/[...nextauth]";
import { errorHandling } from "../validate";

const headers = { appsecret: String(process.env.ASSETLAYER_APP_SECRET) };

export default function getNFTsUserHandler(req:any, res:any) {
    return new Promise((resolve, reject) => {
        const handleError = (e:any) => errorHandling(e, resolve, res);

        try {
            const  {idOnly, countsOnly } = req.body;
            //if (!slotIds || !slotIds[0]) throw new BasicError('wrong input', 409);
            
            getSessionUser(req, res)
                .then((user) => getNFTsUser({ handle: user.handle, idOnly, countsOnly }))
                .then((nfts) => resolve(res.status(200).json(nfts)))
                .catch(handleError)
        } catch(e:any) {
            handleError(e);
        }
    })
}

interface getNFTsProps {
    handle: string;
    idOnly?: boolean;
    countsOnly?: boolean;
}

async function getNFTsUser(props:getNFTsProps) {
    const apiResponse = await axios.get('https://api.assetlayer.com/api/v1/nft/user', { 
        data: props, 
        headers },
    );

    return apiResponse.data.body;
}
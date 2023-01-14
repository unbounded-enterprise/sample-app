import axios from "axios";
import { BasicError } from "src/types/error";
import { getSessionUser } from "../auth/[...nextauth]";
import { errorHandling } from "../validate";

const headers = { appsecret: String(process.env.ASSETLAYER_APP_SECRET) };

export default function getNFTsHandler(req:any, res:any) {
    return new Promise((resolve, reject) => {
        const handleError = (e:any) => errorHandling(e, resolve, res);

        try {
            const  { slotIds, idOnly, countsOnly } = req.body;

            if (!slotIds || !slotIds[0]) throw new BasicError('wrong input', 409);
            
            getSessionUser(req, res)
                .then((user) => ({ handle: user.handle, slotIds, idOnly, countsOnly }))
                .then(getNFTs)
                .then((nfts) => resolve(res.status(200).json(nfts)))
                .catch(handleError)
        } catch(e:any) {
            handleError(e);
        }
    })
}

interface getNFTsProps {
    handle: string;
    slotIds: string[];
    idOnly?: boolean;
    countsOnly?: boolean;
}

async function getNFTs(props:getNFTsProps) {
    const collectionsResponse = await axios.get('https://api.assetlayer.com/api/v1/nft/slots', { 
        data: props, 
        headers },
    );
    const collections = collectionsResponse.data.body.nfts;

    return collections;
}
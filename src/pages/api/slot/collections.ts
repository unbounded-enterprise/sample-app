import axios from "axios";
import { BasicError } from "src/types/error";
import { GetCollectionsProps } from "src/types/slot";
import { getSessionUser } from "../auth/[...nextauth]";
import { errorHandling } from "../validate";

const headers = { appsecret: String(process.env.ASSETLAYER_APP_SECRET) };

export default function getCollectionsHandler(req:any, res:any) {
    try {
        return new Promise((resolve, reject) => {
            const handleError = (e:any) => errorHandling(e, resolve, res);

            try {
                const  { slotId, idOnly, includeDeactivated } = req.body;

                if (!slotId) throw new BasicError('missing slotId', 409);

                getSessionUser(req, res)
                    .then((user) => ({ handle: user.handle, slotId, idOnly, includeDeactivated }))
                    .then(getCollections)
                    .then((collections) => resolve(res.status(200).json(collections)))
                    .catch(handleError)
            } catch(e:any) {
                handleError(e);
            }
    })
    } catch(e:any) {
        res.status(500);
    }
}

async function getCollections(props:GetCollectionsProps) {
    const collectionsResponse = await axios.get('https://api.assetlayer.com/api/v1/slot/collections', { 
        data: props, 
        headers },
    );
    const collections = collectionsResponse.data.body.slot.collections;

    return collections;
}
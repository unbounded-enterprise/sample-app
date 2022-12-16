import {v4 as uuidv4} from 'uuid';
import HandCashService from "../../../../utils/HandCashService";
import AuthTokenRepository from "../../../../repositories/AuthTokenRepository";
import SessionTokenRepository from "../../../../repositories/SessionTokenRepository";


export default async function handler(req, res) {
    const {authToken} = req.query;

    const {publicProfile} = await new HandCashService(authToken).getProfile();

    const payload = {
        sessionId: uuidv4(),
        user: {
            handle: publicProfile.handle,
            displayName: publicProfile.displayName,
            avatarUrl: publicProfile.avatarUrl,
        },
    };
    const sessionToken = SessionTokenRepository.generate(payload);
    AuthTokenRepository.setAuthToken(authToken, payload.sessionId);
    return res.redirect(`/?sessionToken=${sessionToken}`);
}
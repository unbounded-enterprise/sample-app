import { HandCashConnect } from "@handcash/handcash-connect";

const appId = process.env.HANDCASH_APP_ID;
const appSecret = process.env.HANDCASH_APP_SECRET;


const handCashConnect = new HandCashConnect({
    appId: appId,
    appSecret: appSecret,
});

export default class HandCashService {
    constructor(authToken) {
        this.account = handCashConnect.getAccountFromAuthToken(authToken);
    }

    async getProfile() {
        return this.account.profile.getCurrentProfile();
    }

    async pay({destination, amount, currencyCode}) {
        return this.account.wallet.pay({
            payments: [
                {destination, amount, currencyCode},
            ],
            description: 'Testing Connect SDK',
        });
    }

    getRedirectionUrl() {
        return handCashConnect.getRedirectionUrl();
    }
}
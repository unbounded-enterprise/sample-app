const { HandCashConnect } = require('@handcash/handcash-connect');
const handCashConnect = new HandCashConnect({
  appId: String(process.env.HANDCASH_APP_ID),
  appSecret: String(process.env.HANDCASH_APP_SECRET),
});


export default function getRedirectionURLHandler(req:any, res:any) {
    return new Promise((resolve, reject)=>{
        try {
            getURL().then((url:any)=>{
                resolve(res.status(200).json(url));
            })
        } catch(e:any) {
            resolve(res.status(200).json(`https://app.handcash.io/#/authorizeApp?appId=${String(process.env.HANDCASH_APP_ID)}`)); 
        }
    })
    
  }


  async function getURL() {
        const state = (process.env.ENVIRONMENT !== 'production') ? { state: process.env.ENVIRONMENT } : {};
        const handcashResponse = await handCashConnect.getRedirectionUrl(state);
        
        return handcashResponse;
  }
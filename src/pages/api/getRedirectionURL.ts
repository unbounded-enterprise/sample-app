const { HandCashConnect } = require('@handcash/handcash-connect');
  const handCashConnect = new HandCashConnect({
  appId: String(process.env.ASSETLAYER_HANDCASH_APPID),
  appSecret: String(process.env.ASSETLAYER_HANDCASH_SECRET),
});


export default function getRedirectionURLHandler(req:any, res:any) {
    return new Promise((resolve, reject)=>{
        try {
            getURL().then((url:any)=>{
                resolve(res.status(200).json(url));
            })
        } catch(e:any) {
            resolve(res.status(200).json(`https://app.handcash.io/#/authorizeApp?appId=${String(process.env.ASSETLAYER_HANDCASH_APPID)}`)); 
        }
    })
    
  }


  async function getURL() {
        const state = (process.env.ENVIRONMENT !== 'production') ? { state: process.env.ENVIRONMENT } : {};
        const handcashResponse = await handCashConnect.getRedirectionUrl(state);
        return handcashResponse;
  }
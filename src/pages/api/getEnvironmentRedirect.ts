const redirects:any = {
    'local': 'http://localhost:3000',
    'preview': 'https://deploy-preview-2--nft-sample-app.netlify.app/',
    'branch': 'https://dev--nft-sample-app.netlify.app/'
}

export default function getEnvironmentRedirect(req:any, res:any) {
    const { environment } = req.body;
    return new Promise((resolve, reject)=>{
        try {
            getURL(environment).then((redirect:any)=>{
                resolve(res.status(200).json(redirect));
            })
        } catch(e:any) {
            reject(new Error('Failed to Get URL')); 
        }
    })
    
}

async function getURL(environment:string) {
    const redirect = redirects[environment];
    console.log('redirect', redirect)
    if (!redirect) throw new Error('No URL Match');
    return redirect;
}
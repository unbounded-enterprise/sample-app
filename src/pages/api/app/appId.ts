export default async function handler(req, res) {
    // Fetch the appId from environment variables
    const appId = process.env.ASSETLAYER_APP_ID;
  
    // Check if appId exists
    if (!appId) {
      return res.status(404).json({ error: 'appId not found' });
    }
  
    // Return the appId in the response
    res.status(200).json({ appId });
  }

## Quick Start

- [Download from Github] (https://github.com/unbounded-enterprise/sample-app)
  or [Download from Asset Layer](https://assetlayer.com/sample-app)

- Make sure your Node.js and npm versions are up to date for `React 18`

- Generate a new `.env` file locally, which will also generate a random secret, by running the following command:

```shell
npm run create-env
 ```

That command will create a `.env` that looks like this:

```bash
ENVIRONMENT = "local"
URL = "http://localhost:3000"
DOG_COLLECTION_ID = "638665d8506da1c31926beef"
ASSETLAYER_URL = "https://api.assetlayer.com/api/v1"
ASSETLAYER_APP_SECRET = "<asset-layer-app-secret>"
HANDCASH_APP_ID = "<handcash-app-id>"
HANDCASH_APP_SECRET = "<handcash-app-secret>"
NEXTAUTH_SECRET="<nextauth-secret>"
ENCRYPTION_SECRET="<encr-secret">
```

- Install dependencies: `npm install` or `yarn`

- Start the server: `npm run dev` or `yarn dev`

- Views are on: `localhost:3000`


## File Structure

Within the download you'll find the following directories and files:

```
nft-sample-app

┌── .env.example
├── .eslintrc.json
├── .gitignore
├── CHANGELOG.md
├── LICENSE.md
├── next.config.js
├── package.json
├── README.md
├── public
└── src
	├── __mocks__
	├── components
	├── icons
	├── lib
	├── theme
	├── utils
	└── pages
		├── 404.js
		├── _app.js
		├── _document.js
		├── index.js
		├── register.js
```


## Set Up the Proxy Server
- here's how to set up the proxy if you are not using a NEXT client + API routes
- need to open source our proxy sample

## License

- Licensed under MIT

## Contact Us

- Email Us: support@assetlayer.com

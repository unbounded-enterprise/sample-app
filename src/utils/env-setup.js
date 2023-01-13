'use strict';
const fs = require('fs');
const crypto = require('crypto');

fs.readFile('.env-template', function(err, buf) {
    const data = buf.toString();
    const writeData = 
`${data}
NEXTAUTH_SECRET="${crypto.randomBytes(256).toString('base64')}"
ENCRYPTION_SECRET="${crypto.randomBytes(256).toString('base64')}"`;

    fs.writeFile('.env', writeData, (err) => {
        if (err) console.log(err);
        console.log("Successfully Written to File.");
    })
});

'use strict';

const fs = require('fs');
const readline = require('readline');
const google = require('googleapis');
const googleAuth = require('google-auth-wrapper');
const googleDrive = google.drive('v3');
const GDriveWrapper = require('google-drive-wrapper');

const key = require('../SEED01-service1.json');
const scopes = [
    'https://www.googleapis.com/auth/drive',
    //'https://www.googleapis.com/auth/drive.file',
    //'https://www.googleapis.com/auth/drive.metadata.readonly'
];
const jwtClient = new google.auth.JWT(key.client_email, null, key.private_key, scopes, null);

function listFiles(callback) {
    jwtClient.authorize((err, tokens) => {
        if (err) {
            console.log(err);
            return callback(err);
        }
        // Make an authorized request to list Drive files.
        googleDrive.files.list({ auth: jwtClient }, (err2, resp) => {
            // handle err and response
            if (err2) {
                console.log(err2);
                return callback(err2);
            }
            for (const file of resp.files) {
                const filename = file.name;
                if (filename.indexOf('Beacon Map') !== 0) continue;
                return callback(null, file);
            }
            return callback(null);
        });
    });
}

function downloadFile(fileId, mimeType, dest_filename, callback) {
    const dest = fs.createWriteStream(dest_filename);
    googleDrive.files.export({ auth: jwtClient, fileId, mimeType })
        .on('end', function() {
            console.log('Done');
            return callback(null);
        })
        .on('error', function(err) {
            console.log('Error during download', err);
            return callback(err);
        })
        .pipe(dest);
}

//  List the files.
//  Look for "Beacon Map..."
//  Download as SVG.
listFiles((err, file) => {
    if (err) {
        console.log(err);
        process.exit(1);
    }
    const fileId = file.id;
    const mimeType = 'image/svg+xml';
    const dest_filename = 'DownloadedBeaconMap.svg';
    downloadFile(fileId, mimeType, dest_filename, err2 => {
        if (err2) {
            console.log(err2);
            process.exit(2);
        }
        console.log('Done');
        process.exit(0);
    });
});

/*
function authorize(callback) {
    googleAuth.authorize('../', 'SEED01-beaconmap1',
        ['https://www.googleapis.com/auth/drive'],
        (url, provideCode) => {
            console.log(`Please visit this url, authorize the app and return the code provided\n\n${url}`);

            //provideCode(`4/usyGbYvpbVi6C-I6TQHFgIBDCib1rT4TXtAOWRIIUnc`, ()=>{}); ////

            var read = readline.createInterface({
                input: process.stdin,
                output: process.stdout
            });
            read.question('What was the code:?', code => {
                read.close();
                provideCode(code, err => {
                    if (err !== undefined) console.log('err:' + err);
                    return callback(err);
                });
            });
        });
}

function execute(callback) {
    googleAuth.execute('../', 'SEED01-beaconmap1', (auth, google) => {
    });
}
*/

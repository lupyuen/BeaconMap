'use strict';

const fs = require('fs');
const readline = require('readline');
const google = require('googleapis');
const googleAuth = require('google-auth-wrapper');
const googleDrive = google.drive('v3');
const GDriveWrapper = require('google-drive-wrapper');


//  Lists the names and IDs of up to 10 files.
//  @param {google.auth.OAuth2} auth An authorized OAuth2 client.
function listFiles(auth, google, callback) {
    googleDrive.files.list({
        auth: auth,
        pageSize: 10,
        fields: "nextPageToken, files(id, name)"
    }, function(err, response) {
        if (err) {
            console.log('The API returned an error: ' + err);
            return callback(err);
        }
        var files = response.files;
        if (files.length == 0) {
            console.log('No files found.');
        } else {
            console.log('Files:');
            for (var i = 0; i < files.length; i++) {
                var file = files[i];
                console.log('%s (%s)', file.name, file.id);
            }
        }
        return callback(null)
    });
}

const key = require('../SEED01-service1.json');
const scopes = ['https://www.googleapis.com/auth/drive.metadata.readonly'];
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
    googleDrive.files.export({fileId, mimeType})
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




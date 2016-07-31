'use strict';

const fs = require('fs');
const readline = require('readline');
const googleAuth = require('google-auth-wrapper');
const GDriveWrapper = require('google-drive-wrapper');

function authorize(callback) {
    googleAuth.authorize('../temp', 'SEED01-beaconmap1',
        ['https://www.googleapis.com/auth/drive'],
        (url, provideCode) => {
            console.log('Please vist this url, authorize the app and return the code provided', url);

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
    googleAuth.execute('../temp', 'SEED01-beaconmap1', (auth, google) => {
        var wrapper = new GDriveWrapper(auth, google);
        const gdriveDirectory = '';
        wrapper.listFiles(gdriveDirectory, err => {
            //wrapper.downloadNewFiles('backups', './download', err => {
            if (err) {
                console.log(err);
            }
            return callback(err);
        });
    });
}

/*
authorize(err => {
    if (err) process.exit(1);
    process.exit(0);
});
*/

execute(err2 => {
    if (err2) process.exit(2);
    process.exit(0);
});

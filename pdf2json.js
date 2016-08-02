/*
 node pdf2json.js -t -c -m -f "Beacon Slides.pdf"

Need to change BeaconMap\node_modules\pdf2json\lib\pdffield.js:

 cls.isFormElement = function(field) {
     let retVal = false;
     switch(field.subtype) {
         ////  Lup Yuen: Handle links.
         case 'Link':
             if (!global.AllLinks) global.AllLinks = [];
             global.AllLinks.push(field);
             console.log(JSON.stringify(field, null, 2));
             retVal = true;
             break;
         ////  Lup Yuen: End of changes.
         case 'Widget': retVal = cls.isWidgetSupported(field); break;


*/
'use strict';

global.AllLinks = [];

const P2JCMD = require('pdf2json/lib/p2jcmd');
const cmd = new P2JCMD();
cmd.complete = function(err) {
    console.log(JSON.stringify({AllLinks: global.AllLinks}, null, 2));
    let statusMsg = "\n%d input files\t%d success\t%d fail\t%d warning.";
    console.log(statusMsg, this.inputCount, this.successCount, this.failedCount, this.warningCount);

    process.nextTick( () => {
        //console.timeEnd(_PRO_TIMER);
        //let exitCode = (this.inputCount === this.successCount) ? 0 : 1;
        process.exit(0);
    });
};
cmd.start();

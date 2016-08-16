/*
 node pdf2json.js -t -c -m -f "Beacon Slides.pdf"

 Change BeaconMap/node_modules/pdf2json/lib/pdf.js line 402:

     cls.prototype.getRawTextContent = function() {
        let retVal = "";
        if (!this.needRawText)
            return retVal;

        _.each(this.rawTextContents, function(textContent, index) {
            let prevText = null;
            _.each(textContent.bidiTexts, function(textObj, idx) {
	            if (prevText) {
		            if (Math.abs(textObj.y - prevText.y) <= 9) {
			            prevText.str += textObj.str;
		            }
		            else {
			            retVal += (parseInt(prevText.x * 10) / 10) + ", " +
                            (parseInt(prevText.y * 10) / 10) + ": " +
                            prevText.str  + "\r\n"; ////
			            prevText = textObj;
		            }
	            }
	            else {
		            prevText = textObj;
	            }

            });
	        if (prevText) {
		        retVal += prevText.str;
	        }
            retVal += "\r\n----------------Page (" + index + ") Break----------------\r\n";
        });

        return retVal;
    };


Need to change BeaconMap\node_modules\pdf2json\lib\pdffield.js line 76:

Change from:

cls.isFormElement = function(field) {
    let retVal = false;
    switch(field.subtype) {
        case 'Widget': retVal = cls.isWidgetSupported(field); break;
        default:
            nodeUtil.p2jwarn("Unsupported: field.type of " + field.subtype);
            break;
    }
    return retVal;
};

to:

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
        default:
            nodeUtil.p2jwarn("Unsupported: field.type of " + field.subtype);
            break;
    }
    return retVal;
};


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

cmd.getRawTextContent = function() {
    debugger;////
    let retVal = "";
    if (!this.needRawText)
        return retVal;

    _.each(this.rawTextContents, function(textContent, index) {
        let prevText = null;
        _.each(textContent.bidiTexts, function(textObj, idx) {
            if (prevText) {
                if (Math.abs(textObj.y - prevText.y) <= 9) {
                    prevText.str += textObj.str;
                }
                else {
                    retVal += prevText.str  + "\r\n";
                    prevText = textObj;
                }
            }
            else {
                prevText = textObj;
            }

        });
        if (prevText) {
            retVal += prevText.str;
        }
        retVal += "\r\n----------------Page (" + index + ") Break----------------\r\n";
    });

    return retVal;
};

cmd.start();

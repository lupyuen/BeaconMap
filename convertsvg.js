'use strict';

const fs = require('fs');
const url = require('url');
const he = require('he');

const svgBoundingBox = require('svg-path-bounding-box');
function processJSON(json, bounds_by_url) {
    /*  Look for all name="a"
     {
     "name": "a",
     "attrs": {
         "xlinkHref": "https://www.google.com/url?q=http://bootha&amp;sa=D&amp;ust=1469929609836000&amp;usg=AFQjCNFz4YOg9Vl0C1P8SIEXdxZVp5xzXw",
         "target": "_blank",
         "rel": "noreferrer"
     },
     "childs": [
     {
         "name": "path",
         "attrs": {
         "fill": "transparent",
         "fillOpacity": "0",
         "d": "m349.30185 392.23096l133.79526 0l0 35.748047l-133.79526 0z",
         "fillRule": "nonzero"
     */
    if (!json.childs || json.childs.length === 0) return;
    let child_boxes = [];
    for (const child of json.childs) {
        if (child.childs) {
            processJSON(child, bounds_by_url);
            continue;
        }
        //  Compute bounding boxes only for name="a"
        if (!json.name || json.name !== 'a') continue;
        if (!child.attrs.d) continue;
        //  bounding_box contains minX, maxX, minY, maxY
        let bounding_box = svgBoundingBox(child.attrs.d);
        bounding_box = JSON.parse(JSON.stringify(bounding_box));
        bounding_box.url = json.attrs.xlinkHref;
        child_boxes.push(bounding_box);
    }
    //  Process child bound boxes.
    if (child_boxes.length === 0) return null;
    if (child_boxes > 1) throw new Error('more_than_one_svg_link');
    //  Decode the URL: https://www.google.com/url?q=http://bootha&amp;sa=D&amp;ust=1469929609836000&amp;usg=AFQjCNFz4YOg9Vl0C1P8SIEXdxZVp5xzXw
    //  should be http://bootha
    const url_str = child_boxes[0].url;
    if (!url_str) throw new Error('missing_svg_url');
    const decoded_url = he.decode(url_str);
    const parsed_url = url.parse(decoded_url, true);
    let normalised_url = decoded_url;
    if (parsed_url.host.indexOf('google') >= 0 &&
        parsed_url.query && parsed_url.query.q)
        normalised_url = parsed_url.query.q;

    //  Get the bounds for the URL and compare.
    const bounds = bounds_by_url[normalised_url];
    //  Compute the min-max of X and Y.
    if (!bounds) {
        bounds_by_url[normalised_url] = {
            url: normalised_url,
            minX: child_boxes[0].minX,
            minY: child_boxes[0].minY,
            maxX: child_boxes[0].maxX,
            maxY: child_boxes[0].maxY,
        };
        bounds_by_url[`all|${normalised_url}`] = [child_boxes[0]];
    }
    else {
        if (child_boxes[0].minX < bounds.minX) bounds.minX = child_boxes[0].minX;
        if (child_boxes[0].minY < bounds.minY) bounds.minY = child_boxes[0].minY;
        if (child_boxes[0].maxX > bounds.maxX) bounds.maxX = child_boxes[0].maxX;
        if (child_boxes[0].maxY > bounds.maxY) bounds.maxY = child_boxes[0].maxY;
        bounds_by_url[`all|${normalised_url}`].push(child_boxes[0]);
    }
    return child_boxes
}

const basename = 'Sample Map';
//const basename = 'Multiple Markers';
const svg = fs.readFileSync(`${__dirname}/${basename}.svg`);

const svgson = require('svgson');
svgson(svg, {
    //svgo: true,
    //title: 'myFile',
    //pathsKey: 'myPaths',
    //customAttrs: {
        //foo: true
    //}
}, json => {
    //console.log(result);
    fs.writeFileSync(`${basename}.json`, JSON.stringify(json, null, 2));
    let bounds_by_url = {};
    processJSON(json, bounds_by_url);
    //  Expected:
    //  A = 350, 413
    //  B = 452, 167
    //  C = 780, 215
    //  Actual:
    //  A = minX: 334, maxX: 468, minY: 394, maxY: 430
    //  B = minX: 445, maxX: 518, minY: 158, maxY: 173
    //  C = minX: 774, maxX: 846, minY: 207, maxY: 222
    const adjustX = (350 + 452 + 780 - 334 - 445 - 774) / 3;
    const adjustY = (413 + 167 + 215 - 394 - 158 - 207) / 3;
    //  Process each marker by URL and location.
    for (const url_str in bounds_by_url) {
        //  Ignore the "all|https://..."
        if (url_str.indexOf('http') !== 0) continue;
        const bounds = bounds_by_url[url_str];
        const markerX = bounds.minX + adjustX;
        const markerY = bounds.minY + adjustY;
        //  TODO: Process marker.
        console.log({url_str, markerX, markerY});
    }
    console.log('JSON file written');
    process.exit(0);
});

// From svg String
//const SVG = '<svg width="100" height="100"><circle r="15" stroke-linecap="round" /></svg>';
//svgson(SVG, {}, result => console.log(result));

////////////////////////////////////////////////////////////////

//  Insert
//  var window = require('node-window'); ////
//  at top of node_modules\snapsvg\dist\snap.svg.js
/*
const Snap = require('snapsvg');
const fragment = Snap.parse(svg);
const all = fragment.selectAll();
*/

//////////////////////////////////////////////////////////////////////

/*
const SVG = require('svg.js');
const draw = SVG('drawing');

const store = draw.svg(rawSvg);
const roots = store.roots(); //-> returns an array with root nodes
*/

//store.roots(function() {
    //console.log(this.type)
//});

//store.get('polygon1238').fill('#f06');

//////////////////////////////////////////////////////////

/*
let Svg = require('svgutils').Svg;
let fs = require('fs')

Svg.fromSvgDocument(__dirname + '/Sample Map.svg', function(err, svg){
    if(err){
        throw new Error('SVG file not found or invalid');
    }

    var json = svg.toJSON();
    fs.writeFileSync('Sample Map.json', JSON.stringify(json, null, 2));
    console.log('JSON file written')
});
*/

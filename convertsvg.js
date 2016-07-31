'use strict';

const fs = require('fs');
const svg = fs.readFileSync(__dirname + '/Sample Map.svg');

const svgBoundingBox = require('svg-path-bounding-box');
function processJSON(json) {
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
    let child_bounding_boxes = [];
    for (const child of json.childs) {
        if (child.childs) {
            processJSON(child);
            continue;
        }
        //  Compute bounding boxes only for name="a"
        if (!json.name || json.name !== 'a') continue;
        if (!child.attrs.d) continue;
        //  bounding_box contains minX, maxX, minY, maxY
        let bounding_box = svgBoundingBox(child.attrs.d);
        bounding_box = JSON.parse(JSON.stringify(bounding_box));
        bounding_box.url = json.attrs.xlinkHref;
        child_bounding_boxes.push(bounding_box);
    }
    //  Process child bound boxes.
    if (child_bounding_boxes.length === 0) return null;
    //  Compute the min-max of X and Y.
    const bounds = JSON.parse(JSON.stringify(child_bounding_boxes[0]));
    for (const bounding_box2 of child_bounding_boxes) {
        if (bounding_box2.minX < bounds.minX) bounds.minX = bounding_box2.minX;
        if (bounding_box2.minY < bounds.minY) bounds.minY = bounding_box2.minY;
        if (bounding_box2.maxX > bounds.maxX) bounds.maxX = bounding_box2.maxX;
        if (bounding_box2.maxY > bounds.maxY) bounds.maxY = bounding_box2.maxY;
    }
    //  Pointer is located at minX and midY.
    const pointerX = bounds.minX;  // + ?
    const pointerY = bounds.minY;  // + ?
    //  TODO: Remember this URL and pointer location.
    return child_bounding_boxes
}

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
    fs.writeFileSync('Sample Map.json', JSON.stringify(json, null, 2));
    processJSON(json);
    console.log('JSON file written');
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

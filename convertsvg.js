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
        const bounding_box = svgBoundingBox(child.attrs.d);
        child_bounding_boxes.push(bounding_box);
    }
    //  TODO: Process child bound boxes.
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

'use strict';

const fs = require('fs');
const svg = fs.readFileSync(__dirname + '/Sample Map.svg');

const svgson = require('svgson');
svgson(svg, {
    //svgo: true,
    //title: 'myFile',
    //pathsKey: 'myPaths',
    //customAttrs: {
        //foo: true
    //}
}, (result) => {
    //console.log(result);
    fs.writeFileSync('Sample Map.json', JSON.stringify(result, null, 2));
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

node node_modules\pdf2json\pdf2json.js -t -c -m -f "Beacon Slides.pdf"

node node_modules\svgson\bin\svgson.js --pretty --input "Sample Map.svg"  --output "Sample Map.json"

::node node_modules\nano-svg2js\bin\svg-to-js.js --stringify "Sample Map.svg"

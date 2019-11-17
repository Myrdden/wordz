let minify = require('/usr/lib/node_modules/html-minifier-terser').minify;
let terser = require('/usr/lib/node_modules/terser');
let fs = require('fs');
let input = fs.readFileSync('./wordz.html', 'utf-8');
fs.writeFileSync('./minwordz.html', minify(input, {
  collapseBooleanAttributes: true,
  removeAttributeQuotes: true,
  removeComments: true,
  removeEmptyAttributes: true,
  minifyCSS: true,
  minifyJS: true,
  // minifyJS: (text, inline) => {console.log(terser.minify(text));},
  quoteCharacter: '\''
}));

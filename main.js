const https = require('https');
const http = require('http');
const fs = require('fs');
const url = require('url');

// Get the list of URLs from command-line arguments
const urls = process.argv.slice(2);

if (urls.length === 0) {
  console.error('Error: Missing URL(s)');
  process.exit(1);
}

urls.forEach((currentUrl) => {
  const parsedUrl = url.parse(currentUrl);
  const hostname = parsedUrl.hostname;
  const protocol = parsedUrl.protocol;

  let httpModule = https;

  if (protocol === 'http:') {
    httpModule = http;
  }

  httpModule.get(currentUrl, (response) => {
    let data = '';

    response.on('data', (chunk) => {
      data += chunk;
    });

    response.on('end', () => {
      fs.writeFileSync(`${hostname}.txt`, data);
    });
  }).on('error', (err) => {
    console.error(`Error fetching data from ${currentUrl}: ${err.message}`);
  });
});

const http = require('http');

const data = JSON.stringify({
  projectCost: 120000,
  marginCapital: 15000,
  business: { isNewBusiness: true },
  applicant: { age: 30 }
});

const options = {
  hostname: 'localhost',
  port: 3001,
  path: '/api/schemes/evaluate',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

const req = http.request(options, res => {
  let body = '';
  res.on('data', d => body += d);
  res.on('end', () => console.log(JSON.stringify(JSON.parse(body), null, 2)));
});

req.on('error', error => console.error(error));
req.write(data);
req.end();

const http = require('http');

const options = {
  hostname: 'localhost',
  port: 5500,
  path: '/api/tours', // Use a valid endpoint
  method: 'GET'
};

let successCount = 0;
let failCount = 0;
let rateLimitedCount = 0;

const totalRequests = 110;

function makeRequest(index) {
  const req = http.request(options, (res) => {
    if (res.statusCode === 200) {
      successCount++;
    } else if (res.statusCode === 429) {
      rateLimitedCount++;
    } else {
        failCount++;
    }

    if (successCount + failCount + rateLimitedCount === totalRequests) {
      console.log('Test completed.');
      console.log(`Successful requests: ${successCount}`);
      console.log(`Rate limited requests: ${rateLimitedCount}`);
      console.log(`Other failures: ${failCount}`);
      
      if (rateLimitedCount > 0) {
          console.log('VERIFICATION PASSED: Rate limiting is active.');
      } else {
          console.log('VERIFICATION FAILED: No requests were rate limited.');
      }
    }
  });

  req.on('error', (e) => {
    console.error(`problem with request: ${e.message}`);
    failCount++;
  });

  req.end();
}

console.log(`Starting ${totalRequests} requests...`);
for (let i = 0; i < totalRequests; i++) {
  makeRequest(i);
}

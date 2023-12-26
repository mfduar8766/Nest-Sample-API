// eslint-disable-next-line @typescript-eslint/no-var-requires
const http = require('http');

const request = http.get(
  'http://localhost:3001/api/v1/status/health',
  (res) => {
    console.log(`Received response of: ${res.statusCode}`);
    if (res.statusCode === 200) {
      process.exit(0);
    } else {
      process.exit(1);
    }
  },
);

request.on('error', function (err) {
  console.error('Error getting response form app-users:', err);
  process.exit(1);
});
request.end();

// eslint-disable-next-line @typescript-eslint/no-var-requires
const http = require('http');

const args = process.argv.slice(2, process.argv.length);

if (!args.length) {
  console.error(
    'Expecting args to be passed to node CMD exiting with exit code 1',
  );
  process.exit(1);
}

const apps = {
  'app-users': 'http://localhost:3001/api/v1/status/health',
};
const appName = args[0];

console.log(`Sending GET request to: ${apps[appName]}...`);

const request = http.get(apps[appName], (res) => {
  console.log(`Received response of: ${res.statusCode}`);
  if (res.statusCode === 200) {
    process.exit(0);
  } else {
    process.exit(1);
  }
});

request.on('error', function (err) {
  console.error(`Error getting response form ${appName}:`, err);
  process.exit(1);
});

request.end();

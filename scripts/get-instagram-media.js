const axios = require('axios');
const yargs = require('yargs/yargs');

const ITEM_COUNT = 50; // max == 50

// main function
async function main() {
  const argv = yargs(process.argv.slice(2))
    .option('username', {
      alias: 'u',
      description: 'Instagram account username',
    })
    .demandOption(['username'])
    .help()
    .parse();

  try {
    const userInfo = await fetchInstagramUserInfo(argv.username);

    const userId = userInfo.response.body.data.user.id;
    const mediaItems = await fetchInstagramMedia(parseInt(userId));
    console.log(JSON.stringify(mediaItems, null, 2));
  } catch (error) {
    console.error(JSON.stringify(error, null, 2));
  }
}

// other functions

function env(key) {
  return process.env[key] || '';
}

async function rapidApiRequest(path, data = {}) {
  const rapidApiKey = env('RAPID_API_INSTAGRAM_KEY');
  const rapidApiHost = env('RAPID_API_INSTAGRAM_HOST');

  const options = {
    method: 'POST',
    url: `https://${rapidApiHost}${path}`,
    headers: {
      'Content-Type': 'application/json',
      'X-RapidAPI-Key': rapidApiKey,
      'X-RapidAPI-Host': rapidApiHost,
    },
    data,
  };

  const response = await axios.request(options);
  return response.data;
}

async function fetchInstagramUserInfo(username) {
  const data = { username };

  return rapidApiRequest('/instagram/user/get_info', data);
}

async function fetchInstagramMedia(userId, maxId = null) {
  const data = {
    id: userId,
    count: ITEM_COUNT,
    max_ix: maxId,
  };

  return rapidApiRequest('/instagram/user/get_media', data)
}

// run
main()

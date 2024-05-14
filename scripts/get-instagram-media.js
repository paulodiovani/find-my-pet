const R = require('ramda');
const axios = require('axios');
const yargs = require('yargs/yargs');

const ITEM_COUNT = 50; // max == 50

// main function
function main() {
  const argv = yargs(process.argv.slice(2))
    .option('username', {
      alias: 'u',
      description: 'Instagram account username',
    })
    .demandOption(['username'])
    .help()
    .parse();

  pipeline(argv.username);
}

// other functions

const toJson = R.curry(JSON.stringify)(R.__, null, 2);

const pipeline = R.pipe(
  fetchInstagramUserInfo,
  R.andThen(R.path(['response', 'body', 'data', 'user', 'id'])),
  R.andThen(parseInt),
  R.andThen(fetchInstagramMedia),
  R.andThen(R.path(['response', 'body', 'items'])),
  R.andThen(R.map(formatMedia)),
  R.andThen(toJson),
  R.andThen(console.log),
  R.otherwise(console.error), // catch
);

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

function formatMedia(item) {
  return {
    caption: item.caption?.text,
    code: item.code,
    fbid: item.fbid,
    id: item.id,
    image_url: item.image_versions2.candidates[0]?.url,
    media_type: item.media_type,
    permalink: `http://www.instagram.com/p/${item.code}`,
    taken_at: item.taken_at,
  };
}

// run
main()

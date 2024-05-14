const axios = require('axios');

const ITEM_COUNT = 50; // max == 50

// main function
async function main() {
  const userId = 66194687083;

  try {
    const mediaItems = await fetchInstagramMedia(userId);
    // console.log(response.data);
    console.log(JSON.stringify(mediaItems, null, 2));
  } catch (error) {
    // console.error(error);
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

  debugger
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

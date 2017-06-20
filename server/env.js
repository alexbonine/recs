

const baseUrl = () => {
  if (process.env.NODE_ENV === 'production') {
    return 'https://gentle-escarpment-64197.herokuapp.com';
  } else {
    return 'https://localhost:5000';
  }
};

const spotifyCredentials = {
  redirectUri: `${baseUrl()}/callback`,
  clientId: '9d75915b77b247a495743f224d158815',
  clientSecret: 'a708620550634edc8103dda16b884ee3',
};

module.exports = {
  baseUrl,
  spotifyCredentials,
};

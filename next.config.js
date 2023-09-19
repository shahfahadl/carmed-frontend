module.exports = {
  publicRuntimeConfig: {
    staticFolder: '/public',
    apiPath: process.env.API_PATH,
    googlePlacesAPI: process.env.API_GOOGLE,
  },
  trailingSlash: true,
  images:
  {
    loader:'imgix',
    path:'/',
  }
}

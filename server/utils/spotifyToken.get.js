export async function spotifyToken() {
    const storage = useStorage('cache:spotify');
  const config = useRuntimeConfig()

  const cached = await storage.getItem('access_token');

  if (cached && cached.expires_at > Date.now()) {
    return cached.accessToken;
  }

  const tokenResponse = await $fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      client_id: config.SPOTIFY_ID,
      client_secret: config.SPOTIFY_KEY
    })
  })

  const accessToken = tokenResponse.access_token
  const expires_in = tokenResponse.expires_in * 1000;

  await storage.setItem('access_token', {
    accessToken,
    expires_at: Date.now()+ expires_in - 5000
  });
  return accessToken

}
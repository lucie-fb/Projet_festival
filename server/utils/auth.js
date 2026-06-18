import { createRemoteJWKSet, jwtVerify } from "jose";

const JWKS = createRemoteJWKSet(
  new URL('https://sun-and-sound-q7pe8b.eu1.zitadel.cloud/oauth/v2/keys')
)

export async function getUserId(event) {
  const token = getCookie(event, "id_token");
  if (!token) throw createError({ statusCode: 401, statusMessage: "Not authenticated" });

  const config = useRuntimeConfig()

  try {
    const {payload}= await jwtVerify(token, JWKS, {
        issuer: config.public.VITE_ZITADEL_ISSUER,
      audience: config.public.VITE_ZITADEL_CLIENT_ID
    })
    return payload.sub
  } catch (error) {
    console.error('JWT invalid:', error)
    return null
  }
}
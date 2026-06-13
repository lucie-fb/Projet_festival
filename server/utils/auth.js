import { decodeJwt } from "jose";

export function getUserId(event) {
  const token = getCookie(event, "id_token");
  if (!token) throw createError({ statusCode: 401, statusMessage: "Not authenticated" });

  const decoded = decodeJwt(token);
  return decoded.sub;
}
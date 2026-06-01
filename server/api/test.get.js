export default defineEventHandler(() => {
  return {
    POSTGRES_URL: process.env.POSTGRES_URL || null
  }
})

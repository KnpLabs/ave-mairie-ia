import { OramaClient } from '@oramacloud/client'

export const orama = new OramaClient({
    endpoint: process.env.ORAMA_ENDPOINT,
    api_key: process.env.ORAMA_API_KEY,
})


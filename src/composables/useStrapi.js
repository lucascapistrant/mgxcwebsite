const BASE_URL = import.meta.env.VITE_STRAPI_URL

export function useStrapi() {
    async function get(endpoint, retries = 3) {
        for (let i = 0; i < retries; i++) {
            try {
                const res = await fetch(`${BASE_URL}/api/${endpoint}`)
                const data = await res.json()
                return data
            } catch (err) {
                if (i === retries - 1) throw err
                await new Promise(r => setTimeout(r, 500))
            }
        }
    }

  return { get }
}

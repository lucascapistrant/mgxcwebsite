import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useStrapi } from '../composables/useStrapi.js'

export const useHeroStore = defineStore('hero', () => {
    const { get } = useStrapi()
    const images = ref([])

    async function fetchImages() {
        if (images.value.length > 0) return
        const data = await get('hero-images?populate=*')
        images.value = data.data
    }

    return { images, fetchImages }
})
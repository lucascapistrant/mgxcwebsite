// stores/postStore.js
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useStrapi } from '@/composables/useStrapi'
export const usePostStore = defineStore('posts', () => {
    const { get } = useStrapi()
    const posts = ref([])
    const currentPage = ref(1)
    const hasMore = ref(true)
    const loading = ref(false)
    const PAGE_SIZE = 10

    function formatDate(dateString) {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'long', day: 'numeric', year: 'numeric'
        })
    }

    async function fetchPosts() {
        if (!hasMore.value || loading.value) return
        loading.value = true

        const data = await get(
            `posts?populate=*&sort=createdAt:desc&pagination[page]=${currentPage.value}&pagination[pageSize]=${PAGE_SIZE}`
        )

        const newPosts = data.data.map(post => ({
            id: post.id,
            title: post.title,
            text: post.body,
            date: formatDate(post.createdAt),
            images: post.media ? post.media.map(img => img.url) : []
        }))

        posts.value = [...posts.value, ...newPosts]
        hasMore.value = currentPage.value < data.meta.pagination.pageCount
        currentPage.value++
        loading.value = false
    }

    return { posts, fetchPosts, hasMore, loading }
})
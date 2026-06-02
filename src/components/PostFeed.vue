<script setup>
import { ref, onMounted, computed} from 'vue';
import { usePostStore } from '@/stores/postStore';
import { storeToRefs } from 'pinia';
const postStore = usePostStore()
const { posts, fetchPosts, hasMore, loading } = storeToRefs(postStore)
const lightBoxImage = ref();
const touchStartX = ref({})
const imageIndexes = ref({})

function getImageIndex(post) {
    if (imageIndexes.value[post.id] === undefined) imageIndexes.value[post.id] = 0
    return imageIndexes.value[post.id]
}

function nextImage(post) {
    const current = getImageIndex(post)
    imageIndexes.value[post.id] = (current + 1) % post.images.length
}

function prevImage(post) {
    const current = getImageIndex(post)
    imageIndexes.value[post.id] = (current - 1 + post.images.length) % post.images.length
}

function showImage(img) {
    lightBoxImage.value = img
    console.log(lightBoxImage.value)
}

function onTouchStart(e, postId) {
    touchStartX.value[postId] = e.touches[0].clientX
}

function onTouchEnd(e, post) {
    const start = touchStartX.value[post.id];
    if (start === undefined) return;

    const touchEndX = e.changedTouches[0].clientX;
    const diff = start - touchEndX
    if (Math.abs(diff) < 50) return;
    if(diff > 0) {
        nextImage(post)
    } else {
        prevImage(post)
    }

}

onMounted(async () => {
    await postStore.fetchPosts()
})
</script>

<template>
<Transition name="lightbox">
    <div class="lightbox" v-if="lightBoxImage">
        <div class="overlay" @click="lightBoxImage = null"></div>
        <img :src="lightBoxImage" alt="">
    </div>
</Transition>
    <div class="feed">
        <h2 class="heading">Team Feed</h2>
        <div v-for="(post, i) in posts" class="post">
            <div class="post-header">
                <h3>{{ post.title }}</h3>
                <p class="post-date">{{ post.date }}</p>
            </div>
            <div class="images-section"
                @touchstart="onTouchStart($event, post.id)"
                @touchend="onTouchEnd($event, post)">
                <button class="img-arrow" v-if="post.images.length > 1" @click="prevImage(post)">&#10094;</button>
                <div class="post-images" v-if="post.images.length > 0">
                     <div class="images-container" :style="{ transform: `translateX(${-getImageIndex(post) * 100}%)` }">
                         <img v-for="(img, i) in post.images" :src="img" :key="i" class="post-img" @click="showImage(img)">
                     </div>
                </div>
                <button class="img-arrow" v-if="post.images.length > 1" @click="nextImage(post)">&#10095;</button>
            </div>
            <div class="post-body">
                <p>{{ post.text }}</p>
            </div>
        </div>
        <button 
            class="load-more"
            :class="{loading: loading}"
            v-if="hasMore" 
            @click="postStore.fetchPosts()"
            :disabled="loading"
        >
            {{ loading ? 'Loading...' : 'Load More' }}
        </button>
    </div>
</template>

<style scoped>
.lightbox {
    position: fixed;
    top: 0;
    width: 100vw;
    height: 100vh;
    z-index: 11;
    display: flex;
    align-items: center;
    justify-content: center;
}

.heading {
    margin: 2rem 0 0 0;
    color: var(--color-secondary);
}

.overlay {
    position: absolute;
    top: 0;
    left: 0;
    background: black;
    opacity: .5;
    width: 100%;
    height: 100%;
}

.lightbox img {
    position: relative;
    max-width: 90vw;
    max-height: 90vh;
    object-fit: contain;
    z-index: 5;

    border-radius: 20px;
}

.feed {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
    gap: 20px 0;
}

.post {
    border: 2px solid var(--color-primary);
    border-radius: 10px;
    width: 100%;
    background-color: #1B1B1B;
    padding: 10px;
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.post-header {
    display: flex;
    flex-direction: column;
    gap: 5px;

    h2, h3 {
        margin: 0;
        font-family: var(--font-body);
        font-weight: normal;
    }

    p {
        margin: 0;
        opacity: .6;
        font-weight: normal;
        color: var(--color-secondary);
    }
}

.images-section {
    width: 100%;
    overflow: hidden;
    display: flex;
    flex-direction: row;
}

.post-images {
    width: 100%;
    height: 200px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    overflow: hidden;
}

.images-container {
    height: 100%;
    display: flex;
}

.post-img {
    width: 100%;
    height: 100%;
    flex-shrink: 0;
    object-fit: contain;
    transition: transform .3s ease-in-out;
}

.lightbox-enter-active,
.lightbox-leave-active {
    transition: opacity .3s ease;
}

.lightbox-enter-active img,
.lightbox-leave-active img {
    transition: transform .3s ease;
}

.lightbox-enter-from,
.lightbox-leave-to {
    opacity: 0;
}

.lightbox-enter-from img,
.lightbox-leave-to img {
    transform: scale(0.8);
}

.img-arrow {
    z-index: 2;
    outline: none;
    border: none;
    background: none;
    color: var(--color-primary);
    font-size: 4rem;
}

.post-body {
    p {
        line-height: 1.5;
        margin: 0;
    }
}

.load-more {
    background: none;
    outline: none;
    border: none;
    color: var(--color-secondary);
    padding: 10px;
    border-radius: 30px;
    border: 4px solid var(--color-secondary);
}

.loading {
    animation: pulse-fade 1.5s ease-in-out infinite;
}

@keyframes pulse-fade {
    0% {
        opacity: 1;
    }
    50% {
        opacity: .5;
    }
    100% {
        opacity: 1;
    }
}
</style>
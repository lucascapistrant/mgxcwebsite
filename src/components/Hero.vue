<script setup>
import { nextTick, onMounted, onUnmounted, ref, useTemplateRef, computed } from 'vue';
import fm from 'front-matter';

const imageContainer = useTemplateRef('imageContainer');
const hero = useTemplateRef('touchBox');
const index = ref(1);

const images = ref([]);

const imagesWithClone = computed(() => {
    if (images.value.length === 0) return [];
    return [images.value[images.value.length - 1], ...images.value, images.value[0]];
});

let imageSlideInterval;
let touchStartX;

function changeImageSlide(newIndex) {
    index.value = newIndex;
    imageContainer.value.style.transform = `translateX(${-index.value * 100}%)`;

    if (newIndex >= imagesWithClone.value.length - 1) {
        setTimeout(() => {
            imageContainer.value.style.transition = 'none';
            index.value = 1;
            imageContainer.value.style.transform = `translateX(-100%)`;
            setTimeout(() => {
                imageContainer.value.style.transition = 'transform .3s ease-in-out';
            }, 50);
        }, 300);
    }

    if (newIndex <= 0) {
        setTimeout(() => {
            imageContainer.value.style.transition = 'none';
            index.value = images.value.length;
            imageContainer.value.style.transform = `translateX(${-images.value.length * 100}%)`;
            setTimeout(() => {
                imageContainer.value.style.transition = 'transform .3s ease-in-out';
            }, 50);
        }, 300);
    }

    startAutoAdvance();
}

function startAutoAdvance() {
    clearInterval(imageSlideInterval);
    imageSlideInterval = setInterval(() => {
        changeImageSlide(index.value + 1);
    }, 7000);
}

onMounted(async () => {
    const fileModules = import.meta.glob('../content/hero-images/*.md', {
        query: '?raw',
        import: 'default',
        eager: true
    });

    const loadedImages = [];

    // 2. Loop through files and extract the "hero_image" string from frontmatter
    for (const path in fileModules) {
        const rawText = fileModules[path];
        const parsed = fm(rawText);
        
        if (parsed.attributes.hero_image) {
            loadedImages.push(parsed.attributes.hero_image);
        }
    }

    images.value = loadedImages;

    await nextTick();
    startAutoAdvance();

    hero.value.addEventListener("touchstart", (e) => {
        touchStartX = e.touches[0].clientX;
    });

    hero.value.addEventListener("touchend", (e) => {
        if (touchStartX === undefined) return;
        const touchEndX = e.changedTouches[0].clientX;
        const diff = touchStartX - touchEndX;
        if (Math.abs(diff) < 50) return;

        if (diff > 0) {
            changeImageSlide(index.value + 1);
        } else {
            changeImageSlide(index.value - 1);
        }
    });
});

onUnmounted(() => {
    clearInterval(imageSlideInterval);
});
</script>

<template>
<div class="hero">
    <div class="hero-touchbox" ref="touchBox"></div>
    <div class="hero-text">
        <h1 class="title">Maple Grove Cross Country</h1>
        <h2 class="tagline">BUILD IT. PROVE IT.</h2>
    </div>
    <div class="scroll-indicator">
        <button class="arrow-btn" @click="changeImageSlide(index - 1)">&#10094;</button>
        <button v-for="(img, i) in images" :key="i" class="dot-container" :class="{ active: i === index - 1 }" @click="changeImageSlide(i + 1)">
            <div class="dot"></div>
        </button>
        <button class="arrow-btn" @click="changeImageSlide(index + 1)">&#10095;</button>
    </div>
    <div class="img-overlay" ref="imgOverlay"></div>
    <div class="images-container" ref="imageContainer">
        <img v-for="(img, i) in imagesWithClone" :src="img" :key="i" class="img">
    </div>
</div>
</template>

<style scoped>
.hero {
    width: 100%;
    aspect-ratio: 3/2;
    overflow: hidden;
    position: relative;
}

.hero-touchbox {
    width: 100%;
    height: 100%;
    position: absolute;
    z-index: 3;
}

.title {
    display: none;
}

.tagline {
    text-align: center;
    color: var(--color-primary);
    font-size: 4.5rem;
    margin: 0;
    position: absolute;
    transform: translate(-50%, -50%);
    top: 50%;
    left: 50%;
    z-index: 2;
    width: 100%;
    max-width: 400px;
}

.images-container {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: row;
    transition: transform .3s ease-in-out;
    transform: translateX(-100%);
}
.img {
    width: 100%;
    height: 100%;
    flex-shrink: 0;
    object-fit: cover;
}

.img-overlay {
    position: absolute;
    width: 100%;
    height: 100%;
    background: var(--color-secondary);
    z-index: 1;
    opacity: 50%;
}

.scroll-indicator {
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    margin: 10px;
    display: flex;
    flex-direction: row;
    align-items: center;
    z-index: 4;
}

.dot-container {
    background: none;
    border: none;
    outline: none;
    opacity: 60%;
    padding: 8px;
}

.dot {
    width: 10px;
    height: 10px;
    background-color: var(--color-primary);
    border-radius: 50%;
    transform: scale(1);
    transition: transform .3s ease-in, opacity .2s ease-in;
}

.arrow-btn {
    display: none;
    background: none;
    border: none;
    color: var(--color-primary);
    cursor: pointer;
    font-size: 2rem;
    padding: 0 8px;
    transition: transform .1s ease-in;
}

.arrow-btn:hover {
    transform: scale(1.1);
}

.active {
    opacity: 100%;
    transform: scale(1.3);
}

@media screen and (min-width: 768px) {
    .hero {
        aspect-ratio: unset;
        height: 550px;
        container-type: inline-size;
    }

    .img-overlay {
        background: linear-gradient(
            to bottom,
            black,
            transparent,
            black
        );
    }

    .hero-text {
        width: 100%;
        position: absolute;
    }

    .title {
        color: var(--color-secondary);
        text-align: center;
        position: relative;
        display: block;
        z-index: 2;
        font-size: 5.36cqw;
        margin: 0 5cqw;
    }

    .tagline {
        position: relative;
        text-align: left;
        transform: translate(0);
        top: auto;
        left: auto;
        font-size: clamp(1rem, 5cqw, 5rem);
        margin: 0 5cqw;
        max-width: 300px;
    }

    .arrow-btn {
        display: block;
    }
}

@media screen and (min-width: 1024px) {
    .hero {
        height: 750px;
    }

}
</style>
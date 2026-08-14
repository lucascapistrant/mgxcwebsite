
<script setup>
import { ref, computed, onMounted, nextTick, onUnmounted } from 'vue'
import fm from 'front-matter';
import IconInstagram from './icons/IconInstagram.vue';
import IconX from './icons/IconX.vue';
import IconGithub from './icons/IconGithub.vue';
import links from '@/content/site-links.json'

const shouldScroll = ref(false)
const containerRef = ref(null)
const observer = ref(null);
const scrollSpeed = 25; // px per second
const scrollDuration = ref(0);

const sponsors = ref([])
const linksData = ref(links)

const computedLinks = computed(() => {
    return {
        instagram_link: linksData.value.instagram_link || '#',
        github_link: linksData.value.github_link || '#',
        x_link: linksData.value.x_link || '#',
        safeteam_link: linksData.value.safeteam_link || '#',
        track_and_field_link: linksData.value.track_and_field_link || '#',
        nordic_link: linksData.value.nordic_link || '#'
    }
})

onMounted(async() => {
    const fileModules = import.meta.glob('../content/sponsors/*.md', {
        query: '?raw',
        import: 'default',
        eager: true
    });

    const loadedSponsors = [];

    for (const path in fileModules) {
        const rawText = fileModules[path];
        const parsed = fm(rawText);
        
        if (parsed.attributes.sponsor_logo) {
            loadedSponsors.push({
                logo: parsed.attributes.sponsor_logo,
                companyName: parsed.attributes.sponsor_name,
                companyLink: parsed.attributes.company_link || '#' 
            });
        }
    }

    sponsors.value = loadedSponsors;

    await nextTick()
    
    // Safety check in case elements haven't rendered yet
    calculateShouldScroll();

    observer.value = new ResizeObserver(() => {
        calculateShouldScroll();
    })
    
    if (containerRef.value) {
        observer.value.observe(containerRef.value)
    }
})

function calculateShouldScroll() {
    const trackElement = document.getElementById("sponsor-track-original")
    const containerElement = document.getElementById("sponsors-container")
    
    if (trackElement && containerElement) {
        const trackWidth = trackElement.getBoundingClientRect().width
        const containerWidth = containerElement.getBoundingClientRect().width
        shouldScroll.value = trackWidth > containerWidth
    }

    if (shouldScroll.value) {
        scrollDuration.value = trackElement.getBoundingClientRect().width / scrollSpeed
    }
}

onUnmounted(() => {
    observer.value?.disconnect();
})
</script>

<template>
<div class="socials-container mobile">
    <div class="socials-section mobile-only">
        <a :href="computedLinks.safeteam_link" target="_blank"><img src="../assets/hello-team-logo.webp" alt="Safe Team Website Link" class="icon"></a>
        <a :href="computedLinks.x_link" target="_blank"><IconX class="icon"/></a>
        <a :href="computedLinks.instagram_link" target="_blank"><IconInstagram class="icon"/></a>
        <a :href="computedLinks.github_link" target="_blank"><IconGithub class="icon"/></a>
    </div>
</div>
<footer>
    <div class="socials-section desktop-only">
        <a :href="computedLinks.safeteam_link" target="_blank"><img src="../assets/hello-team-logo.webp" alt="Safe Team Website Link" class="icon"></a>
        <a :href="computedLinks.x_link" target="_blank"><IconX class="icon"/></a>
        <a :href="computedLinks.instagram_link" target="_blank"><IconInstagram class="icon"/></a>
        <a :href="computedLinks.github_link" target="_blank"><IconGithub class="icon"/></a>
    </div>
    <div class="sponsors-section">
        <h2>SPONSORS</h2>
        <div id="sponsors-container" class="sponsors-container" ref="containerRef" :class="{ vignette: !shouldScroll }" >
            <div class="sponsors-track" :style="shouldScroll ? { animationDuration: scrollDuration + 's' } : {}" :class="{ scrolling: shouldScroll }">
                <div id="sponsor-track-original">
                    <div class="sponsor" v-for="(sponsor, i) in sponsors" :key="'a' + i">
                        <RouterLink to="/sponsors">
                            <img :src="sponsor.logo" class="sponsor_img" alt="Sponsor Logo" @load="calculateShouldScroll">
                        </RouterLink>
                    </div>
                </div>
                
                <template v-if="shouldScroll">
                    <div class="sponsor" v-for="(sponsor, i) in sponsors" :key="'b' + i">
                        <RouterLink to="/sponsors">
                            <img :src="sponsor.logo" class="sponsor_img" alt="Sponsor Logo">
                        </RouterLink>
                    </div>
                </template>

            </div>
        </div>
    </div>
    <div class="weblinks-section">
        <a :href="links.track_and_field_link" target="_blank">Maple Grove Track and Field</a>
        <a :href="links.nordic_link" target="_blank">Maple Grove Nordic Ski</a>
        <a href="/admin/index.html" target="_blank">Admin Panel</a>
        <a href="/about" target="_blank">About this Site</a>
    </div>
</footer>
</template>

<style scoped>

footer {
    background: var(--color-primary);
    padding: 10px;
    padding-bottom: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
}

.socials-section {
    display: none;
}

.weblinks-section {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    text-align: center;
    a {
          text-decoration: none;
          color: var(--color-secondary);
    }
}

.socials-container {
    width: 100%;
    display: flex;
    justify-content: center;
    padding: 10px 0 20px 0;
    background: var(--color-background);
}

.mobile-only {
    width: 70%;
    max-width: 250px;
    background: var(--color-primary);
    padding: 10px;
    border-radius: 30px;
    border: 2px solid var(--color-secondary);
    display: flex;
    flex-direction: row;
    gap: 1rem;
    a {
        display: flex;
        justify-content: center;
        flex: 1;
    }

    .icon {
        width: 30px;
        fill: var(--color-secondary);
    }
}

.sponsors-section {
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow: hidden;
    width: 90%;

    h2 {
        font-size: 2rem;
        font-family: var(--font-body);
        font-weight: normal;
        color: var(--color-secondary);
        text-align: center;
        margin: 0;
        display: flex;
        align-items: center;
        gap: 1rem;
    }

    h2::before, h2::after {
        content: "";
        width: 30px;
        height: 2px;
        border-radius: 5px;
        background-color: currentColor;

    }
}

.sponsors-container {
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    mask-image: linear-gradient(
        to right,
        transparent,
        black 15%,
        black 85%,
        transparent
    );
    -webkit-mask-image: linear-gradient(
        to right,
        transparent,
        black 15%,
        black 85%,
        transparent
    );
}

.vignette {
    mask-image: none;
    -webkit-mask-image: none;
}

.sponsors-track {
    display: flex;
    flex-direction: row;
}

.scrolling {
    animation-name: scroll-sponsors;
    animation-timing-function: linear;
    animation-iteration-count: infinite;
}

.sponsors-track:hover {
    animation-play-state: paused;
}

#sponsor-track-original {
    display: flex;
    flex-direction: row;
}

@keyframes scroll-sponsors {
    0%   { transform: translateX(0); }
    100% { transform: translateX(-50%); } /* -50% because content is doubled */
}

.sponsor {

    a {
        display: flex;
        padding: 10px;
    }
}

.sponsor_img {
    height: 30px;
}

@media screen and (min-width: 768px) {
    footer {
        padding: 10px 20px;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        gap: 0;
    }

    .sponsors-section {
        width: 100%;
        max-width: 400px;
        height: 100%;
        flex: unset;

        h2 {
            font-size: 1.5rem;
        }

        h2::before, h2::after {
            width: 20px;
        }
    }

    .sponsors-container {
        width: fit-content;
        max-width: 400px;
    }

    .socials-container {
        display: none;
    }

    .socials-section {
        display: flex;
        flex-direction: row;
        gap: 1rem;
        a {
            display: flex;
            flex: 1;
        }
    }

    .sponsor_img {
        height: 50px;
    }

    .icon {
        width: 30px;
        fill: var(--color-secondary);
    }

    .weblinks-section {
        gap: .5rem;
        align-items: end;
        a {
            width: fit-content;
            position: relative;
        }
        a::after { 
            content: ''; 
            position: absolute; 
            bottom: 0px; 
            left: 50%; 
            transform: translateX(-50%); 
            width: 0; 
            height: 1px; 
            background-color: currentColor; 
            transition: width 0.3s ease; 
        } 
        a:hover::after { 
            width: 98%; 
        } 
    }
}

</style>
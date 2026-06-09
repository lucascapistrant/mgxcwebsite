<script setup>
import { ref, onMounted, nextTick, onUnmounted } from 'vue'
import fm from 'front-matter';
import IconInstagram from './icons/IconInstagram.vue';
import IconX from './icons/IconX.vue';
import IconGithub from './icons/IconGithub.vue';

const shouldScroll = ref(false)
const containerRef = ref(null)
const observer = ref(null);
const scrollSpeed = 50; // px per second
const scrollDuration = ref(0);

const sponsors = ref([])

onMounted(async() => {
    const fileModules = import.meta.glob('../content/sponsor-logos/*.md', {
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
                companyLink: parsed.attributes.company_link || '#' 
            });
        }
    }

    sponsors.value = loadedSponsors;
    console.log('Processed Sponsors Data:', sponsors.value);

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
<div class="socials-container">
    <div class="socials-section mobile-only">
        <a href="https://forms.zohopublic.com/safeteam1/form/MapleGroveCrossCountrySafeTeamRegistration/formperma/_lLgp0nr7KA2K8Om4Fj4LIGsa1UsUGO1VyztfR7A-GQ" target="_blank"><img src="../assets/hello-team-logo.webp" alt="Safe Team Website Link" class="icon"></a>
        <a href="https://x.com/mgcrimsonxc" target="_blank"><IconX class="icon"/></a>
        <a href="https://www.instagram.com/mg.crosscountry/" target="_blank"><IconInstagram class="icon"/></a>
        <a href="https://github.com/lucascapistrant/mgxcwebsite" target="_blank"><IconGithub class="icon"/></a>
    </div>
</div>
<footer>
    <div class="socials-section desktop-only">
        <a href="https://forms.zohopublic.com/safeteam1/form/MapleGroveCrossCountrySafeTeamRegistration/formperma/_lLgp0nr7KA2K8Om4Fj4LIGsa1UsUGO1VyztfR7A-GQ" target="_blank"><img src="../assets/hello-team-logo.webp" alt="Safe Team Website Link" class="icon"></a>
        <a href="https://x.com/mgcrimsonxc" target="_blank"><IconX class="icon"/></a>
        <a href="https://www.instagram.com/mg.crosscountry/" target="_blank"><IconInstagram class="icon"/></a>
        <a href="https://github.com/lucascapistrant/mgxcwebsite" target="_blank"><IconGithub class="icon"/></a>
    </div>
    <div class="sponsors-section">
        <h2>SPONSORS</h2>
        <div id="sponsors-container" class="sponsors-container" ref="containerRef" :class="{ vignette: !shouldScroll }" >
            <div class="sponsors-track" :style="shouldScroll ? { animationDuration: scrollDuration + 's' } : {}" :class="{ scrolling: shouldScroll }">
                <div id="sponsor-track-original">
                    <div class="sponsor" v-for="(sponsor, i) in sponsors" :key="'a' + i">
                        <a :href="sponsor.companyLink" target="_blank">
                            <img :src="sponsor.logo" class="sponsor_img" alt="Sponsor Logo" @load="calculateShouldScroll">
                        </a>
                    </div>
                </div>
                
                <template v-if="shouldScroll">
                    <div class="sponsor" v-for="(sponsor, i) in sponsors" :key="'b' + i">
                        <a :href="sponsor.companyLink" target="_blank">
                            <img :src="sponsor.logo" class="sponsor_img" alt="Sponsor Logo">
                        </a>
                    </div>
                </template>

            </div>
        </div>
    </div>
    <div class="weblinks-section">
        <a href="https://maplegrovetrack.github.io/" target="_blank">Maple Grove Track and Field</a>
        <a href="#" target="_blank">Maple Grove Nordic Ski</a>
    </div>
</footer>
</template>

<style scoped>

footer {
    background: var(--color-primary);
    padding: 10px;
    height: 125px;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.socials-section, .weblinks-section {
    display: none;
}

.socials-container {
    width: 100%;
    display: flex;
    justify-content: center;
    padding: 10px;
}


.mobile-only {
    width: 70%;
    max-width: 250px;
    background: var(--color-object);
    padding: 10px;
    border-radius: 30px;
    border: 2px solid var(--color-primary);
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
    flex: 1;
    min-height: 0;
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
    flex: 1;
    min-height: 0;
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
    flex: 1;
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
    flex: 1;
    flex-direction: row;
}

@keyframes scroll-sponsors {
    0%   { transform: translateX(0); }
    100% { transform: translateX(-50%); } /* -50% because content is doubled */
}

.sponsor {
    display: flex;
    min-height: 0;

    a {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 10px;
    }
}

.sponsor_img {
    height: 100%;
    width: auto;
}

@media screen and (min-width: 768px) {
    footer {
        height: 75px;
        padding: 5px 10px;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
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

    .icon {
        width: 30px;
        fill: var(--color-secondary);
    }

    .weblinks-section {
        display: flex;
        flex-direction: column;
        gap: .5rem;
        a {
              text-decoration: none;
              color: var(--color-secondary);
        }
    }
}

</style>
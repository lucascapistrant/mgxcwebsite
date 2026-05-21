<script setup>
import { ref, onMounted, nextTick, onUnmounted } from 'vue'
import { useStrapi } from '../composables/useStrapi.js'
import IconInstagram from './icons/IconInstagram.vue';
import IconX from './icons/IconX.vue';
import IconGithub from './icons/IconGithub.vue';
import LoadingWrapper from './LoadingWrapper.vue';
const { get } = useStrapi();
const sponsors = ref([])
const shouldScroll = ref(false)
const containerRef = ref(null)
const trackRef = ref(null)

const observer = ref(null);

onMounted(async() => {
    const data = await get('sponsors?populate=*');
    sponsors.value = data.data

    await nextTick()
    const images = document.querySelectorAll('#sponsor-track-original img')
    await Promise.all(
        [...images].map(img => img.complete ? Promise.resolve() :
            new Promise(resolve => {img.onload = resolve; img.onerror = resolve;}))
    )

    const trackElement = document.getElementById("sponsor-track-original")
    const containerElement = document.getElementById("sponsors-container")
    const trackWidth = trackElement.getBoundingClientRect().width
    const containerWidth = containerElement.getBoundingClientRect().width
    shouldScroll.value = trackWidth > containerWidth

    observer.value = new ResizeObserver(() => {
        const trackElement = document.getElementById("sponsor-track-original")
        const containerElement = document.getElementById("sponsors-container")
        const trackWidth = trackElement.getBoundingClientRect().width
        const containerWidth = containerElement.getBoundingClientRect().width
        shouldScroll.value = trackWidth > containerWidth
    })
    observer.value.observe(containerRef.value)
})

onUnmounted(() => {
    observer.value?.disconnect();
})

</script>

<template>
<footer>
    <div class="socials-section">
        <a href="https://forms.zohopublic.com/safeteam1/form/MapleGroveCrossCountrySafeTeamRegistration/formperma/_lLgp0nr7KA2K8Om4Fj4LIGsa1UsUGO1VyztfR7A-GQ" target="_blank"><img src="../assets/hello-team-logo.webp" alt="Safe Team Website Link" class="icon"></a>
        <a href="https://x.com/mgcrimsonxc" target="_blank"><IconX class="icon"/></a>
        <a href="https://www.instagram.com/mg.crosscountry/" target="_blank"><IconInstagram class="icon"/></a>
        <a href="https://github.com/lucascapistrant/mgxcwebsite" target="_blank"><IconGithub class="icon"/></a>
    </div>
    <div class="sponsors-section">
        <h2>SPONSORS</h2>
        <LoadingWrapper :loading="sponsors.length === 0">
            <div id="sponsors-container" class="sponsors-container" ref="containerRef" :class="{ vignette: !shouldScroll }" >
                <div class="sponsors-track" ref="trackRef" :class="{ scrolling: shouldScroll }">
                    <div id="sponsor-track-original">
                        <div class="sponsor" v-for="(sponsor, i) in sponsors" :key="'a' + i">
                            <a :href="sponsor.companyLink" target="_blank">
                                <img :src="sponsor.companyLogo.url" class="sponsor_img" alt="">
                            </a>
                        </div>
                    </div>
                    <div class="sponsor" v-for="(sponsor, i) in sponsors" :key="'b' + i" v-if="shouldScroll">
                        <a :href="sponsor.companyLink" target="_blank">
                            <img :src="sponsor.companyLogo.url" class="sponsor_img" alt="">
                        </a>
                    </div>
                </div>
            </div>
        </LoadingWrapper>
    </div>
    <div class="weblinks-section">
        <a href="https://maplegrovetrack.github.io/" target="_blank">Maple Grove Track and Field</a>
        <a href="#" target="_blank">Maple Grove Nordic Ski</a>
    </div>
    
    <!-- Dev fake database results for styling -->
     <!-- <div class="sponsors-section">
         <h2>SPONSORS</h2>
         <div class="sponsors-container" ref="containerRef">
            <div id="track" class="sponsors-track" ref="trackRef" :class="{scrolling: shouldScroll}">
                <div class="sponsor">
                    <a href="#" target="_blank">
                        <img src="../assets/mgxc_logo.svg" class="sponsor_img" alt="">
                    </a>
                </div>
                <div class="sponsor">
                    <a href="#" target="_blank">
                        <img src="../assets/mgxc_logo.svg" class="sponsor_img" alt="">
                    </a>
                </div>
                <div class="sponsor">
                    <a href="#" target="_blank">
                        <img src="../assets/mgxc_logo.svg" class="sponsor_img" alt="">
                    </a>
                </div>
                <div v-if="shouldScroll">
                    <div class="sponsor" >
                        <a href="#" target="_blank">
                            <img src="../assets/mgxc_logo.svg" class="sponsor_img" alt="">
                        </a>
                    </div>
                    <div class="sponsor">
                        <a href="#" target="_blank">
                            <img src="../assets/mgxc_logo.svg" class="sponsor_img" alt="">
                        </a>
                    </div>
                    <div class="sponsor">
                        <a href="#" target="_blank">
                            <img src="../assets/mgxc_logo.svg" class="sponsor_img" alt="">
                        </a>
                    </div>
                </div>
            </div>
         </div>
     </div> -->
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

.sponsors-section {
    display: flex;
    flex-direction: column;
    align-items: center;
    flex: 1;
    min-height: 0;
    overflow: hidden;
    width: 100%;
    max-width: 400px;

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
    animation: scroll-sponsors 15s linear infinite;
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
    background-color: red;
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
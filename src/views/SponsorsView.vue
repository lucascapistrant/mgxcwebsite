<script setup>
import { ref, onMounted, nextTick } from 'vue';
import fm from 'front-matter';

const sponsors = ref([])

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
})
</script>

<template>
    <h2 class="page-header">MGXC Sponsors</h2>
    <div v-if="sponsors.length === 0">
        <p class="section-description">No sponsors found. <a href="/admin/index.html">Update this page.</a></p>
    </div>
    <div class="sponsors-grid" v-else>
        <a :href="sponsor.companyLink" target="_blank" class="sponsor" v-for="(sponsor, i) in sponsors" :key="i">
            <div class="img">
                <img :src="sponsor.logo" class="sponsor_img" :alt="sponsor.companyName + ' Logo'">
            </div>
            <p class="sponsor_name">{{ sponsor.companyName }}</p>
        </a>
    </div>
</template>

<style scoped>

.no-sponsors {
    text-align: center;
    color: var(--color-text);
}

.sponsors-grid {
    display: grid;
    width: 100%;
    max-width: 1000px;
    margin: 0 auto;
    justify-items: center;
    grid-template-columns: 1fr;
    row-gap: 30px;
}

.sponsor {
    width: 100%;
    text-align: center;
    max-width: 200px;
    display: flex;
    flex-direction: column;
}

.sponsor-link-container {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 100%;
    text-decoration: none;

}

.img {
    flex: 1;
    display: flex;
    align-items: center;
}

.sponsor_img {
    width: 100%;
}

.sponsor_name {
    color: var(--color-secondary);
}

@media screen and (min-width: 500px) {
    .sponsors-grid {
        grid-template-columns: 1fr 1fr
    }
}

@media screen and (min-width: 768px) {
    .sponsors-grid {
        grid-template-columns: 1fr 1fr 1fr
    }
}

@media screen and (min-width: 1024px) {
    .sponsors-grid {
        grid-template-columns: 1fr 1fr 1fr 1fr
    }
}

</style>
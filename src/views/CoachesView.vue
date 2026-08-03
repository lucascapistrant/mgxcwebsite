<script setup>
import CoachProfile from '../components/CoachProfile.vue'
import { ref, onMounted, computed } from 'vue'
import fm from 'front-matter';

const coaches = ref([])

const headCoaches = computed(() => {
    return coaches.value.filter(coach => coach.type == 'Head Coach');
});

const assistantCoaches = computed(() => {
    return coaches.value.filter(coach => coach.type == 'Assistant Coach');
});

onMounted(async() => {
    const fileModules = import.meta.glob('../content/coaches/*.md', {
        query: '?raw',
        import: 'default',
        eager: true
    })

    const loadedCoaches = [];

    for (const path in fileModules) {
        const rawText = fileModules[path];
        const parsed = fm(rawText);
        
        if (parsed.attributes.coach_name) {
            loadedCoaches.push({
                name: parsed.attributes.coach_name,
                type: parsed.attributes.coach_type || 'Assistant Coach',
                photo: parsed.attributes.coach_photo || '',
                contactInfo: parsed.attributes.coach_contact_info || '',
                bio: parsed.attributes.coach_bio || ''
            });
        }
    }
    coaches.value = loadedCoaches;
});
</script>

<template>
    <section>
        <h2 class="page-header">Head Coaches</h2>
        <div v-if="headCoaches.length === 0">
            <p class="section-description">No head coaches found. <a href="/admin/index.html">Update this page.</a></p>
        </div>
        <div v-else class="coaches">
            <CoachProfile
                v-for="(coach, index) in headCoaches"
                :key="index"
                :name="coach.name"
                :type="coach.type"
                :photo="coach.photo"
                :contactInfo="coach.contactInfo"
                :bio="coach.bio"
                class="coach-profile"
            />
        </div>
    </section>
    <section>
        <h2 class="page-header">Assistant Coaches</h2>
        <div v-if="assistantCoaches.length === 0">
            <p class="section-description">No assistant coaches found. <a href="/admin/index.html">Update this page.</a></p>
        </div>
        <div class="coaches">
            <CoachProfile
                v-for="(coach, index) in assistantCoaches"
                :key="index"
                :name="coach.name"
                :type="coach.type"
                :photo="coach.photo"
                :contactInfo="coach.contactInfo"
                :bio="coach.bio"
                class="coach-profile"
            />
        </div>
    </section>
</template>

<style scoped>
.coaches {
    width: 100%;
    max-width: 1000px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: 1fr;
    gap: 30px;
    justify-items: center;
}

.coaches:last-child {
    margin-bottom: 30px;
}

@media screen and (min-width: 768px) {
    .coaches {
        grid-template-columns: 1fr 1fr;
    }

    .coach-profile:nth-child(odd):last-child {
        grid-column: span 2;
    }
}
</style>
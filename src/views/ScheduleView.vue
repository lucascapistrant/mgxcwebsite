<script setup>
import { ref, onMounted } from 'vue';
import fm from 'front-matter';

const scheduleItems = ref([]);

onMounted(async() => {
    const fileModules = import.meta.glob('../content/schedule/*.md', {
        query: '?raw',
        import: 'default',
        eager: true
    });

    const loadedItems = [];

    for (const path in fileModules) {
        const rawText = fileModules[path];
        const parsed = fm(rawText);
        
        if (parsed.attributes.event_name && parsed.attributes.event_date) {
            loadedItems.push({
                name: parsed.attributes.event_name,
                date: parsed.attributes.event_date|| '',
                location: parsed.attributes.event_location || '',
                description: parsed.attributes.event_description || ''
            });
        }
    }

    scheduleItems.value = loadedItems;
    console.log('Processed Schedule Data:', scheduleItems.value);
})
</script>

<template>
<h2 class="page-header">Team Schedule</h2>
<div class="schedule">
    <div v-for="(item, index) in scheduleItems" :key="index" class="schedule-item">
        <div class="schedule-header">
            <h3 class="schedule-title">{{ item.name }}</h3>
            <div class="schedule-details">
                <p class="schedule-date-time">{{ item.date }}</p>
                <p class="schedule-location" v-if="item.location">{{ item.location }}</p>
            </div>
        </div>
        <p class="schedule-description" v-if="item.description">{{ item.description }}</p>
    </div>
</div>
</template>

<style scoped>

.schedule {
    padding: 10px;
    display: flex;
    flex-direction: column;
    gap: 15px;
}

.schedule-item {
    padding: 0px 5px 15px 5px;
    border-bottom: 1px solid var(--color-secondary);
}

.schedule-item:last-child {
    border-bottom: none;
}

.schedule-details {
    padding-top: 5px;
    display: flex;
    flex-direction: column;
    gap: 5px;
}

.schedule-title {
    margin: 0;
    font-family: var(--font-body);
    font-weight: normal;
}

.schedule-date-time {
    margin: 0;
    color: var(--color-secondary);
}

.schedule-location {
    margin: 0;
    color: var(--color-secondary);
}

.schedule-description {
    padding-top: 10px;
    margin: 0;
    line-height: 1.5;
    opacity: 0.8;
}

@media screen and (min-width: 768px) {
    .schedule {
        max-width: 900px;
        margin: 0 auto;
    }

    .schedule-item {
        display: grid;
        grid-template-columns: 1fr 3fr;
        gap: 20px;
    }

    .schedule-title {
        font-size: 2rem;
    }

    .schedule-date-time, .schedule-location {
        font-size: 1.5rem;
    }

    .schedule-description {
        padding: 0;
        font-size: 1.5rem;
        align-self: center;
    }
}

@media screen and (min-width: 925px) {
    .schedule {
        background: var(--color-object);
        border-radius: 10px;
        border: 1px solid var(--color-secondary);
    }
}

</style>
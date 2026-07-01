<script setup>
import { ref, onMounted, computed } from 'vue';
import fm from 'front-matter';

const recordItems = ref([]);

const selectedGender = ref('Male');
const selectedType = ref('5k Race');

onMounted(async () => {
    const fileModules = import.meta.glob('../content/records/*.md', {
        query: '?raw',
        import: 'default',
        eager: true
    });

    const loadedItems = [];

    for (const path in fileModules) {
        const rawText = fileModules[path];
        const parsed = fm(rawText);
        
        if (parsed.attributes.athlete_name && parsed.attributes.race_time) {
            loadedItems.push({
                name: parsed.attributes.athlete_name,
                time: parsed.attributes.race_time,
                gender: parsed.attributes.record_gender,
                type: parsed.attributes.record_type
            });
        }
    }

    recordItems.value = loadedItems;
});

// Dynamic Computed Filter
const filteredRecords = computed(() => {
    return recordItems.value.filter(item => {
        return item.gender === selectedGender.value && item.type === selectedType.value;
    });
});
</script>

<template>
  <h2>Team Records</h2>

  <div class="filters">
    <div class="filter-group">
        <button 
        :class="{ active: selectedGender === 'Male' }" 
        @click="selectedGender = 'Male'"
        >Male</button>
        <button 
        :class="{ active: selectedGender === 'Female' }" 
        @click="selectedGender = 'Female'"
        >Female</button>
        <div class="background"></div>
    </div>

    <div class="filter-group">
        <button 
        :class="{ active: selectedType === '5k Race' }" 
        @click="selectedType = '5k Race'"
        >5k</button>
        <button 
        :class="{ active: selectedType === '2 Mile Race' }" 
        @click="selectedType = '2 Mile Race'"
        >2 Mile</button>
        <div class="background"></div>
    </div>
  </div>

  <table class="records">
    <tr v-if="filteredRecords.length === 0">
      <td colspan="2" class="no-records">
        <p>No records found for this selection.</p>
      </td>
    </tr>
    <tr v-for="(item, index) in filteredRecords" :key="index" class="record-item">
      <td class="athlete-name">{{ item.name }}</td>
      <td class="race-time">{{ item.time }}</td>
    </tr>
  </table>
</template>

<style scoped>
h2 {
    text-align: center;
    color: var(--color-secondary);
}

.filters {
    display: flex;
    flex-direction: column;
    gap: 10px;
    width: 90%;
    max-width: 400px;
    margin: 0 auto;
    margin-bottom: 20px;
}

.filter-group {
    display: flex;
    border-radius: 10px;
    background: var(--color-object);
}

.filter-group button {
    flex: 1;
    background: transparent;
    border: none;
    outline: none;
    padding: 10px;
    border-radius: 10px;
    transition: background 0.2s;
    cursor: pointer;
}

.filter-group button.active {
    background: var(--color-primary);
    cursor: default;
}

.records {
    width: 90%;
    max-width: 800px;
    margin: 0 auto;
    background: var(--color-object);
    border-spacing: 0;
    border: 1px solid var(--color-secondary);
    border-radius: 5px;
    overflow: hidden;
}

tr {
    position: relative;
    transition: background 0.2s;
}

tr:hover {
    background: var(--color-primary);
}

tr:nth-child(even)::after {
    content: "";
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    background: #fff;
    opacity: 0.07;
}

.race-time {
    color: var(--color-secondary);
}

td {
    border-bottom: 1px solid var(--color-secondary);
    border-right: 1px solid var(--color-secondary);
    padding: 10px;
}

td:last-child {
  border-right: none;
}

tr:last-child td {
  border-bottom: none;
}

.no-records > p {
    text-align: center;
    margin: 10px 0;
}

@media screen and (min-width: 768px) {
    .filters {
        flex-direction: row;
        width: fit-content;
        margin: 0 auto;
        margin-bottom: 10px;
    }

    .filter-group button {
        flex: initial;
        padding: 10px 20px;
    }
}
</style>
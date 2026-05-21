<script setup>
defineProps({
    loading: {
        type: Boolean,
        required: true
    }
})
</script>

<template>
    <div class="loading-wrapper">
        <div v-if="loading" class="throbber-container">
            <div class="throbber"></div>
        </div>
        <slot v-else />
    </div>
</template>

<style scoped>
.loading-wrapper {
    display: contents;
}

.throbber-container {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
}

.throbber {
    width: 24px;
    height: 24px;
    border: 3px solid var(--color-secondary);
    border-top-color: transparent;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
}

@keyframes spin {
    to { transform: rotate(360deg); }
}
</style>
<script setup>
import { defineProps } from 'vue'
defineProps({
    title: String,
    message: String
})
</script>

<template>
    <div class="banner">
        <h2>{{ title }}</h2>
        <p>{{ message }}</p>
    </div>
</template>

<style scoped>
.banner {
    width: 90%;
    max-width: 500px;
    margin: 0 auto;
    padding: 20px;
    background-color: var(--color-object);
    border: 1px solid var(--color-secondary);
    border-radius: 30px;
    text-align: center;
}

h2, p {
    color: var(--color-secondary);
}

p {
    line-height: 1.5;
}

@media screen and (min-width: 768px) {
    h2 {
        font-size: 2.5rem;
    }

    p {
        font-size: 2rem;
    }
}
</style>
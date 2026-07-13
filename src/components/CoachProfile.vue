<script setup>
import { defineProps } from 'vue'

defineProps({
  name: String,
  type: String,
  photo: String,
  contactInfo: String,
  bio: String
})
</script>

<template>
<div class="profile">
    <div class="profile-photo">
        <img :src="photo" :alt="name" />
    </div>
    <div class="profile-info">
        <h3 class="coach-name">{{ name }}</h3>
        <p v-if="contactInfo" class="coach-contact-info">{{ contactInfo }}</p>
        <p v-if="bio" class="coach-bio">{{ bio }}</p>
    </div>
</div>
</template>

<style scoped>
.profile {
    width: 100%;
    max-width: 400px;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
}

.profile-photo {
    width: 100%;
    img {
        width: 90%;
        max-width: 300px;
        aspect-ratio: 1/1;
        object-fit: cover;
        border-radius: 50%;
    }
}

.coach-name {
    font-size: 2rem;
    font-weight: normal;
    margin: 1rem 0 0.5rem 0;
}

.coach-type, .coach-contact-info, .coach-bio {
    margin: 1.5rem 0;
}

.coach-contact-info {
    color: var(--color-secondary);
}

.coach-bio {
    font-style: italic;
}
</style>
<script setup>
import handbook from '@/content/handbook.json'
</script>

<template>
    <h2 class="page-header">Team Handbook</h2>
    <div class="pdf-container">
        <iframe 
          v-if="handbook.handbook_pdf" 
          :src="handbook.handbook_pdf" 
          style="border: none;"
        >
            <p>Your browser does not support PDFs.<a :href="handbook.handbook_pdf">Download the PDF</a>.</p>
        </iframe>
        <a :href="handbook.handbook_pdf" target="_blank">
            <button class="btn-outline">View/Download PDF</button>
        </a>
    </div>
</template>

<style scoped>
.pdf-container {
    width: 90%;
    max-width: 900px;
    margin: 0 auto 50px auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
}

iframe {
    width: 100%;
    height: 70vh;
}
</style>
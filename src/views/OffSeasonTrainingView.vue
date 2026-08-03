<script setup>
import { ref, computed } from 'vue'
import { marked } from 'marked'

// 1. Direct static import of your JSON file
import summerData from '@/content/summer-training-info.json'

const pageData = ref(summerData)

// 2. Helper function to safely parse markdown text strings
const renderMarkdown = (text) => {
  return text ? marked.parse(text) : ''
}

// 3. Computed object containing all parsed HTML strings
const parsedMarkdown = computed(() => {
  return {
    introduction_paragraph: renderMarkdown(pageData.value.introduction_paragraph),
    communication_text: renderMarkdown(pageData.value.communication_text),
    what_text: renderMarkdown(pageData.value.what_text),
    when_text: renderMarkdown(pageData.value.when_text),
    where_text: renderMarkdown(pageData.value.where_text),
    who_text: renderMarkdown(pageData.value.who_text),
  }
})
</script>

<template>
    <div class="media">
        <img
            v-if="pageData.introduction_image" 
            :src="pageData.introduction_image" 
            :alt="pageData.introduction_header"
        />
        <div class="media-text">
            <h2 class="page-header">{{ pageData.introduction_header }}</h2>
            <div class="parsed_markdown" v-html="parsedMarkdown.introduction_paragraph"></div>
        </div>
    </div>
    <section class="info-blocks">
        <div class="paragraph">
            <h3>Communication</h3>
            <div class="parsed_markdown" v-html="parsedMarkdown.communication_text"></div>
        </div>
        <div class="paragraph">
            <h3>What?</h3>
            <div class="parsed_markdown" v-html="parsedMarkdown.what_text"></div>
        </div>
        <div class="paragraph">
            <h3>When?</h3>
            <div class="parsed_markdown" v-html="parsedMarkdown.when_text"></div>
        </div>
        <div class="paragraph">
            <h3>Where?</h3>
            <div class="parsed_markdown" v-html="parsedMarkdown.where_text"></div>
        </div>
        <div class="paragraph">
            <h3>Who?</h3>
            <div class="parsed_markdown" v-html="parsedMarkdown.who_text"></div>
        </div>
    </section>
    
</template>

<style scoped>
.media {
    width: 90%;
    max-width: 900px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: 1fr;
    gap: 30px;
    align-items: center;
    margin-top: 30px;

    img {
        width: 100%;
        aspect-ratio: 3/2;
        object-fit: cover;
        overflow: hidden;
        border-radius: 30px;
    }
}

.media-text {
    text-align: center;

    h2 {
        margin: 0;
    }

    .parsed_markdown {
        margin: 17px 0 0 0;
    }
}

.parsed_markdown {
    line-height: 1.5;
    opacity: .8;
}

.info-blocks {
    width: 90%;
    margin: 0 auto;
}

h3 {
    font-family: var(--font-body);
    font-weight: normal;
    color: var(--color-secondary);
    padding-bottom: 15px;
    border-bottom: 1px solid var(--color-secondary);
    margin: 0;
}

@media screen and (min-width: 768px) {
    .media {
        grid-template-columns: 1fr 1fr;
    }
}

</style>
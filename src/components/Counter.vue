<script setup>
import { ref, reactive, computed } from 'vue'


const author1 = reactive({
    name: "John Doe",
    books: ["Book 1", "Book 2", "Book 3"]
})
const author2 = reactive({
    name: "Jane Green",
    books: []
})

const booksMessage = computed(() => {
    return author1.books.length > 0 ? "Has books" : " does not have books"
})
</script>

<template>
    <p>{{ author1.name }}</p>
    <span>{{ booksMessage }}</span>
</template>
<script setup>

const props = defineProps({
    artist: {
        type: Object, 
        required: true
    }
})

</script>

<template>
    <article>
        <img :src="artist.image" alt="image de l'artiste">
        <h2>{{ artist.name }}</h2>
    </article>
</template>
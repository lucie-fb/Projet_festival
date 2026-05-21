<script setup>
const festivals = await $fetch("/api/ticketmaster?artist=festival")
const artists = await $fetch("/api/spotify?artist=festival")

console.log("Data ok :", festivals)
</script>

<template>
  <div>
    <h1>Festivals found</h1>

    <pre>{{ festivals }}</pre>
    <pre>{{ artists }}</pre>
  </div>
</template>

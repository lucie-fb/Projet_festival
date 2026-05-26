<script setup>
let festivals = [];
let albums = [];

try {
  const spotify = await $fetch("/api/spotify/albums");
  const ticketmaster = await $fetch("/api/ticketmaster/festivals");

  festivals = [...ticketmaster];
  albums = [...spotify];

  await $fetch("/api/festivals/save", {
    method: "POST",
    body: { festivals },
  });
  await $fetch("/api/albums/save", {
    method: "POST",
    body: { albums },
  });
  console.log("ticketmaster =", ticketmaster)
console.log("spotify =", spotify)
} catch (error) {
  console.error(error);
}
</script>

<template>
  <div>
    <h1>Festivals trouvés</h1>
    <pre>{{ festivals }}</pre>
    <pre>{{ albums }}</pre>
  </div>
</template>

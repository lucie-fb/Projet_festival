<template>
  <div>
    <nav style="display:flex; gap:20px; padding:20px;">
      <NuxtLink to="/">Accueil</NuxtLink>
      <NuxtLink to="/festivals">Festivals</NuxtLink>
      <NuxtLink to="/artists/1">Artiste test</NuxtLink>
    </nav>

    <slot />
  </div>
</template>

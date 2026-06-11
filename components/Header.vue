<script setup>
const { locale, locales, setLocale } = useI18n()
const localePath = useLocalePath()
</script>

<template>
  <header class="navbar">
    <div class="navbar-left">
    <img alt="Logo du site Sun and Sound" src="/public/images/logo_sun&sound.png" class="login-logo">
    </div>

    <nav class="navbar-center">
    <NuxtLink :to="localePath('/')">{{ $t('nav.home') }}</NuxtLink>
      <NuxtLink :to="localePath('/artists/[id]')">{{ $t('nav.artists') }}</NuxtLink>
      <NuxtLink :to="localePath('/favorites')">{{ $t('nav.favorites') }}</NuxtLink>
      <NuxtLink :to="localePath('/festivals')">{{ $t('nav.festivals') }}</NuxtLink>
      <NuxtLink :to="localePath('/account')">{{ $t('nav.account') }}</NuxtLink>
      <NuxtLink :to="localePath('/login')">{{ $t('nav.logout') }}</NuxtLink>
    </nav>

    <div class="navbar-right">
      <select v-model="locale" @change="setLocale($event.target.value)" class="lang-select">
        <option 
          v-for="l in locales" 
          :key="l.code" 
          :value="l.code"
        >
          {{ l.name }}
        </option>
      </select>
    </div>

  </header>

  <main>
    <slot />
  </main>
</template>

<style scoped>
.navbar {
  width: 100%;
  background: var(--color-primary);
  padding: 16px 40px;
  display: flex;
  align-items: center;
  justify-content: space-between; /* Logo à gauche, menu centré */
  box-shadow: var(--shadow-soft);
  position: sticky;
  top: 0;
  z-index: 1000;
}

/* Logo */
.navbar-left {
  display: flex;
  align-items: center;
}

.login-logo {
  width: 55px;
}

/* Menu centré */
.navbar-center {
  display: flex;
  gap: 32px;
  margin: 0 auto; /* Centre le bloc */
}

/* Liens */
.navbar-center a {
  color: var(--color-white);
  text-decoration: none;
  font-weight: 600; /* Texte en gras */
  font-size: 1rem;
  padding: 8px 14px;
  border-radius: 10px;
  transition: 0.2s ease;
}

/* Hover */
.navbar-center a:hover {
  background: var(--color-secondary);
  color: var(--color-primary);
}

/* Lien actif */
.navbar-center .router-link-active {
  background: var(--color-white);
  color: var(--color-primary);
  font-weight: 700;
}

.navbar-right {
  display: flex;
  align-items: center;
}

.lang-select {
  padding: 6px 10px;
  border-radius: 8px;
  border: none;
  font-weight: 600;
  background: var(--color-secondary);
  color: var(--color-primary);
  cursor: pointer;
  font-family: 'Poppins', sans-serif;
  transition: 0.2s ease;
}

.lang-select:hover {
  background: #ffd6f4;
}
</style>
<script setup>
const { locale, locales, setLocale } = useI18n()
const localePath = useLocalePath()

const isOpen = ref(false)

function toggleMenu() {
  isOpen.value = !isOpen.value
}

</script>

<template>
  <header class="navbar" :class="{ open: isOpen }">
    <div class="navbar-left">
    <img alt="Logo du site Sun and Sound" src="/public/images/logo_sun&sound.png" class="login-logo">
    </div>

    <nav class="navbar-center" :class="{ show: isOpen }">
    <NuxtLink :to="localePath('/')">{{ $t('nav.home') }}</NuxtLink>
      <NuxtLink :to="localePath('/artists/[id]')">{{ $t('nav.artists') }}</NuxtLink>
      <NuxtLink :to="localePath('/favorites')">{{ $t('nav.favorites') }}</NuxtLink>
      <NuxtLink :to="localePath('/festivals')">{{ $t('nav.festivals') }}</NuxtLink>
      <NuxtLink :to="localePath('/account')">{{ $t('nav.account') }}</NuxtLink>
      <NuxtLink :to="localePath('/login')">{{ $t('nav.logout') }}</NuxtLink>
    </nav>

    <div class="navbar-right">
      <select :value="locale" @change="setLocale($event.target.value)" class="lang-select">
        <option 
          v-for="l in locales" 
          :key="l.code" 
          :value="l.code"
        >
          {{ l.name }}
        </option>
      </select>
    </div>
 <button class="burger" @click="toggleMenu">☰</button>
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
  justify-content: space-between;
  box-shadow: var(--shadow-soft);
  position: sticky;
  top: 0;
  z-index: 1000;
}

.navbar-left {
  display: flex;
  align-items: center;
}

.login-logo {
  width: 55px;
}

.navbar-center {
  display: flex;
  gap: 32px;
  margin: 0 auto;
}

.navbar-center a {
  color: var(--color-white);
  text-decoration: none;
  font-weight: 600;
  font-size: 1rem;
  padding: 8px 14px;
  border-radius: 10px;
  transition: 0.2s ease;
}

.navbar-center a:hover {
  background: var(--color-secondary);
  color: var(--color-primary);
}

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

.burger {
  display: none;
  background: none;
  border: none;
  font-size: 2rem;
  color: white;
  cursor: pointer;
}


@media (max-width: 900px) {
  .navbar {
    padding: 14px 24px;
  }

  .navbar-center {
    gap: 20px;
  }

  .navbar-center a {
    font-size: 0.95rem;
    padding: 6px 10px;
  }

  .login-logo {
    width: 48px;
  }
}

@media (max-width: 700px) {
  .navbar-center {
    display: none;
  }

  .burger {
    display: block;
    margin-left: auto;
  }

  .navbar.open .navbar-center {
    display: flex;
    flex-direction: column;
    position: absolute;
    top: 70px;
    left: 0;
    width: 100%;
    background: var(--color-primary);
    padding: 20px 0;
    gap: 18px;
    box-shadow: 0 6px 20px rgba(0,0,0,0.25);
    z-index: 999;
  }
}


@media (max-width: 420px) {
  .login-logo {
    width: 42px;
  }

.burger {
    display: block;
    margin-left: auto;
  }

  .navbar::after {
    font-size: 1.6rem;
  }

  .lang-select {
    font-size: 0.85rem;
  }
}

</style>
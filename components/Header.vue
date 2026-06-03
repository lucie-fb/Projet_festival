<template>
  <header class="navbar">
    <div class="navbar-left">
    <img alt="Logo du site Sun and Sound" src="/public/images/logo_sun&sound.png" class="login-logo">
    </div>

    <nav class="navbar-center">
    <NuxtLink to="/">Accueil</NuxtLink>
    <NuxtLink to="/artists/1">Artistes</NuxtLink>
    <NuxtLink to="/favorites">Liste Favoris</NuxtLink>
    <NuxtLink to="/festivals">Festivals</NuxtLink>
    <NuxtLink to="/account">Mon Compte</NuxtLink>
    <NuxtLink to="/login">Déconnexion</NuxtLink>
    </nav>
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
</style>
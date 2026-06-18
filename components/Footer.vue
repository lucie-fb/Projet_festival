<template>
  <footer class="footer">
    <div class="footer-main">
      <p class="brand">Sun & Sound © 2026</p>

      <p class="accessibility">
        Accessibilité : bonnes pratiques RGAA
      </p>

      <a
        href="https://github.com/lucie-fb"
        target="_blank"
        rel="noopener"
        class="github"
      >
        Code source : GitHub
      </a>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  background: var(--color-primary);
  color: var(--color-white); 
  padding: 2rem 1rem;
  text-align: center;
  margin-top: 3rem;
  border-top: 4px solid var(--color-secondary);
  font-family: 'Poppins', sans-serif; 
}

.footer-main {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.6rem;
}

.brand {
  font-weight: 600;
  font-size: 1rem;
}

.accessibility {
  font-size: 0.85rem;
  opacity: 0.9;
}

.github {
  color: var(--color-secondary);
  font-weight: 500;
  text-decoration: none;
  transition: 0.2s ease;
}

.github:hover,
.github:focus-visible {
  text-decoration: underline;
  outline: none;
}

.github:focus-visible {
  box-shadow: 0 0 0 3px var(--color-white);
  border-radius: 4px;
}


@media (max-width: 480px) {
  .footer {
    font-size: 0.85rem;
    padding: 1.5rem 1rem;
  }
}
</style>
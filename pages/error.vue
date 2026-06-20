<script setup>
import { useRouter } from "vue-router";

const router = useRouter();

function goHome() {
  router.push("/");
}

function goBack() {
  router.back();
}
</script>

<template>
  <div class="error-page">
    <h1>Oups…</h1>
    <p>La page que vous cherchez n’existe pas ou a rencontré un problème.</p>

    <div class="buttons">
      <button @click="goHome" class="btn primary">
        Retour à l’accueil
      </button>
    </div>
  </div>
</template>

<style scoped>
.error-page {
  text-align: center;
  padding: 80px 20px;
  max-width: 600px;
  margin: 0 auto;
}

h1 {
  font-size: 2.5rem;
  margin-bottom: 16px;
  color: var(--color-primary);
}

p {
  font-size: 1.2rem;
  margin-bottom: 32px;
  color: #555;
}

.buttons {
  display: flex;
  justify-content: center;
  gap: 16px;
  flex-wrap: wrap;
}

.btn {
  padding: 12px 20px;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  border: none;
  transition: 0.2s ease;
}

.btn.primary {
  background: var(--color-primary);
  color: white;
}

.btn.primary:hover {
  background: var(--color-primary-dark);
}

.btn.secondary {
  background: #e5e5e5;
  color: #333;
}

.btn.secondary:hover {
  background: #d4d4d4;
}
</style>
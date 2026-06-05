<script setup>
const props = defineProps({
  festival: {
    type: Object,
    required: true
  }
})

const flipped = ref(false)

function toggleFlip() {
  flipped.value = !flipped.value
}
</script>

<template>
  <article class="card" :class="{ flipped }">
    
    <!-- FACE AVANT -->
    <div class="front">
      <img class="banner" :src="festival.image" :alt="festival.name" />

      <div class="content">
        <h2>{{ festival.name }}</h2>

        <p class="meta">
          <span>{{ festival.date }}</span>
          <span v-if="festival.city"> • {{ festival.city }}</span>
          <span v-if="festival.country"> ({{ festival.country }})</span>
        </p>

        <button class="btn" @click.stop="toggleFlip">
          Voir la programmation
        </button>
      </div>
    </div>

    <!-- FACE ARRIÈRE -->
    <div class="back">
      <p v-if="festival.lineup.length === 0">
        Aucune programmation disponible
      </p>

      <p v-else class="artists">
        {{ festival.lineup.map(a => a.name).join(" — ") }}
      </p>

      <button class="btn" @click.stop="toggleFlip">
        Retour
      </button>
    </div>

  </article>
</template>

<style lang="css" scoped>

.card {
  width: 100%;
  height: 450px;
  position: relative;
  transform-style: preserve-3d;
  transition: transform .6s ease;

  border: 2px solid rgba(153, 0, 112, 0.25);
  border-radius: 20px;

  box-shadow: 0 6px 18px rgba(153, 0, 112, 0.25);

  background: transparent;
  font-family: 'Poppins', sans-serif;
}

.card.flipped {
  transform: rotateY(180deg);
}

/* Faces */
.front,
.back {
  position: absolute;
  inset: 0;
  backface-visibility: hidden;
  border-radius: 20px;
  overflow: hidden;

  display: flex;
  flex-direction: column;
  justify-content: space-between;

  padding: 18px;
}

.front {
  background: var(--color-primary);
  color: var(--color-white);
}

.banner {
  width: 100%;
  height: 140px;
  object-fit: cover;
  border-radius: 14px;
  margin-bottom: 14px;
}

.content h2 {
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 6px;
}

.meta {
  font-size: .95rem;
  opacity: 0.9;
  margin-bottom: 14px;
}

.back {
  background: var(--color-primary);
  color: var(--color-white);
  transform: rotateY(180deg);
  text-align: left;
}

.artists {
  margin-top: 1rem;
  line-height: 1.5;
  font-size: .95rem;
  opacity: 0.95;
}

.btn {
  background: var(--color-secondary);
  color: var(--color-primary);
  border: none;
  padding: 10px 16px;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: 0.2s ease;
  font-size: .95rem;
  align-self: flex-start;
}

.btn:hover {
  background: #ffd6f4;
}

</style>
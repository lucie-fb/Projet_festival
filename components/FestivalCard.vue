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

<style scoped>
.card {
  width: 100%;
  height: 500px;
  position: relative;
  transform-style: preserve-3d;
  transition: transform .6s;
}


.card.flipped {
  transform: rotateY(180deg);
}

.front, .back {
  position: absolute;
  inset: 0;
  backface-visibility: hidden;
  background: #fff;
  border-radius: 14px;
  overflow: hidden;
  box-shadow: 0 4px 14px rgba(0,0,0,0.12);
  padding: 1rem;
}

.back {
  transform: rotateY(180deg);
  text-align: left;
}

.banner {
  width: 100%;
  height: 150px;
  object-fit: cover;
  border-radius: 12px;
}

.artists {
  margin-top: 1rem;
  line-height: 1.6;
  font-size: .95rem;
  color: #333;
}

.btn {
  background: #ff7b00;
  color: white;
  border: none;
  padding: .6rem 1rem;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  transition: background .2s ease;
  margin-top: 1rem;
}

.btn:hover {
  background: #e56f00;
}
</style>
<script setup>
import { useRoute } from 'vue-router'
import { useRouter } from 'vue-router'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

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

const emit = defineEmits(['select'])
const router = useRouter()
const route = useRoute()

const clickFestivals = () => {
  if (route.path === '/festivals') {
    emit('select', props.festival.name)
    return
  }
  router.push(`/festivals?name=${encodeURIComponent(props.festival.name)}`)
}

const { t } = useI18n()
</script>

<template>
  <article class="card" :class="{ flipped }" @click="clickFestivals">
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
          {{ t('festival.viewProgram') }}
        </button>
      </div>
    </div>

    <div class="back">
      <p v-if="!festival.lineup || festival.lineup.length === 0">
        {{ t('festival.noProgram') }}
      </p>

      <p v-else class="artists">
        {{ festival.lineup.map(a => a.name).join(' — ') }}
      </p>

      <button class="btn" @click.stop="toggleFlip">
        {{ t('festival.back') }}
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

@media (max-width: 900px) {
  .card {
    height: 400px;
  }

  .banner {
    height: 120px;
  }

  .content h2 {
    font-size: 1.1rem;
  }

  .meta {
    font-size: 0.9rem;
  }

  .artists {
    font-size: 0.9rem;
  }

  .btn {
    padding: 8px 14px;
    font-size: 0.9rem;
  }
}

@media (max-width: 600px) {
  .card {
    height: 360px;
    border-radius: 16px;
  }

  .front,
  .back {
    padding: 14px;
  }

  .banner {
    height: 110px;
    border-radius: 12px;
  }

  .content h2 {
    font-size: 1rem;
  }

  .meta {
    font-size: 0.85rem;
  }

  .artists {
    font-size: 0.85rem;
    line-height: 1.4;
  }

  .btn {
    padding: 8px 12px;
    font-size: 0.85rem;
    border-radius: 10px;
  }
}

@media (max-width: 400px) {
  .card {
    height: 330px;
  }

  .banner {
    height: 100px;
  }

  .content h2 {
    font-size: 0.9rem;
  }

  .meta,
  .artists {
    font-size: 0.8rem;
  }

  .btn {
    font-size: 0.8rem;
  }
}

</style>
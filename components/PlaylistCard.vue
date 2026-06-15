<script setup>
const props = defineProps({
    playlist:{
        type: Object,
        required: true
    },
    isDefault:{
        type: Boolean,
        default: false
    }
});

const emit = defineEmits(["open"])

</script>

<template>

    <div class="playlist-card" @click="emit('open', playlist)">
        <div class="playlist-thumb">
     <svg v-if="isDefault" class="icon default-icon" viewBox="0 0 24 24">
        <path d="M12 21s-6.2-4.35-9.33-8.48C-1.2 8.4 1.02 3 5.6 3c2.3 0 4.07 1.33 5.4 3.09C12.93 4.33 14.7 3 17 3c4.58 0 6.8 5.4 2.93 9.52C18.2 16.65 12 21 12 21z"/>
      </svg>

     <svg v-else class="icon music-icon" viewBox="0 0 48 48">
  <path 
    fill="white"
    d="M34 6v22.5a6 6 0 1 1-3.5-5.5V14l-14 3v17.5a6 6 0 1 1-3.5-5.5V10.5L34 6z"
  />
</svg>

    </div>

    <h3>{{ playlist.name }}</h3>
  </div>

</template>

<style scoped>

.playlist-card {
  background: white;
  border-radius: 18px;
  padding: 18px;
  border: 1px solid rgba(153, 0, 112, 0.15);
  box-shadow: 0 4px 14px rgba(153, 0, 112, 0.15);
  cursor: pointer;
  transition: transform .25s ease, box-shadow .25s ease;
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.playlist-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 10px 26px rgba(153, 0, 112, 0.25);
}

.playlist-thumb {
  width: 100%;
  height: 150px;
  border-radius: 14px;
  background: linear-gradient(135deg, #ffb3d9, #d98cff);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

.icon {
  width: 70px;
  height: 70px;
  fill: white;
  opacity: 0.9;
  transition: transform .25s ease;
}

.playlist-card:hover .icon {
  transform: scale(1.08);
}

h3 {
  font-size: 1rem;
  font-weight: 600;
  color: var(--color-primary);
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}

@media (max-width: 900px) {
  .playlist-card {
    padding: 16px;
    gap: 10px;
  }

  .playlist-thumb {
    height: 130px;
  }

  .icon {
    width: 60px;
    height: 60px;
  }

  h3 {
    font-size: 0.95rem;
  }
}

@media (max-width: 600px) {
  .playlist-card {
    padding: 14px;
    border-radius: 16px;
  }

  .playlist-thumb {
    height: 120px;
  }

  .icon {
    width: 50px;
    height: 50px;
  }

  h3 {
    font-size: 0.9rem;
  }
}

@media (max-width: 400px) {
  .playlist-card {
    padding: 12px;
  }

  .playlist-thumb {
    height: 110px;
  }

  .icon {
    width: 45px;
    height: 45px;
  }

  h3 {
    font-size: 0.85rem;
  }
}

</style>
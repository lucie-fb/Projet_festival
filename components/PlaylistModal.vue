<script setup>

const props = defineProps({
    show: Boolean,
    playlist: Object,
    items: Array
})

const emit = defineEmits(["close", "updated"])

const newName = ref("")

watch(()=> props.playlist, (p)=> {
    if(p) newName.value = p.name
})

async function renamePlaylist(){
    if(!newName.value.trim())return
    await $fetch("/api/playlists/rename", {
        method: "POST",
        body: {
            playlistId: props.playlist.id,
            name: newName.value
        },
        credentials: "include"
})
emit("updated")
}

async function removeItem(itemId) {
  await $fetch("/api/playlists/remove-item", {
    method: "POST",
    body: { itemId },
    credentials: "include"
  })

  emit("updated")
}

function close(){
    emit("close")
}

</script>

<template>

<div v-if="show" class="modal-overlay" @click.self="close">
    <div class="modal-box">

        <header>
            <h2>{{ playlist.name }}</h2>
            <button class="close-btn" @click="close">X</button>
        </header>

        <div v-if="!playlist.isDefault" class="rename-box">
            <input v-model="newName" placeholder="Nouveau nom"/>
            <button @click="renamePlaylist">Renommer</button>
        </div>

        <div class="items-list">
            <div v-for="item in items"
            :key="item.id"
            class="item-row">
        <img :src="item.image" alt=""/>
    <span>{{ item.name }}</span>

<button class="remove-btn" @click="removeItem(item.id)"> Supprimer</button>
</div>
        </div>
    </div>
</div>
</template>

<style scoped>
/* Overlay */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.55);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
}

/* Box */
.modal-box {
  background: white;
  width: 90%;
  max-width: 500px;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.25);
  animation: fadeIn .2s ease;
}

@keyframes fadeIn {
  from { transform: scale(0.95); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}

/* Header */
header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.close-btn {
  background: transparent;
  border: none;
  font-size: 1.4rem;
  cursor: pointer;
}

/* Rename */
.rename-box {
  display: flex;
  gap: 10px;
  margin: 20px 0;
}

.rename-box input {
  flex: 1;
  padding: 8px 12px;
  border-radius: 10px;
  border: 2px solid rgba(153, 0, 112, 0.25);
}

.rename-box button {
  background: var(--color-primary);
  color: white;
  padding: 8px 14px;
  border-radius: 10px;
  border: none;
  cursor: pointer;
}

/* Items */
.items-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.item-row {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px;
  border-radius: 12px;
  background: #f7f7f7;
}

.item-row img {
  width: 50px;
  height: 50px;
  border-radius: 8px;
  object-fit: cover;
}

.remove-btn {
  margin-left: auto;
  background: #ff2d55;
  color: white;
  border: none;
  padding: 6px 10px;
  border-radius: 8px;
  cursor: pointer;
}

@media (max-width: 900px) {
  .modal-box {
    max-width: 420px;
    padding: 18px;
  }

  header h2 {
    font-size: 1.3rem;
  }

  .rename-box input {
    font-size: 0.95rem;
    padding: 6px 10px;
  }

  .rename-box button {
    padding: 6px 12px;
    font-size: 0.9rem;
  }

  .item-row img {
    width: 45px;
    height: 45px;
  }

  .item-row span {
    font-size: 0.95rem;
  }

  .remove-btn {
    padding: 6px 10px;
    font-size: 0.85rem;
  }
}

@media (max-width: 600px) {
  .modal-box {
    width: 92%;
    max-width: none;
    padding: 16px;
    border-radius: 14px;
  }

  header h2 {
    font-size: 1.2rem;
  }

  .rename-box {
    flex-direction: column;
  }

  .rename-box input,
  .rename-box button {
    width: 100%;
  }

  .item-row {
    padding: 6px;
    gap: 10px;
  }

  .item-row img {
    width: 40px;
    height: 40px;
  }

  .item-row span {
    font-size: 0.9rem;
  }

  .remove-btn {
    padding: 6px 8px;
    font-size: 0.8rem;
  }
}

@media (max-width: 400px) {
  .modal-box {
    padding: 14px;
  }

  header h2 {
    font-size: 1.1rem;
  }

  .item-row img {
    width: 36px;
    height: 36px;
  }

  .item-row span {
    font-size: 0.85rem;
  }
}

</style>
import { defineStore } from "pinia";

export const useUserDataStore = defineStore('userData', {
    state: ()=> ({
        favorites: [],
        playlists: [],
        loaded: false
    }),

    actions: {
        async load() {
            if(this.loaded) return

            const favs = await $fetch('/api/favorites/list', {
                credentials: 'include'})
            const pls = await $fetch('/api/playlists/list', {
                credentials: 'include'})

            this.favorites = favs.value || []
            this.playlists = pls.value || []
            this.loaded = true
        },

        isFavorite(id) {
            return this.favorites.some(f=>f.artistId === id)
        }
    }
})
<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold">📅 Kalendarz rodzinny</h1>
    <p class="mt-2">Tu będzie widok kalendarza.</p>
    <button
      @click="logout"
      class="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
    >
      Wyloguj
    </button>
  </div>
</template>

<script setup>
import { useAuthStore } from '../store/auth'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()

const logout = () => {
  authStore.logout()
  router.push('/login')
}
</script>
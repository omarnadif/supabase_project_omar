<script setup lang="ts">
const user = useSupabaseUser()

const username = computed(() => {
  return user.value?.email?.split('@')[0] || 'Invité'
})
</script>

<template>
  <div class="flex flex-col items-center justify-center min-h-screen p-4 text-center bg-white dark:bg-gray-950">
    <h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-4">
      Bonjour, <span class="text-primary-500 capitalize">{{ username }}</span>
    </h1>

    <p class="text-xl text-gray-600 dark:text-gray-400 mb-8">
      Bienvenue dans le système de gestion des task.
    </p>

    <UButton
      to="/user/create_task"
      size="xl"
      icon="i-heroicons-plus-circle"
      label="Créer une nouvelle task"
    />
  </div>
</template>

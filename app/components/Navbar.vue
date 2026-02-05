<script setup lang="ts">
import type { NavigationMenuItem } from '#ui/types'

// Supabase and router
const user = useSupabaseUser()
const client = useSupabaseClient()
const router = useRouter()

const items = ref<NavigationMenuItem[]>([
  {
    label: 'Guide',
    icon: 'i-heroicons-book-open',
    to: '/docs/getting-started'
  },
  {
    label: 'Composables',
    icon: 'i-heroicons-circle-stack',
    to: '/docs/composables'
  },
  {
    label: 'Components',
    icon: 'i-heroicons-cube',
    to: '/docs/components'
  },
  {
    label: 'GitHub',
    icon: 'i-simple-icons-github',
    to: 'https://github.com/nuxt/ui',
    target: '_blank'
  }
])

// Theme toggle
const colorMode = useColorMode()
const isDark = computed({
  get: () => colorMode.value === 'dark',
  set: () => colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
})

// Logout function
const handleLogout = async () => {
  await client.auth.signOut()
  router.push('/login')
}
</script>

<template>
  <header
    class="sticky top-0 z-50 w-full border-b border-gray-200 dark:border-gray-800 bg-white/75 dark:bg-gray-900/75 backdrop-blur-xl"
  >
    <div class="container mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex h-16 items-center justify-between">
        <NuxtLink
          to="/"
          class="flex items-center gap-2 font-bold text-xl text-gray-900 dark:text-white cursor-pointer hover:opacity-80 transition-opacity"
        >
          <div class="bg-primary-500/10 p-1.5 rounded-lg text-primary-500">
            <UIcon
              name="i-heroicons-rocket-launch"
              class="w-6 h-6"
            />
          </div>
          <span>Omar Project</span>
        </NuxtLink>

        <UNavigationMenu
          v-if="user"
          :items="items"
          class="hidden md:flex"
          :ui="{
            link: 'px-3 py-2 text-sm font-medium transition-colors duration-200',
            active: 'text-primary-500 bg-primary-50 dark:bg-primary-950/50 rounded-md',
            inactive: 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-md'
          }"
        />

        <div class="flex items-center gap-2">
          <ClientOnly>
            <UButton
              :icon="isDark ? 'i-heroicons-moon' : 'i-heroicons-sun'"
              color="gray"
              variant="ghost"
              aria-label="Theme"
              @click="isDark = !isDark"
            />
          </ClientOnly>

          <div class="h-6 w-px bg-gray-200 dark:bg-gray-800 mx-1" />

          <UButton
            v-if="user"
            color="gray"
            variant="ghost"
            label="Logout"
            icon="i-heroicons-arrow-left-start-on-rectangle"
            class="hidden sm:flex"
            @click="handleLogout"
          />

          <UButton
            v-else
            to="/login"
            color="primary"
            variant="solid"
            label="Login"
            icon="i-heroicons-arrow-right-end-on-rectangle"
            class="hidden sm:flex"
          />

          <UButton
            icon="i-heroicons-bars-3"
            color="gray"
            variant="ghost"
            class="md:hidden"
          />
        </div>
      </div>
    </div>
  </header>
</template>

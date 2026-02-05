<template>
  <div class="min-h-screen bg-[var(--ui-bg-muted)]">
    <UContainer class="py-16">
      <div class="mx-auto flex w-full max-w-md flex-col gap-6">
        <div class="text-center">
          <UBadge
            variant="subtle"
            color="primary"
            class="mb-4"
          >
            Supabase Auth
          </UBadge>
          <h1 class="text-3xl font-semibold text-[var(--ui-text)]">
            Accedi al tuo account
          </h1>
          <p class="mt-2 text-sm text-[var(--ui-text-muted)]">
            Usa le credenziali salvate in Supabase per entrare.
          </p>
        </div>

        <UCard>
          <form
            class="flex flex-col gap-4"
            @submit.prevent="handleSubmit"
          >
            <UFormField label="Email" name="email">
              <UInput
                v-model="email"
                type="email"
                placeholder="tuo.nome@email.com"
                autocomplete="email"
                required
              />
            </UFormField>

            <UFormField label="Password" name="password">
              <UInput
                v-model="password"
                type="password"
                placeholder="••••••••"
                autocomplete="current-password"
                required
              />
            </UFormField>

            <UButton
              type="submit"
              color="primary"
              size="lg"
              :loading="loading"
              :disabled="!canSubmit"
              block
            >
              Accedi
            </UButton>
          </form>
        </UCard>

        <UAlert
          v-if="errorMessage"
          color="error"
          variant="soft"
          :title="errorMessage"
        />
        <UAlert
          v-if="successMessage"
          color="success"
          variant="soft"
          :title="successMessage"
        />

        <div class="text-center text-xs text-[var(--ui-text-muted)]">
          Configura <code class="font-semibold">NUXT_PUBLIC_SUPABASE_URL</code> e
          <code class="font-semibold">NUXT_PUBLIC_SUPABASE_ANON_KEY</code> per
          connetterti.
        </div>
      </div>
    </UContainer>
  </div>
</template>

<script setup lang="ts">
import { createClient } from '@supabase/supabase-js'

const config = useRuntimeConfig()
const supabase = createClient(
  config.public.supabaseUrl,
  config.public.supabaseAnonKey
)

const email = ref('')
const password = ref('')
const loading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

const canSubmit = computed(() => email.value.length > 0 && password.value.length > 0)

const handleSubmit = async () => {
  errorMessage.value = ''
  successMessage.value = ''
  loading.value = true

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.value,
      password: password.value
    })

    if (error) {
      throw error
    }

    successMessage.value = `Accesso effettuato per ${data.user?.email ?? 'utente'}`
  } catch (error) {
    errorMessage.value =
      error instanceof Error
        ? error.message
        : 'Si è verificato un errore durante il login.'
  } finally {
    loading.value = false
  }
}
</script>

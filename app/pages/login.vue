<script setup lang="ts">
import * as z from 'zod'
import type { FormSubmitEvent, AuthFormField } from '@nuxt/ui'

const toast = useToast()
const router = useRouter()
const user = useSupabaseUser()

const fields: AuthFormField[] = [{
  name: 'email',
  type: 'email',
  label: 'Email',
  placeholder: 'Enter your email',
  required: true
}, {
  name: 'password',
  label: 'Password',
  type: 'password',
  placeholder: 'Enter your password',
  required: true
}, {
  name: 'remember',
  label: 'Remember me',
  type: 'checkbox'
}]

// Define the validation schema using Zod
const schema = z.object({
  email: z.email('Invalid email'),
  password: z.string('Password is required').min(3, 'Must be at least 8 characters')
})
type Schema = z.output<typeof schema>

// Send login
function onSubmit(payload: FormSubmitEvent<Schema>) {
  const supabase = useSupabaseClient()
  supabase.auth.signInWithPassword({
    email: payload.data.email,
    password: payload.data.password
  }).then(({ error }) => {
    if (error) {
      toast.add({ title: 'Login failed', description: error.message, color: 'error' })
    } else {
      toast.add({ title: 'Login successful', description: 'You have been logged in successfully', color: 'success' })
      router.push('/')
    }
  })
}
</script>

<template>
  <div
    v-if="!user"
    class="flex flex-col items-center justify-center gap-4 p-4"
  >
    <UPageCard class="w-full max-w-md">
      <UAuthForm
        :schema="schema"
        title="Login"
        description="Enter your credentials to access your account."
        icon="i-lucide-user"
        :fields="fields"
        @submit="onSubmit"
      />
    </UPageCard>
  </div>
  <div
    v-else
    class="flex flex-col items-center justify-center gap-4 p-4"
  >
    <h1>Tu es déjà connecté !</h1>
    <UButton
      label="Go to Home"
      color="primary"
      @click="router.push('/')"
    />
  </div>
</template>

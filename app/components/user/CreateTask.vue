<script setup lang="ts">
import { z } from 'zod'
import type { FormSubmitEvent } from '#ui/types'

// Config
const client = useSupabaseClient()
const user = useSupabaseUser()
const toast = useToast()

// Types
interface Task {
  id: number
  nom: string
  date: string
}

// Fetch tasks
const { data: tasks, refresh, pending } = await useAsyncData<Task[]>('tasks', async () => {
  if (!user.value) return []

  const { data, error } = await client
    .from('task')
    .select('*')
    .order('id', { ascending: false })

  if (error) {
    console.error('Error Supabase:', error)
    return []
  }
  return data || []
})

// Form state
const newTaskState = reactive({
  nom: '',
  date: new Date().toISOString().split('T')[0]
})

const schema = z.object({
  nom: z.string().min(3, 'Le nom doit comporter au moins 3 caractères'),
  date: z.string().refine(val => !isNaN(Date.parse(val)), 'La date doit être valide')
})

// Ajout Task
async function addTask(event: FormSubmitEvent<any>) {
  if (!user.value) return toast.add({ title: 'Erreur', description: 'Non connecté', color: 'red' })

  try {
    const { error } = await client.from('task').insert({
      nom: event.data.nom,
      date: event.data.date,
      user_id: user.value.id
    })

    if (error) throw error

    toast.add({ title: 'Tâche ajoutée', color: 'green', icon: 'i-heroicons-check' })

    newTaskState.nom = ''
    await refresh()
  } catch (e: any) {
    console.error(e)
    toast.add({ title: 'Erreur', description: e.message || 'Impossible de créer', color: 'red' })
  }
}

// Delete Task
async function deleteTask(id: number) {
  try {
    const { error } = await client.from('task').delete().eq('id', id)
    if (error) throw error

    toast.add({ title: 'Supprimée', color: 'orange', icon: 'i-heroicons-trash' })
    await refresh()
  } catch (e: any) {
    toast.add({ title: 'Erreur', description: e.message, color: 'red' })
  }
}

// Helper data
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('fr-FR', {
    day: 'numeric', month: 'long', year: 'numeric'
  })
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-950 p-4 sm:p-8">
    <UContainer class="max-w-4xl">
      <div class="mb-8 flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <UIcon
              name="i-heroicons-clipboard-document-list"
              class="text-primary-500"
            />
            Mes Tâches
          </h1>
          <p class="text-gray-500 mt-1">
            Gérez vos tâches quotidiennes
          </p>
        </div>
        <UBadge
          :label="`${tasks?.length || 0} Tâche(s)`"
          color="primary"
          variant="subtle"
          size="lg"
        />
      </div>

      <UCard class="mb-8 ring-1 ring-gray-200 dark:ring-gray-800 shadow-lg overflow-visible">
        <UForm
          :schema="schema"
          :state="newTaskState"
          class="flex flex-col sm:flex-row gap-4 items-end"
          @submit="addTask"
        >
          <div class="flex-grow w-full">
            <UFormGroup
              label="Nom de la tâche"
              name="nom"
            >
              <UInput
                v-model="newTaskState.nom"
                placeholder="Ex. Acheter du lait..."
                icon="i-heroicons-pencil"
                size="lg"
              />
            </UFormGroup>
          </div>
          <div class="w-full sm:w-48">
            <UFormGroup
              label="Date d'échéance"
              name="date"
            >
              <UInput
                v-model="newTaskState.date"
                type="date"
                size="lg"
                icon="i-heroicons-calendar"
              />
            </UFormGroup>
          </div>
          <div class="w-full sm:w-auto pb-1">
            <UButton
              type="submit"
              icon="i-heroicons-plus"
              size="lg"
              color="primary"
              label="Ajouter"
              block
            />
          </div>
        </UForm>
      </UCard>

      <div class="space-y-4">
        <div
          v-if="pending"
          class="flex justify-center py-8"
        >
          <UIcon
            name="i-heroicons-arrow-path"
            class="w-8 h-8 animate-spin text-primary-500"
          />
        </div>

        <div
          v-else-if="!tasks || tasks.length === 0"
          class="text-center py-12 bg-white dark:bg-gray-900 rounded-xl border border-dashed border-gray-300 dark:border-gray-700"
        >
          <UIcon
            name="i-heroicons-check-badge"
            class="w-16 h-16 text-green-500 mx-auto mb-4"
          />
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
            Tout est à jour !
          </h3>
          <p class="text-gray-500">
            Aucune tâche en attente.
          </p>
        </div>

        <TransitionGroup
          name="list"
          tag="ul"
          class="space-y-3"
        >
          <li
            v-for="task in tasks"
            :key="task.id"
          >
            <UCard
              :ui="{ body: { padding: 'p-3 sm:p-4' } }"
              class="group hover:ring-2 hover:ring-primary-500/50 transition-all duration-200"
            >
              <div class="flex items-center justify-between gap-4">
                <div class="flex items-center gap-4">
                  <div
                    class="bg-primary-50 dark:bg-primary-900/20 p-2 rounded-lg text-primary-600 dark:text-primary-400"
                  >
                    <UIcon
                      name="i-heroicons-bookmark"
                      class="w-5 h-5"
                    />
                  </div>
                  <div>
                    <h3 class="font-semibold text-gray-900 dark:text-white text-lg">
                      {{ task.nom }}
                    </h3>
                    <div class="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
                      <UIcon
                        name="i-heroicons-clock"
                        class="w-3 h-3"
                      />
                      <span>{{ formatDate(task.date) }}</span>
                    </div>
                  </div>
                </div>
                <div class="flex items-center">
                  <UTooltip text="Supprimer">
                    <UButton
                      color="red"
                      variant="ghost"
                      icon="i-heroicons-trash"
                      size="sm"
                      class="opacity-0 group-hover:opacity-100 transition-opacity"
                      @click="deleteTask(task.id)"
                    />
                  </UTooltip>
                </div>
              </div>
            </UCard>
          </li>
        </TransitionGroup>
      </div>
    </UContainer>
  </div>
</template>

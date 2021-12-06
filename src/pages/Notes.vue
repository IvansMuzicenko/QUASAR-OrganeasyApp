<template>
  <q-page>
    <q-card class="flex">
      <q-btn
        icon="arrow_back"
        flat
        class="absolute"
        @click="$router.push('/')"
      />

      <p class="text-center text-h6 full-width">Notes</p>
    </q-card>
    <div v-if="!Object.keys(notes).length">
      <p>You have not notes!</p>
      <q-btn color="secondary" @click="addNote()">Add note</q-btn>
    </div>
    <q-list v-else separator bordered>
      <q-item
        v-for="(note, index) in notes"
        :key="index"
        clickable
        :to="`/notes/${note['id']}`"
      >
        {{ note['title'] }}
      </q-item>
    </q-list>
  </q-page>
</template>

<script>
import addNoteForm from 'src/components/AddNoteForm.vue'
export default {
  computed: {
    notes() {
      return this.$store.getters['users/notes']
    }
  },
  methods: {
    addNote() {
      this.$q.dialog({
        component: addNoteForm
      })
    }
  }
}
</script>

<style></style>

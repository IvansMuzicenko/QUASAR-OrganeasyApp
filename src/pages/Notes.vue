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

    <q-list separator bordered>
      <q-item
        v-for="(note, index) in notes"
        :key="index"
        clickable
        :to="`/notes/${note['id']}`"
      >
        {{ note['title'] }}
      </q-item>
    </q-list>
    <div class="text-center q-my-md">
      <p v-if="!Object.keys(notes).length">You have not notes!</p>
      <q-btn color="secondary" @click="addNote()">Add note</q-btn>
    </div>
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

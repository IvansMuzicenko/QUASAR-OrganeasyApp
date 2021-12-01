<template>
  <q-page>
    <p class="text-h6 text-center">Notes</p>
    <div v-if="!Object.keys(notes).length">
      <p>You have not notes!</p>
      <q-btn color="secondary" @click="addNote()">Add note</q-btn>
    </div>
    <q-list separator bordered>
      <q-item
        v-for="(note, index) in notes"
        :key="index"
        clickable
        :to="`/notes/${note['id']}`"
      >
        {{ note["title"] }}
      </q-item>
    </q-list>
  </q-page>
</template>

<script>
import addNoteForm from "components/addNoteForm.vue";
export default {
  computed: {
    notes() {
      return this.$store.getters["users/notes"];
    },
  },
  methods: {
    addNote() {
      this.$q.dialog({
        component: addNoteForm,
      });
    },
  },
};
</script>

<style></style>

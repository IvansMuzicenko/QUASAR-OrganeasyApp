<template>
  <q-page>
    <q-card bordered>
      <q-btn
        v-if="editState"
        icon="save"
        dense
        flat
        class=""
        @click="saveEdit()"
      >
      </q-btn>
      <q-btn
        v-if="!editState"
        icon="edit"
        dense
        flat
        class=""
        @click="toggleEdit()"
      >
      </q-btn>

      <q-separator color="black" />

      <q-card-section class="text-h6">
        <p v-if="!editState" @click="toggleEdit()">
          {{ note.title }}
        </p>
        <q-input v-if="editState" v-model="noteTitle" class="text-h6" />
      </q-card-section>
      <q-separator v-if="!editState" color="black" inset />
      <q-card-section>
        <p v-if="!editState" @click="toggleEdit()">
          {{ note.text }}
        </p>
        <q-editor v-if="editState" v-model="noteText" min-height="5rem" />
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
export default {
  computed: {
    note() {
      const title = this.$route.path
        .slice(this.$route.path.lastIndexOf("/") + 1)
        .replaceAll("-", " ");
      return this.$store.getters["users/notes"][`id-${title}`];
    },
    noteTitle() {
      return this.note.title.slice();
    },
    noteText() {
      return this.note.text.slice();
    },
  },
  data() {
    return { editState: false };
  },
  methods: {
    toggleEdit() {
      this.editState = !this.editState;
    },
    saveEdit() {
      this.toggleEdit();
      //update database
    },
  },
};
</script>

<style></style>

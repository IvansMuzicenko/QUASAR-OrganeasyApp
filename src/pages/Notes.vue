<template>
  <q-page>
    <q-markup-table separator="cell">
      <q-list>
        <q-item
          v-for="(note, index) in notes"
          :key="index"
          clickable
          :to="`/notes/${note['title'].replaceAll(' ', '-')}`"
        >
          {{ note["title"] }}
        </q-item>
      </q-list>
    </q-markup-table>
  </q-page>
</template>

<script>
export default {
  computed: {
    notes() {
      return this.$store.getters["users/notes"];
    },
  },
};
</script>

<style></style>

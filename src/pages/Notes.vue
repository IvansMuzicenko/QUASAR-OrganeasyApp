<template>
  <q-page>
    <p class="text-h6 text-center">Notes</p>
    <q-list separator bordered>
      <q-item
        v-for="(note, index) in notes"
        :key="index"
        clickable
        :to="`/notes/${note['title'].replaceAll(' ', '-')}`"
      >
        {{ note["title"] }}
      </q-item>
    </q-list>
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

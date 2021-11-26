<template>
  <q-page>
    {{ note.title }}
    <q-separator color="black" inset />
    {{ note.text }}
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
  },
};
</script>

<style></style>

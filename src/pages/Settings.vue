<template>
  <q-page>
    settings
    <q-btn color="red-8" @click="logout()"> Logout </q-btn>
  </q-page>
</template>

<script>
export default {
  methods: {
    async logout() {
      await this.$store.dispatch('users/logout')
    }
  }
}
</script>

<style></style>

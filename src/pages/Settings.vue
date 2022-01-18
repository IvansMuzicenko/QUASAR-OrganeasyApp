<template>
  <q-page>
    <p class="text-center">Settings</p>
    <a href="https://organeasy.netlify.app/" class="text-h6">Organeasy Web</a>
    <br />
    <q-btn color="red-8" @click="logout()">Logout</q-btn>
  </q-page>
</template>

<script>
export default {
  methods: {
    async logout() {
      await this.$store.dispatch('users/logout')
      this.$q.localStorage.remove('user')
      this.$q.notify({
        position: 'top',
        message: 'Logged out',
        color: 'red',
        timeout: 1000
      })
    }
  }
}
</script>

<style></style>

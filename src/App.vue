<template>
  <router-view />
</template>

<script>
export default {
  beforeCreate() {
    const user = this.$q.localStorage.getItem("user");
    if (user) {
      this.$store.dispatch("users/setUser", user);
    }
  },
};
</script>

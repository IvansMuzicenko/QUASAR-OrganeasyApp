<template>
  <router-view v-if="!loading" />
  <q-inner-loading
    v-else
    :showing="loading"
    label="Please wait..."
    label-class="text-teal"
    label-style="font-size: 1.1em"
  />
</template>

<script>
import { getDatabase, ref, onValue } from "firebase/database";
export default {
  beforeCreate() {
    const user = this.$q.localStorage.getItem("user");
    if (user) {
      this.$store.dispatch("users/setUser", user);

      const db = getDatabase();
      const dbRef = ref(db, user.userId);
      onValue(dbRef, (snapshot) => {
        this.loading = false;
        const data = snapshot.val();
        this.$store.dispatch("users/setUserData", data);
      });
    }
  },
  beforeMount() {
    if (!this.$store.getters["users/email"]) {
      this.$router.push("/auth");
    }
  },
  data() {
    return {
      loading: true,
    };
  },
};
</script>

<template>
  <router-view />
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
};
</script>

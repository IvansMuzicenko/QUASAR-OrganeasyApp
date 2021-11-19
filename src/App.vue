<template>
  <router-view />
</template>

<script>
import {
  getDatabase,
  ref,
  onValue,
  // query,
  // orderByChild,
} from "firebase/database";
export default {
  created() {
    const user = this.$q.localStorage.getItem("user");
    if (user) {
      this.$store.dispatch("users/setUser", user);

      const db = getDatabase();
      const dbRef = ref(db, user.userId); //query(ref(db, user.userId), orderByChild("time")) !sort not working
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

<template>
  <register-form v-if="authMode === 'signUp'">
    <p class="q-ma-lg">
      Already have an account?
      <span class="text-blue cursor-pointer" @click="changeAuthMode()"
        >Sign In!</span
      >
    </p>
  </register-form>
  <login-form v-if="authMode === 'signIn'">
    <p class="q-ma-lg">
      Don't have an account?
      <span class="text-blue cursor-pointer" @click="changeAuthMode()"
        >Sign Up!</span
      >
    </p>
  </login-form>
</template>

<script>
import registerForm from "components/registerForm.vue";
import loginForm from "components/loginForm.vue";

export default {
  components: {
    registerForm,
    loginForm,
  },
  data() {
    return {
      authMode: "signIn",
    };
  },
  beforeMount() {
    if (this.$store.getters["users/email"]) {
      this.$router.push("/");
    }
  },
  methods: {
    changeAuthMode() {
      if (this.authMode === "signIn") {
        this.authMode = "signUp";
      } else {
        this.authMode = "signIn";
      }
    },
  },
};
</script>

<style></style>

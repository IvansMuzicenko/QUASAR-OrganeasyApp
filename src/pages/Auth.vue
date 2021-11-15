<template>
  <register-form v-if="authMode === 'signUp'" />
  <login-form v-if="authMode === 'signIn'" />
  <q-btn @click="changeAuthMode()">{{ authMode }}</q-btn>
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

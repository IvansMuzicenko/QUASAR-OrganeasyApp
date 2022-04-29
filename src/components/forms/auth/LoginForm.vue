<template>
  <div class="q-pa-lg q-mx-auto" style="max-width: 400px">
    <q-form class="q-gutter-md" @submit="onSubmit" @reset="onReset">
      <h6 class="text-center q-ma-sm">Sign In</h6>
      <p v-if="error" class="text-red">
        Incorrect e-mail or password. Try again!
      </p>
      <q-input
        v-model="email"
        filled
        type="email"
        label="E-mail"
        lazy-rules
        :rules="[
          (val) =>
            (val && val.length > 0 && val.includes('@') && val.includes('.')) ||
            'Please type correct e-mail'
        ]"
      />

      <q-input
        v-model="password"
        filled
        :type="isPwd ? 'password' : 'text'"
        label="Password"
        lazy-rules
      >
        <template #append>
          <q-icon
            :name="isPwd ? 'visibility_off' : 'visibility'"
            class="cursor-pointer"
            @click="isPwd = !isPwd"
          />
        </template>
      </q-input>
      <div>
        <q-btn label="Sign In" type="submit" color="primary" />
        <q-btn
          label="Reset"
          type="reset"
          color="primary"
          flat
          class="q-ml-sm"
        />
      </div>
    </q-form>
    <slot />
  </div>
</template>
<script>
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'
const auth = getAuth()

export default {
  data() {
    return {
      email: null,
      password: null,
      error: false,
      isPwd: true
    }
  },

  methods: {
    onSubmit() {
      signInWithEmailAndPassword(auth, this.email, this.password)
        .then((userCredential) => {
          const user = userCredential.user
          this.$q.localStorage.set('user', {
            userId: user.uid,
            email: this.email
          })
          this.$store.dispatch('users/setUser', {
            userId: user.uid,
            email: this.email
          })
          this.$router.push('/')

          this.$q.notify({
            position: 'top',
            message: 'Logged in',
            color: 'green',
            timeout: 1000
          })
        })
        .catch((error) => {
          this.error = true
          const errorCode = error.code
          const errorMessage = error.message
        })
    },

    onReset() {
      this.email = null
      this.password = null
      this.error = false
    }
  }
}
</script>

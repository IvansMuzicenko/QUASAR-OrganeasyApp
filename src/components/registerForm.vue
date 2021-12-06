<template>
  <div class="q-pa-lg q-mx-auto" style="max-width: 400px">
    <q-form class="q-gutter-md" @submit="onSubmit" @reset="onReset">
      <h6 class="q-ma-sm text-center">Sign Up</h6>
      <p v-if="error" class="text-red">E-mail already registered!</p>
      <q-input
        v-model="email"
        filled
        type="e-mail"
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
        :rules="[
          (val) =>
            (val !== null && val !== '' && val.length > 5) ||
            'Password must contain at least 6 symbols'
        ]"
        ><template #append>
          <q-icon
            :name="isPwd ? 'visibility_off' : 'visibility'"
            class="cursor-pointer"
            @click="isPwd = !isPwd"
          />
        </template>
      </q-input>
      <q-input
        v-model="passwordConfirm"
        filled
        :type="isPwd ? 'password' : 'text'"
        label="Confirm password"
        lazy-rules
        :rules="[
          (val) =>
            (val !== null && val === password) || 'Passwords do not match'
        ]"
        ><template #append>
          <q-icon
            :name="isPwd ? 'visibility_off' : 'visibility'"
            class="cursor-pointer"
            @click="isPwd = !isPwd"
          />
        </template>
      </q-input>

      <div>
        <q-btn label="Sign Up" type="submit" color="primary" />
        <q-btn
          label="Reset"
          type="reset"
          color="primary"
          flat
          class="q-ml-sm"
        />
      </div>
    </q-form>
    <slot></slot>
  </div>
</template>
<script>
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth'
const auth = getAuth()

export default {
  data() {
    return {
      email: null,
      password: null,
      passwordConfirm: null,
      error: false,
      isPwd: true
    }
  },

  methods: {
    onSubmit() {
      createUserWithEmailAndPassword(auth, this.email, this.password)
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
          this.$router.go('/')
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

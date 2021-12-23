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
import { getDatabase, ref, onValue } from 'firebase/database'
import { App as CapacitorApp } from '@capacitor/app'

export default {
  data() {
    return {
      loading: true
    }
  },
  computed: {
    user() {
      return this.$store.getters['users/userId']
    }
  },
  watch: {
    user() {
      if (this.user) {
        const db = getDatabase()
        const dbRef = ref(db, this.user)
        onValue(dbRef, (snapshot) => {
          const data = snapshot.val()
          this.$store.dispatch('users/setUserData', data)
          this.loading = false
          this.capacitor()
        })
      }
    }
  },
  beforeMount() {
    CapacitorApp.addListener('backButton', () => {
      if (this.$route.path == '/auth') {
        CapacitorApp.exitApp()
      }
    })

    const user = this.$q.localStorage.getItem('user')

    if (user) {
      this.$store.dispatch('users/setUser', user)
    } else {
      this.$router.push('/auth')
      this.loading = false
    }

    if (this.$q.platform.is.capacitor) {
      this.$store.dispatch('notification/setCapacitor', this.$q.capacitor)
    }
  },
  methods: {
    capacitor() {
      if (this.$q.platform.is.capacitor) {
        this.$store.dispatch('notification/addNotifications')
      }
    }
  }
}
</script>

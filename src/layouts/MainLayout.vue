<template>
  <q-layout view="LHh Lpr lFf">
    <app-header @drawer-click="toggleLeftDrawer" />

    <app-side-bar
      :left-drawer-open="leftDrawerOpen"
      @state-changed="stateChanged"
    />

    <app-footer />

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import AppHeader from 'src/components/common/layout/AppHeader.vue'
import AppSideBar from 'src/components/common/layout/AppSideBar.vue'
import AppFooter from 'src/components/common/layout/AppFooter.vue'

export default {
  components: {
    AppHeader,
    AppSideBar,
    AppFooter
  },
  data() {
    return {
      leftDrawerOpen: false
    }
  },
  methods: {
    toggleLeftDrawer() {
      this.leftDrawerOpen = !this.leftDrawerOpen
    },
    stateChanged(value) {
      this.leftDrawerOpen = value
    }
  }
}
</script>

<style lang="scss">
.activeLink {
  color: rgb(50, 115, 255);
}
</style>

<template>
  <q-layout view="LHh Lpr lFf">
    <q-pull-to-refresh
      style="height: 3rem; z-index: 1000"
      class="absolute full-width"
      @refresh="reload"
    />

    <app-header @drawerClick="toggleLeftDrawer" />

    <app-side-bar
      :left-drawer-open="leftDrawerOpen"
      @stateChanged="stateChanged"
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
    reload(done) {
      location.reload()
      done()
    },
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

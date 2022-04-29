<template>
  <q-header elevated class="gt-xs bg-orange-4">
    <q-toolbar>
      <q-btn
        flat
        dense
        round
        icon="menu"
        aria-label="Menu"
        @click="toggleLeftDrawer"
      />

      <q-toolbar-title>Organeasy</q-toolbar-title>
    </q-toolbar>
  </q-header>
</template>

<script>
export default {
  emits: ['drawerClick'],
  methods: {
    toggleLeftDrawer() {
      this.$emit('drawerClick')
    }
  }
}
</script>

<style></style>

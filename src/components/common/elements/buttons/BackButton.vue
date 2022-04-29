<template>
  <q-btn icon="arrow_back" flat class="zindex-high" @click="goBack()" />
</template>

<script>
export default {
  methods: {
    goBack() {
      const routePath = this.$route.path
      if (Object.keys(this.$route.query).length)
        return this.$router.push(routePath)

      const newPath = routePath.slice(0, routePath.lastIndexOf('/'))
      if (this.$route.params.date)
        return this.$router.push(`/?date=${this.$route.params.date}`)

      this.$router.push(newPath || '/')
    }
  }
}
</script>

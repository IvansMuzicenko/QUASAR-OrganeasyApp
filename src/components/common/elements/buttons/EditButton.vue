<template>
  <q-btn
    :class="zIndex ? 'zindex-high' : ''"
    icon="edit"
    color="secondary"
    :flat="flat"
    @click="toggleEdit()"
  >
    Edit
  </q-btn>
</template>

<script>
export default {
  props: {
    flat: {
      type: Boolean,
      required: false,
      default: false
    },
    zIndex: {
      type: Boolean,
      required: false,
      default: false
    },
    path: {
      type: String,
      required: false,
      default: ''
    }
  },
  methods: {
    toggleEdit() {
      this.$router.push((this.path || this.$route.path) + '?edit=true')
    }
  }
}
</script>

<template>
  <q-btn
    icon="edit"
    color="secondary"
    :dense="dense || topBar"
    :flat="flat || topBar"
    :class="zIndex || topBar ? 'zindex-high' : ''"
    @click="toggleEdit()"
  >
    Edit
  </q-btn>
</template>

<script>
export default {
  props: {
    topBar: {
      type: Boolean,
      required: false,
      default: false
    },
    dense: {
      type: Boolean,
      required: false,
      default: false
    },
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

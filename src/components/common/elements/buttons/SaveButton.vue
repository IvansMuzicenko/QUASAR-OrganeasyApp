<template>
  <q-btn
    icon="save"
    color="positive"
    :dense="dense || topBar"
    :flat="flat || topBar"
    :class="zIndex || topBar ? 'zindex-high' : ''"
    :disable="error"
    @click="saveClick()"
  >
    Save
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
    error: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  emits: ['saveEvent'],
  methods: {
    saveClick() {
      this.$emit('saveEvent')
    }
  }
}
</script>

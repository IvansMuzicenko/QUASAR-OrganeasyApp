<template>
  <q-btn
    icon="save"
    :dense="dense"
    :flat="dense"
    :class="zIndex ? 'zindex-high' : ''"
    :disable="error"
    color="positive"
    @click="saveClick()"
  >
    Save
  </q-btn>
</template>
<script>
export default {
  props: {
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

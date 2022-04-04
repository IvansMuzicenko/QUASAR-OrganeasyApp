<template>
  <q-btn
    :class="zIndex ? 'zindex-high' : ''"
    icon="save"
    color="positive"
    :dense="dense"
    :flat="flat"
    :disable="error"
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

<template>
  <q-btn
    icon="stop"
    color="red"
    :dense="dense || topBar"
    :flat="flat || topBar"
    :class="zIndex || topBar ? 'zindex-high' : ''"
    @click="continuousStop"
  >
    Stop
  </q-btn>
</template>
<script>
import { getDatabase, ref, update } from 'firebase/database'
const db = getDatabase()

export default {
  props: {
    path: {
      type: String,
      required: true
    },
    flat: {
      type: Boolean,
      required: false,
      default: false
    },
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
    zIndex: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  emits: ['updateData'],
  methods: {
    continuousStop() {
      update(ref(db, `${this.$store.getters['users/userId']}/${this.path}`), {
        continuousEnded: Date.now()
      })
      this.$emit('updateData')
    }
  }
}
</script>

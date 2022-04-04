<template>
  <q-btn
    :class="zIndex ? 'zindex-high' : ''"
    icon="play_arrow"
    color="green"
    :dense="dense"
    :flat="flat"
    @click="continuousStart"
  >
    Start
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
    continuousStart() {
      update(ref(db, `${this.$store.getters['users/userId']}/${this.path}`), {
        continuousStarted: Date.now()
      })
      this.$emit('updateData')
    }
  }
}
</script>

<template>
  <q-btn
    icon="content_copy"
    color="secondary"
    :dense="dense"
    :flat="flat"
    :class="zIndex ? 'zindex-high' : ''"
    @click="copyTask()"
  >
    Copy
  </q-btn>
</template>
<script>
import AddTask from 'src/components/common/dialogs/AddTask.vue'
import AddFreeTask from 'src/components/common/dialogs/AddFreeTask.vue'

export default {
  props: {
    task: {
      type: Object,
      required: true
    },
    type: {
      type: String,
      required: true
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
    }
  },
  methods: {
    copyTask() {
      this.$q.dialog({
        component: this.type == 'task' ? AddTask : AddFreeTask,
        componentProps: {
          copy: this.task
        }
      })
    }
  }
}
</script>

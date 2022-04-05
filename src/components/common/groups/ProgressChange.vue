<template>
  <q-btn
    :icon="item['progress'] ? 'close' : 'check'"
    :color="item['progress'] ? 'red' : 'positive'"
    :dense="dense || topBar"
    :flat="flat || topBar"
    :class="zIndex || topBar ? 'zindex-high' : ''"
    @click="changeProgress()"
  >
    {{ item['progress'] ? 'Undone' : 'Done' }}
  </q-btn>

  <q-dialog ref="confirmationDialog" @hide="onConfirmationDialogHide">
    <q-card class="q-dialog-plugin">
      <q-card-section>
        You have uncompleted subtasks. Do you want to complete all subtasks too?
      </q-card-section>
      <q-card-actions align="right">
        <q-btn color="positive" label="Done all" @click="onDoneAllClick" />
        <q-btn
          color="secondary"
          label="Done task only"
          @click="changeProgress(true)"
        />
        <q-btn
          color="primary"
          label="Cancel"
          @click="onConfirmationDialogHide"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { getDatabase, ref, update } from 'firebase/database'
const db = getDatabase()

export default {
  props: {
    item: {
      type: Object,
      required: true
    },
    type: {
      type: String,
      required: true
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
  emits: ['updateData'],
  methods: {
    changeProgress(strictMode = false) {
      const subtasks = this.item.subtasks
      let path = ''
      if (this.type == 'task') {
        path = `tasks/date-${this.item.time.slice(
          0,
          this.item.time.indexOf(' ')
        )}/id-${this.item.id}`
      } else if (this.type == 'free-task') {
        path = `freeTasks/id-${this.item.id}`
      }

      if (
        !this.item.progress &&
        !strictMode &&
        subtasks &&
        subtasks.length &&
        subtasks.some(
          (el) =>
            !el['progress'] ||
            (el['subtasks'] &&
              el['subtasks'].some((subEl) => !subEl['progress']))
        )
      ) {
        this.$refs['confirmationDialog'].show()
      } else {
        update(ref(db, `${this.$store.getters['users/userId']}/${path}`), {
          progress: !this.item.progress,
          finishedDate: !this.item.progress ? Date.now() : null
        })
        this.onConfirmationDialogHide()
        this.updateData()
      }
    },
    onDoneAllClick() {
      const subtasks = JSON.parse(JSON.stringify(this.item.subtasks))
      let path = ''
      if (this.type == 'task') {
        path = `tasks/date-${this.item.time.slice(
          0,
          this.item.time.indexOf(' ')
        )}/id-${this.item.id}`
      } else if (this.type == 'free-task') {
        path = `freeTasks/id-${this.item.id}`
      }

      subtasks.forEach((subtask) => {
        subtask.progress = true
        if (subtask.subtasks && subtask.subtasks.length) {
          subtask.subtasks.forEach((subSubtask) => (subSubtask.progress = true))
        }
      })
      update(ref(db, `${this.$store.getters['users/userId']}/${path}`), {
        progress: !this.item.progress,
        finishedDate: !this.item.progress ? Date.now() : null,
        subtasks: subtasks
      })
      this.onConfirmationDialogHide()
      this.updateData()
    },
    onConfirmationDialogHide() {
      this.$refs['confirmationDialog'].hide()
    },
    updateData() {
      this.$emit('updateData')
    }
  }
}
</script>

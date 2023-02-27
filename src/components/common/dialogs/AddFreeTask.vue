<template>
  <q-dialog ref="dialog" @hide="onDialogHide">
    <free-task-form
      :copy="copy"
      @confirm-event="onOKClick"
      @cancel-event="onCancelClick"
    />
  </q-dialog>
</template>

<script>
import { date } from 'quasar'
import { getDatabase, ref, set } from 'firebase/database'
import FreeTaskForm from 'src/components/forms/FreeTaskForm.vue'
import generateId from 'src/idGenerator.js'

const db = getDatabase()

export default {
  components: {
    FreeTaskForm
  },

  props: {
    copy: {
      type: Object,
      required: false,
      default: null
    }
  },

  emits: ['ok', 'hide'],

  methods: {
    show() {
      this.$refs.dialog.show()
    },

    hide() {
      this.$refs.dialog.hide()
    },

    onDialogHide() {
      this.$emit('hide')
    },

    onOKClick(form) {
      const newTodo = {
        id: generateId(),
        title: form.todoTitle,
        priority: form.priority,
        progress: form.progress,
        continuous: form.continuousState,
        notes: form.toggleNotes ? form.notes : null,
        location: form.toggleLocation ? form.eventLocation : null,
        subtasks: form.toggleSubtasks ? form.subtasks : null,
        category: form.category || null,
        dateModified: Date.now(),
        finishedDate: form.progress ? Date.now() : null
      }

      set(
        ref(
          db,
          `${this.$store.getters['users/userId']}/freeTasks/id-${newTodo.id}/`
        ),
        newTodo
      )

      this.$emit('ok')

      this.hide()

      this.$q.notify({
        position: 'top',
        message: 'Task added',
        color: 'green',
        timeout: 1000
      })
    },

    onCancelClick() {
      this.hide()
    }
  }
}
</script>

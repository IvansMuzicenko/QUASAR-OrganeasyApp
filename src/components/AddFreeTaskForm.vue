<template>
  <q-dialog ref="dialog" @hide="onDialogHide">
    <free-task-form @OKEvent="onOKClick" @cancelEvent="onCancelClick" />
  </q-dialog>
</template>

<script>
import { date } from 'quasar'
import { getDatabase, ref, set } from 'firebase/database'
import FreeTaskForm from 'src/components/FreeTaskForm.vue'

const db = getDatabase()

export default {
  components: {
    FreeTaskForm
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
        id: form.todoTitle.replaceAll(' ', '-'),
        title: form.todoTitle,
        priority: form.priority,
        progress: form.progress,
        continuous: form.continuousState,
        notes: form.toggleNotes ? form.notes : null,
        subtasks: form.toggleSubtasks ? form.subtasks : null,
        dateModified: Date.now()
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

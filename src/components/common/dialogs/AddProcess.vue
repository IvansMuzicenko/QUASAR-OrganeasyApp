<template>
  <q-dialog ref="dialog" @hide="onDialogHide">
    <process-form @OKEvent="onOKClick" @cancelEvent="onCancelClick" />
  </q-dialog>
</template>

<script>
import { getDatabase, ref, set } from 'firebase/database'

import generateId from 'src/idGenerator.js'
import ProcessForm from 'src/components/forms/ProcessForm.vue'

const db = getDatabase()

export default {
  components: {
    ProcessForm
  },
  emits: ['ok', 'hide'],
  computed: {
    error() {
      return !this.processTitle || this.processTime <= 0
    }
  },

  methods: {
    show() {
      this.$refs.dialog.show()
    },

    onDialogHide() {
      this.$emit('hide')
    },

    onOKClick(form) {
      const newProcess = {
        id: generateId(),
        title: form.title,
        time: form.time
      }
      set(
        ref(
          db,
          `${this.$store.getters['users/userId']}/processes/id-${newProcess.id}`
        ),
        newProcess
      )
      this.$emit('ok')

      this.onDialogHide()
      this.$q.notify({
        position: 'top',
        message: 'Process added',
        color: 'green',
        timeout: 1000
      })
    },

    onCancelClick() {
      this.onDialogHide()
    }
  }
}
</script>

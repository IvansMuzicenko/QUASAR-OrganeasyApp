<template>
  <q-dialog ref="dialog" @hide="onDialogHide">
    <issue-form @confirm-event="onOKClick" @cancel-event="onCancelClick" />
  </q-dialog>
</template>

<script>
import { date } from 'quasar'
import { getDatabase, ref, set } from 'firebase/database'
import IssueForm from 'src/components/forms/IssueForm.vue'
import generateId from 'src/idGenerator.js'

const db = getDatabase()

export default {
  components: {
    IssueForm
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
      console.log(form)
      // this.$emit('ok')

      // this.hide()

      // this.$q.notify({
      //   position: 'top',
      //   message: 'Time log added',
      //   color: 'green',
      //   timeout: 1000
      // })
    },

    onCancelClick() {
      this.hide()
    }
  }
}
</script>

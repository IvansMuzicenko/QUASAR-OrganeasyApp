<template>
  <q-dialog ref="dialog" @hide="onDialogHide">
    <log-process-form
      :edit-log-process="editLogProcess"
      @confirm-event="onOKClick"
      @save-event="onOKClick"
      @cancel-event="onCancelClick"
    />
  </q-dialog>
</template>

<script>
import { getDatabase, ref, set } from 'firebase/database'
import LogProcessForm from 'src/components/forms/LogProcessForm.vue'
import generateId from 'src/idGenerator.js'

const db = getDatabase()

export default {
  components: {
    LogProcessForm
  },
  props: {
    editLogProcess: {
      type: Object,
      required: false,
      default: null
    },
    selectOnSave: {
      type: Boolean,
      required: false,
      default: false
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
      form.id = form.id ?? generateId()
      set(
        ref(
          db,
          `${this.$store.getters['users/userId']}/logProcesses/id-${form['id']}`
        ),
        form
      )
      this.$emit('ok', this.selectOnSave ? form.id : false)

      this.hide()

      this.$q.notify({
        position: 'top',
        message: 'Log Process added',
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

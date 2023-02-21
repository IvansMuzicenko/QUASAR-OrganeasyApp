<template>
  <q-dialog ref="dialog" @hide="onDialogHide">
    <time-log-form
      :exact-date="exactDate"
      :exact-time="exactTime"
      @OKEvent="onOKClick"
      @cancelEvent="onCancelClick"
    />
  </q-dialog>
</template>

<script>
import { date } from 'quasar'
import { getDatabase, ref, set } from 'firebase/database'
import TimeLogForm from 'src/components/forms/TimeLogForm.vue'
import generateId from 'src/idGenerator.js'

const db = getDatabase()

export default {
  components: {
    TimeLogForm
  },
  props: {
    exactDate: {
      type: Date,
      required: false,
      default: null
    },
    exactTime: {
      type: Date,
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

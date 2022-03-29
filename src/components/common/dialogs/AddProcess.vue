<template>
  <q-dialog ref="dialog" @hide="onDialogHide">
    <q-card class="q-dialog-plugin">
      <p class="text-center text-subtitle1 no-margin">
        New process
        <q-btn
          icon="close"
          class="absolute-top-right"
          flat
          dense
          @click="onCancelClick"
        />
      </p>
      <q-card-section>
        <q-input
          v-model="processTitle"
          bottom-slots
          label="Title"
          :dense="false"
        />
        <q-input
          v-model.number="processTime"
          bottom-slots
          type="number"
          label="Time"
          suffix="Minutes"
          min="1"
          :dense="false"
        />
      </q-card-section>
      <q-card-section v-if="error">
        <p class="text-negative">
          Title must not be empty and time must be greater than 0
        </p>
      </q-card-section>
      <q-card-actions align="right">
        <q-btn
          color="positive"
          :disable="error"
          label="OK"
          @click="onOKClick"
        />
        <q-btn color="primary" label="Cancel" @click="onCancelClick" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { getDatabase, ref, set } from 'firebase/database'
import generateId from 'src/idGenerator.js'

export default {
  props: {},

  emits: ['ok', 'hide'],
  data() {
    return {
      processTitle: '',
      processTime: 1
    }
  },
  computed: {
    error() {
      return !this.processTitle || this.processTime <= 0
    }
  },

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

    onOKClick() {
      const newProcess = {
        id: generateId(),
        title: this.processTitle,
        time: this.processTime
      }
      const db = getDatabase()
      set(
        ref(
          db,
          `${this.$store.getters['users/userId']}/processes/id-${newProcess.id}`
        ),
        newProcess
      )
      this.$emit('ok')

      this.hide()
      this.$q.notify({
        position: 'top',
        message: 'Process added',
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

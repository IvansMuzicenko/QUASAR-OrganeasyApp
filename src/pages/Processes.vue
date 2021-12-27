<template>
  <q-page>
    <q-card class="flex">
      <q-btn
        icon="arrow_back"
        flat
        class="absolute"
        @click="$router.push('/')"
      />
      <p class="text-center text-h6 full-width">Processes</p>
    </q-card>
    <div v-if="!Object.keys(processes).length">
      <p>You have not processes!</p>
      <q-btn color="secondary" @click="addProcess()">Add process</q-btn>
    </div>
    <q-list v-else separator bordered>
      <q-item
        v-for="(process, index) in processes"
        :key="index"
        clickable
        @click="editProcess(process)"
      >
        <q-item-section>{{ process['title'] }}</q-item-section>
        <q-separator vertical />
        <q-item-section side>{{ process['time'] }} minutes</q-item-section>
      </q-item>
    </q-list>

    <q-dialog ref="dialog" @hide="onDialogHide">
      <q-card class="q-dialog-plugin">
        <q-card-section>
          <q-input
            v-model="selectedProcess.title"
            bottom-slots
            label="Title"
            :dense="false"
          >
          </q-input>
          <q-input
            v-model.number="selectedProcess.time"
            bottom-slots
            type="number"
            label="Time"
            suffix="Minutes"
            min="1"
            :dense="false"
          >
          </q-input>
        </q-card-section>
        <q-card-section v-if="error">
          <p class="text-negative">
            Title must not be empty and time must be greater than 0
          </p>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn
            color="positive"
            icon="save"
            :disable="error"
            label="Save"
            @click="onOKClick"
          />
          <q-btn color="primary" label="Cancel" @click="onCancelClick" />
          <q-btn color="negative" label="Delete" @click="onDeleteClick" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog ref="confirmDialog" @hide="onConfirmDialogHide">
      <q-card class="q-dialog-plugin">
        <q-card-section>
          Are you sure to premanently remove '{{ selectedProcess.title }}'
          process?
        </q-card-section>
        <q-card-actions align="right">
          <q-btn color="primary" label="Cancel" @click="onConfirmCancelClick" />
          <q-btn
            color="negative"
            icon="delete"
            label="Delete"
            @click="onConfirmDeleteClick"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import addProcessForm from 'src/components/AddProcessForm.vue'
import { getDatabase, ref, update, remove } from 'firebase/database'

const db = getDatabase()

export default {
  emits: ['ok', 'hide'],
  data() {
    return {
      selectedProcess: {
        id: '',
        title: '',
        time: 1
      }
    }
  },
  computed: {
    error() {
      return !this.selectedProcess.title || this.selectedProcess.time <= 0
    },
    processes() {
      return this.$store.getters['users/processes']
    }
  },
  methods: {
    addProcess() {
      this.$q.dialog({
        component: addProcessForm
      })
    },
    editProcess(process) {
      this.show()
      this.selectedProcess = JSON.parse(JSON.stringify(process))
    },
    show() {
      this.$refs.dialog.show()
    },

    hide() {
      this.$refs.dialog.hide()
    },

    onDialogHide() {
      this.$emit('hide')
    },
    onConfirmDialogHide() {
      this.$emit('hide')
    },

    onOKClick() {
      const processChanges = {
        id: this.selectedProcess.id,
        title: this.selectedProcess.title,
        time: this.selectedProcess.time
      }

      update(
        ref(
          db,
          `${this.$store.getters['users/userId']}/processes/id-${this.selectedProcess.id}`
        ),
        processChanges
      )

      this.$emit('ok')

      this.hide()

      this.$q.notify({
        position: 'top',
        message: 'Process edited',
        color: 'blue',
        timeout: 1000
      })
    },

    onCancelClick() {
      this.hide()
    },
    onConfirmCancelClick() {
      this.$refs.confirmDialog.hide()
    },
    onDeleteClick() {
      this.$refs.confirmDialog.show()
    },
    onConfirmDeleteClick() {
      remove(
        ref(
          db,
          `${this.$store.getters['users/userId']}/processes/id-${this.selectedProcess.id}`
        )
      )
      this.$refs.confirmDialog.hide()
      this.hide()
      this.$q.notify({
        position: 'top',
        message: 'Process removed',
        color: 'red',
        timeout: 1000
      })
    }
  }
}
</script>

<style></style>

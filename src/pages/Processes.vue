<template>
  <q-page>
    <q-card class="q-py-sm">
      <p class="text-center text-h6 full-width no-margin">Processes</p>
      <q-card-section class="flex justify-between no-padding">
        <q-card-section class="no-padding">
          <back-button />
        </q-card-section>
        <q-card-section class="no-padding">
          <filter-sort
            :items="processesArray"
            type="processes"
            @update-data="(modifiedItems) => (processes = modifiedItems)"
          />
        </q-card-section>
      </q-card-section>
    </q-card>

    <q-list separator bordered>
      <q-item
        v-for="(process, index) of processes"
        :key="index"
        clickable
        @click="editProcess(process)"
      >
        <q-item-section>{{ process['title'] }}</q-item-section>
        <q-separator vertical />
        <q-item-section side>{{ process['time'] }} minutes</q-item-section>
      </q-item>
    </q-list>

    <div class="text-center q-my-md">
      <p v-if="!Object.keys(processes).length">You have not processes!</p>
      <q-btn color="secondary" @click="addProcess()">Add process</q-btn>
    </div>

    <q-dialog ref="editDialog" @hide="onDialogHide">
      <process-form
        :edit-process="selectedProcess"
        @cancel-event="onDialogHide"
        @save-event="onOKClick"
        @delete-event="onDialogHide"
      />
    </q-dialog>
  </q-page>
</template>

<script>
import { getDatabase, ref, update, remove } from 'firebase/database'

import AddProcess from 'src/components/common/dialogs/AddProcess.vue'
import ProcessForm from 'src/components/forms/ProcessForm.vue'

import FilterSort from 'src/components/common/groups/FilterSort.vue'

import BackButton from 'src/components/common/elements/buttons/BackButton.vue'

const db = getDatabase()

export default {
  components: {
    ProcessForm,
    BackButton,
    FilterSort
  },
  data() {
    return {
      processes: [],
      selectedProcess: {
        id: '',
        title: '',
        time: 1
      }
    }
  },
  computed: {
    processesArray() {
      const vuexProcesses = this.$store.getters['users/processes']
      let processes = []

      if (vuexProcesses) {
        for (const vuexProcess in vuexProcesses) {
          processes.push(vuexProcesses[vuexProcess])
        }
      }
      return processes
    }
  },
  methods: {
    addProcess() {
      this.$q.dialog({
        component: AddProcess
      })
    },
    editProcess(process) {
      this.selectedProcess = JSON.parse(JSON.stringify(process))
      this.$refs.editDialog.show()
    },

    onDialogHide() {
      this.$refs.editDialog.hide()
    },

    onOKClick(form) {
      const processChanges = {
        id: form.id,
        title: form.title,
        time: form.time
      }

      update(
        ref(
          db,
          `${this.$store.getters['users/userId']}/processes/id-${form.id}`
        ),
        processChanges
      )

      this.recalculatePreparationTime(form.id)

      this.onDialogHide()

      this.$q.notify({
        position: 'top',
        message: 'Process edited',
        color: 'blue',
        timeout: 1000
      })
    },
    recalculatePreparationTime(processId) {
      const vuexTasks = this.$store.getters['users/tasks']
      for (const vuexDate in vuexTasks) {
        for (const vuexTask in vuexTasks[vuexDate]) {
          const task = vuexTasks[vuexDate][vuexTask]
          if (task.processes) {
            const taskProcesses = task.processes
            if (taskProcesses.find((el) => el.id == processId)) {
              const processes = this.$store.getters['users/processes']
              let time = 0
              if (Object.keys(processes).length) {
                for (const select in taskProcesses) {
                  for (const process in processes) {
                    if (
                      taskProcesses[select]['id'] == processes[process]['id']
                    ) {
                      time += processes[process]['time']
                    }
                  }
                }
              }
              update(
                ref(
                  db,
                  `${
                    this.$store.getters['users/userId']
                  }/tasks/date-${task.time.slice(
                    0,
                    task.time.indexOf(' ')
                  )}/id-${task.id}`
                ),
                {
                  processesTime: time
                }
              )
            }
          }
        }
      }
    }
  }
}
</script>

<style></style>

<template>
  <q-page>
    <q-card class="q-py-sm">
      <p class="text-center text-h6 full-width no-margin">Processes</p>
      <q-card-section class="flex justify-between no-padding">
        <q-card-section class="no-padding">
          <q-btn
            icon="arrow_back"
            flat
            class="absolute zindex-high"
            @click="$router.push('/')"
          />
        </q-card-section>
        <q-card-section class="no-padding">
          <q-btn icon="tune" class="zindex-high" flat>
            <q-popup-proxy>
              <q-card>
                <q-card-section class="text-subtitle1">
                  <q-icon name="sort" />
                  Sort
                </q-card-section>
                <q-card-section>
                  <q-btn
                    :icon="
                      sorting.title == 'none'
                        ? 'last_page'
                        : sorting.title == 'asc'
                        ? 'vertical_align_bottom'
                        : 'vertical_align_top'
                    "
                    class="full-width"
                    @click="sortByTitle"
                  >
                    Title
                  </q-btn>
                  <q-separator />
                  <q-btn
                    :icon="
                      sorting.time == 'none'
                        ? 'last_page'
                        : sorting.time == 'asc'
                        ? 'vertical_align_bottom'
                        : 'vertical_align_top'
                    "
                    class="full-width"
                    @click="sortByTime"
                  >
                    Time
                  </q-btn>
                </q-card-section>
              </q-card>
            </q-popup-proxy>
          </q-btn>
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

    <q-dialog ref="dialog" @hide="onDialogHide">
      <process-form
        :edit-process="selectedProcess"
        @cancelEvent="onCancelClick"
        @editEvent="onOKClick"
        @deleteEvent="onDeleteClick"
      />
    </q-dialog>
  </q-page>
</template>

<script>
import { getDatabase, ref, update, remove } from 'firebase/database'
import AddProcess from 'src/components/common/dialogs/AddProcess.vue'
import ProcessForm from 'src/components/forms/ProcessForm.vue'

const db = getDatabase()

export default {
  components: {
    ProcessForm
  },
  data() {
    return {
      selectedProcess: {
        id: '',
        title: '',
        time: 1
      },
      sorting: {
        title: 'none',
        time: 'asc'
      }
    }
  },
  computed: {
    processes() {
      const vuexProcesses = this.$store.getters['users/processes']
      let processes = []

      if (vuexProcesses) {
        for (const vuexProcess in vuexProcesses) {
          processes.push(vuexProcesses[vuexProcess])
        }
        processes.sort((a, b) => {
          if (this.sorting.title != 'none') {
            if (this.sorting.title == 'asc') {
              if (a.title.toLowerCase() > b.title.toLowerCase()) return 1
              if (a.title.toLowerCase() < b.title.toLowerCase()) return -1
              return 0
            } else {
              if (a.title.toLowerCase() < b.title.toLowerCase()) return 1
              if (a.title.toLowerCase() > b.title.toLowerCase()) return -1
              return 0
            }
          } else if (this.sorting.time != 'none') {
            if (this.sorting.time == 'asc') {
              return a.time - b.time
            } else {
              return b.time - a.time
            }
          }
        })
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
      this.$refs.dialog.show()
    },

    onDialogHide() {
      this.$refs.dialog.hide()
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

    onCancelClick() {
      this.onDialogHide()
    },

    sortByTitle() {
      this.sorting.time = 'none'
      this.sorting.title = this.sorting.title == 'asc' ? 'desc' : 'asc'
    },
    sortByTime() {
      this.sorting.title = 'none'
      this.sorting.time = this.sorting.time == 'asc' ? 'desc' : 'asc'
    },
    onDeleteClick(id) {
      this.deleteExists(id)
      remove(
        ref(db, `${this.$store.getters['users/userId']}/processes/id-${id}`)
      )
      this.onDialogHide()
      this.$q.notify({
        position: 'top',
        message: 'Process removed',
        color: 'red',
        timeout: 1000
      })
    },
    deleteExists(processId) {
      const vuexTasks = this.$store.getters['users/tasks']
      for (const vuexDate in vuexTasks) {
        for (const vuexTask in vuexTasks[vuexDate]) {
          const task = vuexTasks[vuexDate][vuexTask]
          if (task.processes) {
            const taskProcesses = task.processes
            if (taskProcesses.find((el) => el.id == processId)) {
              let processesArray = []
              taskProcesses.forEach((el) => processesArray.push(el))

              processesArray.splice(
                processesArray.indexOf(
                  taskProcesses.find((el) => el.id == processId)
                ),
                1
              )
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
                  processes: processesArray,
                  processesTime:
                    task.processesTime -
                    this.$store.getters['users/processes'][`id-${processId}`][
                      'time'
                    ]
                }
              )
            }
          }
        }
      }
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

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
      <q-card class="q-dialog-plugin">
        <q-card-section>
          <q-input
            v-model="selectedProcess.title"
            bottom-slots
            label="Title"
            :dense="false"
          />
          <q-input
            v-model.number="selectedProcess.time"
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
import AddProcess from 'src/components/common/dialogs/AddProcess.vue'
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
      },
      sorting: {
        title: 'none',
        time: 'asc'
      }
    }
  },
  computed: {
    error() {
      return !this.selectedProcess.title || this.selectedProcess.time <= 0
    },
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
      this.show()
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

      this.recalculatePreparationTime(this.selectedProcess.id)

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
    sortByTitle() {
      this.sorting.time = 'none'
      this.sorting.title = this.sorting.title == 'asc' ? 'desc' : 'asc'
    },
    sortByTime() {
      this.sorting.title = 'none'
      this.sorting.time = this.sorting.time == 'asc' ? 'desc' : 'asc'
    },
    onConfirmDeleteClick() {
      this.deleteExists(this.selectedProcess.id)
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

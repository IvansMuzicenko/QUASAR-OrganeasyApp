<template>
  <q-btn
    color="negative"
    icon="delete"
    :round="small"
    :dense="dense || topBar"
    :flat="flat || topBar || small"
    :class="zIndex || topBar ? 'zindex-high' : ''"
    @click.prevent.stop="deleteClick()"
  >
    {{ small ? '' : 'Delete' }}
  </q-btn>

  <q-dialog ref="itemRemoveDialog" @hide="onItemRemoveDialogHide">
    <q-card class="q-dialog-plugin">
      <q-card-section>
        Are you sure to premanently remove '{{ item.title }}' {{ type }}?
      </q-card-section>
      <q-card-actions align="right">
        <q-btn color="negative" label="Delete" @click="onConfirmDeleteClick" />
        <q-btn
          v-if="type == 'task' && relativeItems.length - 1 > 0"
          color="negative"
          :label="`Delete all related(${relativeItems.length - 1})`"
          @click="onConfirmDeleteClick(true)"
        />
        <q-btn color="primary" label="Cancel" @click="onItemRemoveDialogHide" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
<script>
import { getDatabase, ref, remove, update } from 'firebase/database'

const db = getDatabase()

export default {
  props: {
    item: {
      type: Object,
      required: true
    },
    type: {
      type: String,
      required: true
    },
    small: {
      type: Boolean,
      required: false,
      default: false
    },
    topBar: {
      type: Boolean,
      required: false,
      default: false
    },
    dense: {
      type: Boolean,
      required: false,
      default: false
    },
    flat: {
      type: Boolean,
      required: false,
      default: false
    },
    zIndex: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  emits: ['deleteEvent'],
  computed: {
    relativeItems() {
      const relationId = this.item.relationId
      let relationArray = []
      if (relationId) {
        const vuexTasks = this.$store.getters['users/tasks']
        for (const vuexDate in vuexTasks) {
          for (const vuexTask in vuexTasks[vuexDate]) {
            const task = vuexTasks[vuexDate][vuexTask]
            if (task && task.relationId && task.relationId == relationId) {
              relationArray.push(task)
            }
          }
        }
      }
      return relationArray
    }
  },
  methods: {
    deleteClick() {
      this.$refs['itemRemoveDialog'].show()
    },
    onItemRemoveDialogHide() {
      this.$refs['itemRemoveDialog'].hide()
    },
    removeItem(path) {
      remove(ref(db, `${this.$store.getters['users/userId']}/${path}`))
      this.onItemRemoveDialogHide()
    },
    onConfirmDeleteClick(removeAll = false) {
      if (this.type == 'task') {
        const notifsToRemove = []
        const itemTime = this.item.time.slice(0, this.item.time.indexOf(' '))
        if (removeAll) {
          for (const relativeItem of this.relativeItems) {
            if (relativeItem.notificationsId) {
              for (const notif of relativeItem.notificationsId) {
                notifsToRemove.push({ id: notif.id })
              }
            }
            const relTime = relativeItem.time
            this.removeItem(
              `tasks/date-${relTime.slice(0, relTime.indexOf(' '))}/id-${
                relativeItem.id
              }`
            )
          }
        } else {
          if (this.item.notificationsId) {
            for (const notif of this.item.notificationsId) {
              notifsToRemove.push({ id: notif.id })
            }
          }
          this.removeItem(`tasks/date-${itemTime}/id-${this.item.id}`)
        }
        if (notifsToRemove.length) {
          this.$store.dispatch(
            'notification/removeNotifications',
            notifsToRemove
          )
        }
        this.$router.push(`/?date=${itemTime}`)
      } else if (this.type == 'free-task') {
        this.removeItem(`freeTasks/id-${this.item.id}`)
        this.$router.push('/free-tasks')
      } else if (this.type == 'note') {
        this.deleteExistsNotes(this.item.id)
        this.removeItem(`notes/id-${this.item.id}`)
        this.$router.push('/notes')
      } else if (this.type == 'category') {
        this.deleteExistsCategories(this.item.id)
        this.removeItem(`categories/id-${this.item.id}`)
      } else if (this.type == 'process') {
        this.deleteExistsProcesses(this.item.id)
        this.removeItem(`processes/id-${this.item.id}`)
      } else if (this.type == 'time-log') {
        this.removeItem(`timeLogs/date-${this.item.date}/id-${this.item.id}`)
      } else if (this.type == 'log-process') {
        this.removeItem(`logProcesses/id-${this.item.id}`)
        this.deleteExistsLogProcesses(this.item.id)
      } else if (this.type == 'log-category') {
        this.removeItem(`logCategories/id-${this.item.id}`)
        this.deleteExistsCategories(this.item.id, true)
      }
      this.removeNotify()
    },
    deleteExistsNotes(noteId) {
      const vuexTasks = this.$store.getters['users/tasks']
      for (const vuexDate in vuexTasks) {
        for (const vuexTask in vuexTasks[vuexDate]) {
          const task = vuexTasks[vuexDate][vuexTask]
          if (task.notes?.attachedNotes) {
            const attachedNotes = task.notes.attachedNotes
            if (attachedNotes.find((el) => el.id == noteId)) {
              let notesArray = []
              attachedNotes.forEach((el) => notesArray.push(el))

              notesArray.splice(
                notesArray.indexOf(attachedNotes.find((el) => el.id == noteId)),
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
                  )}/id-${task.id}/notes`
                ),
                {
                  attachedNotes: notesArray
                }
              )
            }
          }
        }
      }

      const vuexFreeTasks = this.$store.getters['users/freeTasks']
      for (const vuexFreeTask in vuexFreeTasks) {
        const freeTask = vuexFreeTasks[vuexFreeTask]
        if (freeTask.notes?.attachedNotes) {
          const attachedNotes = freeTask.notes.attachedNotes
          if (attachedNotes.find((el) => el.id == noteId)) {
            let notesArray = []
            attachedNotes.forEach((el) => notesArray.push(el))

            notesArray.splice(
              notesArray.indexOf(attachedNotes.find((el) => el.id == noteId)),
              1
            )
            update(
              ref(
                db,
                `${this.$store.getters['users/userId']}/freeTasks/id-${freeTask.id}/notes`
              ),
              {
                attachedNotes: notesArray
              }
            )
          }
        }
      }
    },
    deleteExistsCategories(id, logCategory = false) {
      if (logCategory) {
        const vuexLogProcesses = this.$store.getters['users/logProcesses']
        for (const vuexLogProcess in vuexLogProcesses) {
          const logProcess = vuexLogProcesses[vuexLogProcess]
          if (logProcess.category && logProcess.category == id) {
            remove(
              ref(
                db,
                `${this.$store.getters['users/userId']}/logProcesses/id-${logProcess['id']}/category`
              )
            )
          }
        }
        return
      }
      const vuexFreeTasks = this.$store.getters['users/freeTasks']
      for (const vuexFreeTask in vuexFreeTasks) {
        const freeTask = vuexFreeTasks[vuexFreeTask]
        if (freeTask.category && freeTask.category == id) {
          remove(
            ref(
              db,
              `${this.$store.getters['users/userId']}/freeTasks/id-${freeTask['id']}/category`
            )
          )
        }
      }

      const vuexNotes = this.$store.getters['users/notes']
      for (const vuexNote in vuexNotes) {
        const note = vuexNotes[vuexNote]
        if (note.category && note.category == id) {
          remove(
            ref(
              db,
              `${this.$store.getters['users/userId']}/notes/id-${note['id']}/category`
            )
          )
        }
      }
    },
    deleteExistsLogProcesses(logProcessId) {
      const vuexTimeLogs = this.$store.getters['users/timeLogs']
      for (const vuexTimeLogDate in vuexTimeLogs) {
        const timeLogDates = vuexTimeLogs[vuexTimeLogDate]
        for (const timeLogDate in timeLogDates) {
          const timeLog = timeLogDates[timeLogDate]
          if (timeLog.logProcessId && timeLog.logProcessId == logProcessId) {
            update(
              ref(
                db,
                `${this.$store.getters['users/userId']}/timeLogs/date-${timeLog.date}/id-${timeLog['id']}`
              ),
              { logProcessId: '0' }
            )
          }
        }
      }
    },
    deleteExistsProcesses(processId) {
      const vuexTasks = JSON.parse(
        JSON.stringify(this.$store.getters['users/tasks'])
      )
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

    removeNotify() {
      this.$q.notify({
        position: 'top',
        message: this.type[0].toUpperCase() + this.type.slice(1) + ' removed',
        color: 'red',
        timeout: 1000
      })
      this.$emit('deleteEvent')
    }
  }
}
</script>

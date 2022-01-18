<template>
  <q-page>
    <q-card class="flex justify-between no-padding">
      <q-btn icon="arrow_back" flat class="zindex-high" @click="routerBack()" />
      <q-btn
        v-if="!editState && task['continuous'] && !task['taskStarted']"
        icon="play_arrow"
        color="green"
        flat
        class="zindex-high"
        @click="continuousStart"
      >
        Start
      </q-btn>
      <q-btn
        v-if="
          !editState &&
          task['continuous'] &&
          task['taskStarted'] &&
          !task['taskEnded']
        "
        icon="stop"
        color="red"
        flat
        class="zindex-high"
        @click="continuousStop"
      >
        Stop
      </q-btn>
      <q-btn
        v-if="!editState"
        :icon="task['progress'] ? 'close' : 'check'"
        :color="task['progress'] ? 'red' : 'positive'"
        flat
        class="zindex-high"
        @click="changeProgress"
      >
        {{ task['progress'] ? 'Undone' : 'Done' }}
      </q-btn>
      <q-btn
        v-if="!editState"
        icon="edit"
        color="secondary"
        flat
        class="zindex-high"
        @click="toggleEdit()"
      >
        Edit
      </q-btn>

      <q-btn
        v-if="editState"
        icon="save"
        color="positive"
        flat
        class="zindex-high"
        @click="callEditClick"
      >
        Save
      </q-btn>
      <q-btn
        v-if="editState"
        icon="delete"
        color="negative"
        flat
        class="zindex-high"
        @click="onDeleteClick"
      >
        Delete
      </q-btn>
    </q-card>
    <q-list v-if="!editState" separator bordered>
      <q-item>
        <q-item-section avatar class="taskInfo">Title</q-item-section>
        <q-separator vertical spaced="md" />
        {{ task.title }}
      </q-item>
      <q-item>
        <q-item-section avatar class="taskInfo">Progress</q-item-section>
        <q-separator vertical spaced="md" />
        {{ task.progress ? 'Done' : 'Undone' }}
      </q-item>

      <q-item>
        <q-item-section avatar class="taskInfo">Date</q-item-section>
        <q-separator vertical spaced="md" />
        {{ task.time }}
      </q-item>

      <q-item v-if="task.endingTime">
        <q-item-section avatar class="taskInfo">Ending date</q-item-section>
        <q-separator vertical spaced="md" />
        {{ task.endingTime }}
      </q-item>

      <q-item v-if="task.continuous">
        <q-item-section avatar class="taskInfo">Action</q-item-section>
        <q-separator vertical spaced="md" />
        <q-item-section>
          <q-item-section>
            {{ task.continuous ? 'Continuous' : 'Common' }}
          </q-item-section>
          <q-separator />
          <q-item-section v-if="task.taskStarted && task.taskEnded">
            Spent time : {{ timeSpent }} minutes
          </q-item-section>
          <q-separator />
          <q-item-section v-if="task.taskStarted">
            Started : {{ date(task.taskStarted) }}
          </q-item-section>
          <q-separator />
          <q-item-section v-if="task.taskEnded">
            Ended : {{ date(task.taskEnded) }}
          </q-item-section>
        </q-item-section>
      </q-item>
      <q-item
        v-if="task.notes && (task.notes.text || task.notes.attachedNotes)"
      >
        <q-item-section avatar class="taskInfo">Notes</q-item-section>
        <q-separator vertical spaced="md" />
        <q-item-section>
          <q-item-section v-if="task.notes.attachedNotes">
            <p class="text-center">Attached notes:</p>
            <q-list separator bordered>
              <q-item
                v-for="note of task.notes.attachedNotes"
                :key="note"
                :to="`/notes/${note['id']}`"
              >
                {{ note['title'] }}
              </q-item>
            </q-list>
            <q-separator spaced="sm" />
          </q-item-section>
          <q-item-section v-if="task.notes.text" class="no-margin">
            <p class="text-center">Note:</p>
            <q-card class="q-pa-sm">
              <p v-html="task.notes.text" />
            </q-card>
          </q-item-section>
        </q-item-section>
      </q-item>

      <q-item v-if="task.location">
        <q-item-section avatar class="taskInfo">Location</q-item-section>
        <q-separator vertical spaced="md" />
        <a
          :href="`https://www.google.com/maps/search/${task.location.replace(
            ' ',
            '+'
          )}`"
        >
          {{ task.location }}
        </a>
      </q-item>

      <q-item v-if="task.notifications">
        <q-item-section avatar class="taskInfo">Notifications</q-item-section>
        <q-separator vertical spaced="md" />
        <q-item-section>
          <q-item-section
            v-for="(notification, index) in task.notifications"
            :key="index"
          >
            <q-separator v-if="index > 0" spaced="sm" />
            {{ notification.notificationTimeValuesModel }}
            {{ notification.notificationTimeTypeModel }}
            {{ notification.notificationPeriodModel }}
            {{ notification.notificationPointModel }}
          </q-item-section>
        </q-item-section>
      </q-item>

      <q-item v-if="task.processes">
        <q-item-section avatar class="taskInfo">Processes</q-item-section>
        <q-separator vertical spaced="md" />
        <q-item-section>
          <q-item-section
            v-for="(process, index) in task.processes"
            :key="process"
          >
            <q-separator v-if="index > 0" spaced="sm" />
            {{ process }}
          </q-item-section>
        </q-item-section>
      </q-item>
      <q-item v-if="task.processesTime">
        <q-item-section avatar class="taskInfo">
          Preparation time
        </q-item-section>
        <q-separator vertical spaced="md" />
        <q-item-section>{{ task.processesTime }} minutes</q-item-section>
      </q-item>

      <q-item v-if="task.subtasks">
        <q-item-section avatar class="taskInfo">Subtasks</q-item-section>
        <q-separator vertical spaced="md" />
        <q-item-section>
          <q-item-section
            v-for="(subtask, index) in task.subtasks"
            :key="subtask"
            class="cursor-pointer"
            :class="subtask['progress'] ? 'text-strike' : ''"
            @click="
              changeSubtaskProgress(
                task.id,
                task.time,
                index,
                subtask['progress']
              )
            "
          >
            <q-separator v-if="index > 0" spaced="sm" />
            {{ subtask['title'] }}
          </q-item-section>
        </q-item-section>
      </q-item>

      <q-item v-if="task.repeat">
        <q-item-section avatar class="taskInfo">Repeat</q-item-section>
        <q-separator vertical spaced="md" />
        <q-item-section>
          <q-item-section>
            Repeat number: {{ task.repeat.repeatNumber }}
          </q-item-section>

          <q-item-section v-if="task.repeat.months">
            Months:{{ task.repeat.months }}
          </q-item-section>
          <q-item-section v-if="task.repeat.weeks">
            Weeks:{{ task.repeat.weeks }}
          </q-item-section>
          <q-item-section v-if="task.repeat.days">
            Days:{{ task.repeat.days }}
          </q-item-section>
          <q-item-section v-if="task.repeat.hours">
            Hours:{{ task.repeat.hours }}
          </q-item-section>
          <q-item-section v-if="task.repeat.minutes">
            Minutes:{{ task.repeat.minutes }}
          </q-item-section>
        </q-item-section>
      </q-item>
    </q-list>

    <task-form
      v-if="editState"
      ref="taskForm"
      :edit-task="task"
      @editEvent="onEditClick"
      @cancelEvent="onCancelClick"
      @subtaskEvent="changeSubtaskProgress"
    />
    <q-dialog ref="confirmDialog" @hide="onConfirmDialogHide">
      <q-card class="q-dialog-plugin">
        <q-card-section>
          Are you sure to premanently remove '{{ task.title }}' task?
        </q-card-section>
        <q-card-actions align="right">
          <q-btn color="primary" label="Cancel" @click="onConfirmCancelClick" />
          <q-btn
            color="negative"
            label="Delete"
            @click="onConfirmDeleteClick"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { getDatabase, ref, set, update, remove } from 'firebase/database'
import { date } from 'quasar'
import TaskForm from 'src/components/TaskForm.vue'

const db = getDatabase()

export default {
  components: {
    TaskForm
  },
  emits: ['hide'],
  data() {
    return {
      task: {
        id: '',
        title: '',
        progress: false,
        time: '',
        endingTime: '',
        notes: {
          text: '',
          attachedNotes: []
        },
        location: '',
        notifications: [
          {
            notificationPeriodModel: '',
            notificationPointModel: '',
            notificationTimeTypeModel: '',
            notificationTimeValuesModel: 0
          }
        ],
        notificationsId: [],
        continuous: false,
        taskStarted: '',
        taskEnded: '',
        processes: [],
        processesTime: 0,
        subtasks: [],
        repeat: {
          repeatNumber: 0,
          months: 0,
          weeks: 0,
          days: 0,
          hours: 0,
          minutes: 0
        }
      }
    }
  },
  computed: {
    path() {
      return this.$route.path
    },
    editState() {
      return this.$route.query.edit ? true : false
    },
    timeSpent() {
      if (this.task.taskEnded && this.task.taskStarted) {
        const timeSpent = date.getDateDiff(
          this.task.taskEnded,
          this.task.taskStarted,
          'minutes'
        )
        return timeSpent
      }
      return 0
    }
  },
  watch: {
    path: {
      handler: function () {
        this.updateTaskData()
      },
      immediate: true
    }
  },
  methods: {
    date(ms) {
      return date.formatDate(ms, 'DD-MM-YYYY HH:mm')
    },
    updateTaskData() {
      const taskDate = this.path.slice(
        this.path.indexOf('/') + 1,
        this.path.lastIndexOf('/')
      )
      const taskId = this.path.slice(this.path.lastIndexOf('/') + 1)

      const dayTasks = this.$store.getters['users/tasks'][`date-${taskDate}`]
      if (!dayTasks) {
        return this.$router.push('/')
      }
      const task = dayTasks[`id-${taskId}`]

      if (!task) {
        return this.$router.push('/')
      }
      this.task = JSON.parse(JSON.stringify(task))
    },
    routerBack() {
      return this.$router.push(
        '/?date=' + this.task.time.slice(0, this.task.time.indexOf(' '))
      )
    },
    toggleEdit() {
      this.$router.push(this.path + '?edit=true')
    },
    callEditClick() {
      this.$refs.taskForm.onEditClick()
    },
    changeSubtaskProgress(taskId, taskDate, index, progress) {
      update(
        ref(
          db,
          `${this.$store.getters['users/userId']}/tasks/date-${taskDate.slice(
            0,
            taskDate.indexOf(' ')
          )}/id-${taskId}/subtasks/${index}`
        ),
        { progress: !progress }
      )
      this.updateTaskData()
    },
    onEditClick(form) {
      let eventDate = form.eventDate
      let eventEndingDate = form.eventEndingDate
      for (
        let i = 0;
        i <= (form.toggleRepeat ? form.repeat.repeatNumber : 0);
        i++
      ) {
        if (i != 0) {
          eventDate = date.formatDate(
            date.addToDate(date.extractDate(eventDate, 'DD-MM-YYYY HH:mm'), {
              months: form.repeat.monthsModel,
              days: form.repeat.daysModel + form.repeat.weeksModel * 7,
              hours: form.repeat.hoursModel,
              minutes: form.repeat.minutesModel
            }),
            'DD-MM-YYYY HH:mm'
          )
          if (eventEndingDate) {
            eventEndingDate = date.formatDate(
              date.addToDate(
                date.extractDate(eventEndingDate, 'DD-MM-YYYY HH:mm'),
                {
                  months: form.repeat.monthsModel,
                  days: form.repeat.daysModel + form.repeat.weeksModel * 7,
                  hours: form.repeat.hoursModel,
                  minutes: form.repeat.minutesModel
                }
              ),
              'DD-MM-YYYY HH:mm'
            )
          }
        }
        const updateTodo = {
          id: form.id,
          title: form.todoTitle,
          progress: form.progress,
          time: eventDate,
          endingTime: form.toggleEventEnd ? eventEndingDate : null,
          notes:
            form.toggleNotes &&
            form.notes &&
            (form.notes.text || form.notes.attachedNotes.length)
              ? form.notes
              : null,
          location: form.toggleLocation ? form.eventLocation : null,
          toggleDefaultNotif: form.toggleDefaultNotif,
          notifications: form.toggleNotifications
            ? form.notificationForm
            : null,
          notificationsId: form.notificationsId ? form.notificationsId : null,
          continuous: form.continuousState,
          processes: form.toggleProcesses ? form.processesModel : null,
          processesTime: form.toggleProcesses ? form.processesTime : null,
          subtasks: form.toggleSubtasks ? form.subtasks : null,
          repeat: form.toggleRepeat
            ? {
                repeatNumber: form.repeat.repeatNumber - i,
                months: form.repeat.monthsModel
                  ? form.repeat.monthsModel
                  : null,
                weeks: form.repeat.weeksModel ? form.repeat.weeksModel : null,
                days: form.repeat.daysModel ? form.repeat.daysModel : null,
                hours: form.repeat.hoursModel ? form.repeat.hoursModel : null,
                minutes: form.repeat.minutesModel
                  ? form.repeat.minutesModel
                  : null
              }
            : null,
          dateModified: Date.now()
        }
        update(
          ref(
            db,
            `${
              this.$store.getters['users/userId']
            }/tasks/date-${eventDate.slice(0, eventDate.indexOf(' '))}/id-${
              updateTodo.id
            }/`
          ),
          updateTodo
        )
      }
      this.updateTaskData()
      this.$router.push(this.path)

      this.$q.notify({
        position: 'top',
        message: 'Task edited',
        color: 'blue',
        timeout: 1000
      })
    },
    continuousStart() {
      update(
        ref(
          db,
          `${
            this.$store.getters['users/userId']
          }/tasks/date-${this.task.time.slice(
            0,
            this.task.time.indexOf(' ')
          )}/id-${this.task.id}`
        ),
        {
          taskStarted: Date.now()
        }
      )
      this.updateTaskData()
    },
    continuousStop() {
      update(
        ref(
          db,
          `${
            this.$store.getters['users/userId']
          }/tasks/date-${this.task.time.slice(
            0,
            this.task.time.indexOf(' ')
          )}/id-${this.task.id}`
        ),
        {
          taskEnded: Date.now()
        }
      )
      this.updateTaskData()
    },
    changeProgress() {
      update(
        ref(
          db,
          `${
            this.$store.getters['users/userId']
          }/tasks/date-${this.task.time.slice(
            0,
            this.task.time.indexOf(' ')
          )}/id-${this.task.id}`
        ),
        { progress: !this.task.progress }
      )
      this.updateTaskData()
    },
    onDeleteClick() {
      this.$refs.confirmDialog.show()
    },
    onCancelClick() {
      this.$router.push(this.path)
    },
    onConfirmDeleteClick() {
      const notifsToRemove = []
      if (this.task.notificationsId) {
        for (const notif of this.task.notificationsId) {
          notifsToRemove.push({ id: notif.id })
        }
        // if (this.$q.platform.is.capacitor) {
        this.$store.dispatch('notification/removeNotifications', notifsToRemove)
        // }
      }
      remove(
        ref(
          db,
          `${
            this.$store.getters['users/userId']
          }/tasks/date-${this.task.time.slice(
            0,
            this.task.time.indexOf(' ')
          )}/id-${this.task.id}`
        )
      )
      this.$router.push('/')

      this.$q.notify({
        position: 'top',
        message: 'Task removed',
        color: 'red',
        timeout: 1000
      })
    },
    onConfirmDialogHide() {
      this.$emit('hide')
    },
    onConfirmCancelClick() {
      this.$refs.confirmDialog.hide()
    }
  }
}
</script>

<style>
.taskInfo {
  width: 5rem;
  overflow-wrap: anywhere;
  padding: 0;
}
</style>

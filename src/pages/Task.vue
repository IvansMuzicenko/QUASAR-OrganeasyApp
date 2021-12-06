<template>
  <q-page>
    <q-card class="flex justify-between no-padding">
      <q-btn icon="arrow_back" flat @click="routerBack()"></q-btn>
      <q-btn
        v-if="!editState"
        icon="edit"
        color="secondary"
        flat
        @click="toggleEdit()"
      >
        Edit
      </q-btn>
      <q-btn
        v-if="editState"
        icon="save"
        color="positive"
        flat
        @click="callEditClick"
      >
        Save
      </q-btn>
      <q-btn
        v-if="editState"
        icon="delete"
        color="negative"
        flat
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

      <q-item v-if="task.location">
        <q-item-section avatar class="taskInfo">Location</q-item-section>
        <q-separator vertical spaced="md" />
        <a
          :href="`https://www.google.com/maps/search/${task.location.replace(
            ' ',
            '+'
          )}`"
          >{{ task.location }}</a
        >
      </q-item>

      <q-item v-if="task.notifications">
        <q-item-section avatar class="taskInfo"> Notifications </q-item-section>
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

      <q-item v-if="task.continuous">
        <q-item-section avatar class="taskInfo">Continuous</q-item-section>
        <q-separator vertical spaced="md" />
        {{ task.continuous }}
      </q-item>

      <q-item v-if="task.processes">
        <q-item-section avatar class="taskInfo">Processes</q-item-section>
        <q-separator vertical spaced="md" />
        <q-item-section>
          <q-item-section
            v-for="(process, index) in task.processes"
            :key="process"
          >
            <q-separator v-if="index > 0" spaced="sm" />{{ process }}
          </q-item-section>
        </q-item-section>
      </q-item>

      <q-item v-if="task.subtasks">
        <q-item-section avatar class="taskInfo">Subtasks</q-item-section>
        <q-separator vertical spaced="md" />
        <q-item-section>
          <q-item-section
            v-for="(subtask, index) in task.subtasks"
            :key="subtask"
            ><q-separator v-if="index > 0" spaced="sm" />{{
              subtask
            }}</q-item-section
          >
        </q-item-section>
      </q-item>

      <q-item v-if="task.repeat">
        <q-item-section avatar class="taskInfo">Repeat</q-item-section>
        <q-separator vertical spaced="md" />
        <q-item-section>
          <q-item-section>
            Repeat number: {{ task.repeat.repeatNumber }}</q-item-section
          >

          <q-item-section v-if="task.repeat.months">
            Months:{{ task.repeat.months }}</q-item-section
          >
          <q-item-section v-if="task.repeat.weeks">
            Weeks:{{ task.repeat.weeks }}</q-item-section
          >
          <q-item-section v-if="task.repeat.days">
            Days:{{ task.repeat.days }}</q-item-section
          >
          <q-item-section v-if="task.repeat.hours">
            Hours:{{ task.repeat.hours }}</q-item-section
          >
          <q-item-section v-if="task.repeat.minutes">
            Minutes:{{ task.repeat.minutes }}</q-item-section
          >
        </q-item-section>
      </q-item>
    </q-list>

    <task-form
      v-if="editState"
      ref="taskForm"
      :edit-task="task"
      @editEvent="onEditClick"
      @cancelEvent="onCancelClick"
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
import { getDatabase, ref, update, remove } from 'firebase/database'
const db = getDatabase()
import TaskForm from 'components/TaskForm.vue'
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
        location: '',
        notifications: [
          {
            notificationPeriodModel: '',
            notificationPointModel: '',
            notificationTimeTypeModel: '',
            notificationTimeValuesModel: 0
          }
        ],
        continuous: false,
        processes: [],
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
    editState() {
      return this.$route.query.edit ? true : false
    }
  },
  beforeMount() {
    this.updateTaskData()
  },
  methods: {
    updateTaskData() {
      const path = this.$route.path
      const taskDate = path.slice(path.indexOf('/') + 1, path.lastIndexOf('/'))
      const taskId = path.slice(path.lastIndexOf('/') + 1)
      const dayTasks = this.$store.getters['users/tasks'][`date-${taskDate}`]
      if (!dayTasks) {
        return this.$router.push('/')
      }
      const task = dayTasks.find(
        (element) => Object.values(element).indexOf(`${taskId}`) >= 0
      )
      if (!task) {
        return this.$router.push('/')
      }
      this.task = JSON.parse(JSON.stringify(task))
    },
    routerBack() {
      return this.$router.push('/')
    },
    toggleEdit() {
      this.$router.push(this.$route.path + '?edit=true')
    },
    callEditClick() {
      this.$refs.taskForm.onEditClick()
    },
    onEditClick(form) {
      const updateTodo = {
        id: form.id,
        title: form.todoTitle,
        progress: form.progress,
        time: form.eventDate,
        endingTime: form.toggleEventEnd ? form.eventEndingDate : null,
        location: form.toggleLocation ? form.eventLocation : null,
        notifications: form.toggleNotification ? form.notificationForm : null,
        continuous: form.continuousState,
        processes: form.toggleProcesses ? form.processesModel : null,
        subtasks: form.toggleSubtasks ? form.subtasks : null,
        repeat: form.toggleRepeat
          ? {
              repeatNumber: form.repeat.repeatNumber,
              months: form.repeat.monthsModel ? form.repeat.monthsModel : null,
              weeks: form.repeat.weeksModel ? form.repeat.weeksModel : null,
              days: form.repeat.daysModel ? form.repeat.daysModel : null,
              hours: form.repeat.hoursModel ? form.repeat.hoursModel : null,
              minutes: form.repeat.minutesModel
                ? form.repeat.minutesModel
                : null
            }
          : null
      }
      update(
        ref(
          db,
          `${
            this.$store.getters['users/userId']
          }/tasks/date-${updateTodo.time.slice(
            0,
            updateTodo.time.indexOf(' ')
          )}/id-${updateTodo.id}`
        ),
        updateTodo
      )
      this.updateTaskData()
      this.$router.push(this.$route.path)
    },
    onDeleteClick() {
      this.$refs.confirmDialog.show()
    },
    onCancelClick() {
      this.$router.push(this.$route.path)
    },
    onConfirmDeleteClick() {
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

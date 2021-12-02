<template>
  <q-page>
    <q-card v-if="!editState">
      {{ task.title }}
      {{ task.time }}
      {{ task.endingTime }}
      {{ task.location }}
      {{ task.notifications }}
      {{ task.continuous }}
      {{ task.processes }}
      {{ task.subtasks }}
      {{ task.repeat }}
    </q-card>
    <q-btn @click="editState = true"> Edit </q-btn>
    <task-form
      v-if="editState"
      :edit-task="task"
      @editEvent="onEditClick"
      @cancelEvent="onCancelClick"
    />
  </q-page>
</template>

<script>
import { getDatabase, ref, update } from 'firebase/database'
const db = getDatabase()
import TaskForm from 'components/TaskForm.vue'
export default {
  components: {
    TaskForm
  },
  data() {
    return {
      task: {
        id: '',
        title: '',
        time: '',
        endingTime: '',
        location: '',
        notifications: '',
        continuous: false,
        processes: [],
        subtasks: '',
        repeat: {}
      },
      editState: false
    }
  },
  mounted() {
    const path = this.$route.path
    const taskDate = path.slice(path.indexOf('/') + 1, path.lastIndexOf('/'))
    const taskId = path.slice(path.lastIndexOf('/') + 1)
    const task = this.$store.getters['users/tasks'][`date-${taskDate}`].find(
      (element) => Object.values(element).indexOf(`${taskId}`) >= 0
    )
    this.task = JSON.parse(JSON.stringify(task))
  },
  methods: {
    onEditClick(form) {
      const updateTodo = {
        id: form.id,
        title: form.todoTitle,
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
              months: form.repeat.monthsModel,
              weeks: form.repeat.weeksModel,
              days: form.repeat.daysModel,
              hours: form.repeat.hoursModel,
              minutes: form.repeat.minutesModel
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

      this.editState = false
    },
    onCancelClick() {
      this.editState = false
    }
  }
}
</script>

<style></style>

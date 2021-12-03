<template>
  <q-page>
    <q-btn v-if="!editState" @click="editState = true"> Edit </q-btn>
    <q-list v-if="!editState" separator bordered>
      <q-item v-if="task.title">Title: {{ task.title }}</q-item>
      <q-item v-if="task.time">Date: {{ task.time }}</q-item>
      <q-item v-if="task.endingTime">
        Ending date: {{ task.endingTime }}</q-item
      >
      <q-item v-if="task.location">Location: {{ task.location }}</q-item>
      <q-item v-if="task.notifications"
        >Notifications:
        <q-item-section
          v-for="(notification, index) in task.notifications"
          :key="index"
          >{{ notification.notificationTimeValuesModel }}
          {{ notification.notificationTimeTypeModel }}
          {{ notification.notificationPeriodModel }}
          {{ notification.notificationPointModel }}
        </q-item-section>
      </q-item>
      <q-item v-if="task.continuous">Continuous: {{ task.continuous }}</q-item>
      <q-item v-if="task.processes"
        >Processes:
        <q-item-section v-for="process in task.processes" :key="process">{{
          process
        }}</q-item-section>
      </q-item>
      <q-item v-if="task.subtasks"
        >Subtasks:
        <q-item-section v-for="subtask in task.subtasks" :key="subtask">{{
          subtask
        }}</q-item-section></q-item
      >
      <q-item v-if="task.repeat"
        >Repeat:
        <q-item-section
          >Repeat number: {{ task.repeat.repeatNumber }}</q-item-section
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
      </q-item>
    </q-list>

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
      },
      editState: false
    }
  },
  mounted() {
    this.updateTaskData()
  },
  methods: {
    updateTaskData() {
      const path = this.$route.path
      const taskDate = path.slice(path.indexOf('/') + 1, path.lastIndexOf('/'))
      const taskId = path.slice(path.lastIndexOf('/') + 1)
      const task = this.$store.getters['users/tasks'][`date-${taskDate}`].find(
        (element) => Object.values(element).indexOf(`${taskId}`) >= 0
      )
      this.task = JSON.parse(JSON.stringify(task))
    },
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
      this.editState = false
    },
    onCancelClick() {
      this.editState = false
    }
  }
}
</script>

<style></style>

<template>
  <q-dialog ref="dialog" @hide="onDialogHide">
    <task-form
      :exact-date="exactDate"
      :copy="copy"
      @confirm-event="onOKClick"
      @cancel-event="onCancelClick"
    />
  </q-dialog>
</template>

<script>
import { date } from 'quasar'
import { getDatabase, ref, set } from 'firebase/database'
import TaskForm from 'src/components/forms/TaskForm.vue'
import generateId from 'src/idGenerator.js'

const db = getDatabase()

export default {
  components: {
    TaskForm
  },
  props: {
    exactDate: {
      type: String,
      required: false,
      default: ''
    },
    copy: {
      type: Object,
      required: false,
      default: null
    }
  },

  emits: ['ok', 'hide'],

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

    onOKClick(form) {
      let eventDate = form.eventDate
      let eventEndingDate = form.eventEndingDate
      const relationId = JSON.parse(JSON.stringify(generateId()))

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

        const newTodo = {
          id: generateId(),
          relationId: relationId,
          title: form.todoTitle,
          progress: form.progress,
          time: eventDate,
          endingTime: form.toggleEventEnd ? eventEndingDate : null,
          notes: form.toggleNotes ? form.notes : null,
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
          dateModified: Date.now(),
          finishedDate: form.progress ? Date.now() : null
        }

        set(
          ref(
            db,
            `${
              this.$store.getters['users/userId']
            }/tasks/date-${eventDate.slice(0, eventDate.indexOf(' '))}/id-${
              newTodo.id
            }/`
          ),
          newTodo
        )
      }

      this.$emit('ok')

      this.hide()

      this.$q.notify({
        position: 'top',
        message: 'Task added',
        color: 'green',
        timeout: 1000
      })
      if (form.toggleRepeat) {
        this.$q.notify({
          position: 'top',
          message: 'Related tasks created',
          color: 'green',
          timeout: 2000
        })
      }
    },

    onCancelClick() {
      this.hide()
    }
  }
}
</script>

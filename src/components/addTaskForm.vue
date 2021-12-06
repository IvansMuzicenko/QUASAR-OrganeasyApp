<template>
  <q-dialog ref="dialog" @hide="onDialogHide">
    <task-form @OKEvent="onOKClick" @cancelEvent="onCancelClick" />
  </q-dialog>
</template>

<script>
import { date } from 'quasar'
import { getDatabase, ref, set } from 'firebase/database'
import TaskForm from 'components/TaskForm.vue'

export default {
  components: {
    TaskForm
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
      const db = getDatabase()

      for (let i = 0; i < form.repeat.repeatNumber + 1; i++) {
        let eventDate = form.eventDate
        let eventEndingDate = form.eventEndingDate

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

        const newTodo = {
          id: form.todoTitle.replaceAll(' ', '-'),
          title: form.todoTitle,
          progress: form.progress,
          time: eventDate,
          endingTime: form.toggleEventEnd ? eventEndingDate : null,
          location: form.toggleLocation ? form.eventLocation : null,
          notifications: form.toggleNotification ? form.notificationForm : null,
          continuous: form.continuousState,
          processes: form.toggleProcesses ? form.processesModel : null,
          subtasks: form.toggleSubtasks ? form.subtasks : null,
          repeat: form.toggleRepeat
            ? {
                repeatNumber: form.repeat.repeatNumber,
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
            : null
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
    },

    onCancelClick() {
      this.hide()
    }
  }
}
</script>

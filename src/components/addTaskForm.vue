<template>
  <q-dialog ref="dialog" @hide="onDialogHide">
    <task-form
      :exact-date="exactDate"
      @OKEvent="onOKClick"
      @cancelEvent="onCancelClick"
    />
  </q-dialog>
</template>

<script>
import { date } from 'quasar'
import { getDatabase, ref, set } from 'firebase/database'
import TaskForm from 'src/components/TaskForm.vue'

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
          id: form.todoTitle.replaceAll(' ', '-'),
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
            : null
        }
        console.log(newTodo)

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
    },

    onCancelClick() {
      this.hide()
    }
  }
}
</script>

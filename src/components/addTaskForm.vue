<template>
  <q-dialog ref="dialog" @hide="onDialogHide">
    <task-form @OKEvent="onOKClick" @cancelEvent="onCancelClick" />
  </q-dialog>
</template>

<script>
import { date } from "quasar";
import { getDatabase, ref, set } from "firebase/database";
import TaskForm from "components/TaskForm.vue";

export default {
  components: {
    TaskForm,
  },

  emits: ["ok", "hide"],

  methods: {
    show() {
      this.$refs.dialog.show();
    },

    hide() {
      this.$refs.dialog.hide();
    },

    onDialogHide() {
      this.$emit("hide");
    },

    onOKClick(form) {
      const db = getDatabase();

      for (let i = 0; i < form.repeatNumber + 1; i++) {
        let eventDate = form.eventDate;
        let eventEndingDate = form.eventEndingDate;

        if (i != 0) {
          eventDate = date.formatDate(
            date.addToDate(date.extractDate(eventDate, "DD-MM-YYYY HH:mm"), {
              months: form.monthsModel,
              days: form.daysModel + form.weeksModel * 7,
              hours: form.hoursModel,
              minutes: form.minutesModel,
            }),
            "DD-MM-YYYY HH:mm"
          );

          eventEndingDate = date.formatDate(
            date.addToDate(
              date.extractDate(eventEndingDate, "DD-MM-YYYY HH:mm"),
              {
                months: form.monthsModel,
                days: form.daysModel + form.weeksModel * 7,
                hours: form.hoursModel,
                minutes: form.minutesModel,
              }
            ),
            "DD-MM-YYYY HH:mm"
          );
        }

        const newTodo = {
          id: form.todoTitle.replaceAll(" ", "-"),
          title: form.todoTitle,
          time: eventDate,
          endingTime: form.toggleEventEnd ? eventEndingDate : null,
          location: form.toggleLocation ? form.eventLocation : null,
          notifications: form.toggleNotification ? form.notificationForm : null,
          continuous: form.continuousState,
          processes: form.toggleProcesses ? form.processesModel : null,
          subtasks: form.toggleSubtasks ? form.subtasks : null,
          repeat: form.toggleRepeat
            ? {
                months: form.monthsModel,
                weeks: form.weeksModel,
                days: form.daysModel,
                hours: form.hoursModel,
                minutes: form.minutesModel,
              }
            : null,
        };

        set(
          ref(
            db,
            `${
              this.$store.getters["users/userId"]
            }/tasks/date-${eventDate.slice(0, eventDate.indexOf(" "))}/id-${
              newTodo.id
            }/`
          ),
          newTodo
        );
      }

      this.$emit("ok");

      this.hide();
    },

    onCancelClick() {
      this.hide();
    },
  },
};
</script>

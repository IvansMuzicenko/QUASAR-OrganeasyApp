<template>
  <q-page>
    <q-btn @click="previousDay()">Previous</q-btn>
    <q-btn @click="nextDay()">Next</q-btn>
    <q-markup-table separator="cell">
      <thead>
        <tr>
          <th class="text-left text-weight-bolder">{{ formattedDate }}</th>
          <th class="text-center text-weight-bolder" style="width: 100%">
            Tasks
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="task in dayTasks" :key="task">
          <td>{{ task["time"].slice(task["time"].indexOf(" ")) }}</td>
          <td>{{ task["title"] }}</td>
        </tr>
      </tbody>
    </q-markup-table>
    <q-separator color="orange" inset />
  </q-page>
</template>

<script>
import { date } from "quasar";

export default {
  computed: {
    tasks() {
      return this.$store.getters["users/userData"].tasks;
    },
    dayTasks() {
      const tasks = this.$store.getters["users/userData"].tasks;
      const tasksArray = [];

      for (const task in tasks) {
        tasksArray.push(tasks[task]);
      }

      let dayTasks = {};
      let i = 0;
      for (const task in tasksArray.sort(function (a, b) {
        return (
          a.time.slice(a.time.indexOf(" ")).replace(":", ".") -
          b.time.slice(b.time.indexOf(" ")).replace(":", ".")
        );
      })) {
        i++;
        if (
          tasksArray[task].time.slice(0, tasksArray[task].time.indexOf(" ")) ==
          this.formattedDate.slice(this.formattedDate.indexOf(" ") + 1)
        ) {
          dayTasks[task] = tasksArray[task];
        }
      }
      return dayTasks;
    },
  },

  data() {
    const timeStamp = Date.now();
    const formattedDate = date.formatDate(timeStamp, "dddd, DD/MM/YYYY");
    return {
      timeStamp,
      formattedDate,
    };
  },
  methods: {
    nextDay() {
      this.timeStamp += 86400000;
      this.formattedDate = date.formatDate(this.timeStamp, "dddd, DD/MM/YYYY");
    },
    previousDay() {
      this.timeStamp -= 86400000;
      this.formattedDate = date.formatDate(this.timeStamp, "dddd, DD/MM/YYYY");
    },
  },
};
</script>

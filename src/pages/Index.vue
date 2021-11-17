<template>
  <q-page>
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
        <tr v-for="task in tasks" :key="task">
          <td>{{ task["time"] }}</td>
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
  },

  data() {
    const timeStamp = Date.now();
    const formattedDate = date.formatDate(timeStamp, "dddd, D MMMM YYYY");
    return {
      formattedDate,
    };
  },
};
</script>

<template>
  <q-page>
    <q-markup-table separator="cell">
      <!-- <thead>
        <tr>
          <th class="text-left text-weight-bolder">{{ formattedDate }}</th>
          <th class="text-center text-weight-bolder" style="width: 100%">
            Tasks
          </th>
        </tr>
      </thead> -->
      <tbody>
        <tr v-for="(process, index) in processes" :key="index">
          <td>{{ process["title"] }}</td>
          <td>{{ process["time"] }}</td>
        </tr>
      </tbody>
    </q-markup-table>
  </q-page>
</template>

<script>
export default {
  computed: {
    processes() {
      return this.$store.getters["users/processes"];
    },
  },
};
</script>

<style></style>

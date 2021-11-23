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
        <tr v-for="(note, index) in notes" :key="index">
          <td>{{ note["title"] }}</td>
          <td v-html="note['text']"></td>
        </tr>
      </tbody>
    </q-markup-table>
  </q-page>
</template>

<script>
export default {
  data() {
    return {
      notes: this.$store.getters["users/userData"].notes,
    };
  },
};
</script>

<style></style>

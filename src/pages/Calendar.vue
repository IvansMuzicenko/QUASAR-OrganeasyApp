<template>
  <q-page>
    <q-date v-model="date" />
  </q-page>
</template>

<script>
import { date } from "quasar";
const timeStamp = Date.now();
const formattedDate = date.formatDate(timeStamp, "YYYY/MM/DD");
export default {
  data() {
    return {
      date: formattedDate,
    };
  },
};
</script>

<style></style>

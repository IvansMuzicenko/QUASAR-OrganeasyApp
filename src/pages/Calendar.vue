<template>
  <q-date v-model="date" />
</template>

<script>
import { defineComponent, ref } from "vue";
import { date } from "quasar";
const timeStamp = Date.now();
const formattedDate = date.formatDate(timeStamp, "YYYY/MM/DD");
export default {
  setup() {
    return {
      date: ref(formattedDate),
    };
  },
};
</script>

<style></style>

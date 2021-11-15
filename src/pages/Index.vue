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
        <tr>
          <td>Frozen Yogurt</td>
          <td>159</td>
        </tr>
      </tbody>
    </q-markup-table>
    <q-separator color="orange" inset />
  </q-page>
</template>

<script>
import { date } from "quasar";

export default {
  data() {
    const timeStamp = Date.now();
    const formattedDate = date.formatDate(timeStamp, "dddd, D MMMM YYYY");
    return { formattedDate };
  },
};
</script>

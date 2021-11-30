<template>
  <q-dialog ref="dialog" @hide="onDialogHide">
    <q-card class="q-dialog-plugin">
      <q-card-section>
        <q-input
          bottom-slots
          v-model="processTitle"
          label="Title"
          :dense="false"
        >
        </q-input>
        <q-input
          bottom-slots
          v-model.number="processTime"
          type="number"
          label="Time"
          suffix="Minutes"
          min="0"
          :dense="false"
        >
        </q-input>
      </q-card-section>
      <q-card-actions align="right">
        <q-btn color="primary" label="OK" @click="onOKClick" />
        <q-btn color="primary" label="Cancel" @click="onCancelClick" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { getDatabase, ref, set } from "firebase/database";
export default {
  data() {
    return {
      processTitle: "",
      processTime: 0,
    };
  },
  props: {},

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

    onOKClick() {
      const newProcess = {
        id: this.processTitle.replaceAll(" ", "-"),
        title: this.processTitle,
        time: this.processTime,
      };
      const db = getDatabase();
      set(
        ref(
          db,
          `${this.$store.getters["users/userId"]}/processes/id-${newProcess.id}`
        ),
        newProcess
      );
      this.$emit("ok");

      this.hide();
    },

    onCancelClick() {
      this.hide();
    },
  },
};
</script>

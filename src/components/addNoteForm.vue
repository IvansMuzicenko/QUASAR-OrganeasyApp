<template>
  <q-dialog ref="dialog" @hide="onDialogHide">
    <q-card class="q-dialog-plugin">
      <q-card-section>
        <q-input
          bottom-slots
          v-model="noteTitle"
          label="Title"
          lazy-rules
          :dense="false"
        >
        </q-input>
        <q-editor v-model="noteText" min-height="5rem" />
      </q-card-section>

      <q-card-actions align="right">
        <q-btn color="primary" label="Add" @click="onOKClick" />
        <q-btn color="negative" label="Cancel" @click="onCancelClick" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { getDatabase, ref, set } from "firebase/database";

export default {
  data() {
    return {
      noteTitle: "",
      noteText: "",
    };
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

    onOKClick() {
      const newNote = {
        title: this.noteTitle,
        text: this.noteText,
      };

      const db = getDatabase();
      set(
        ref(
          db,
          `${this.$store.getters["users/userId"]}/notes/${this.noteTitle}`
        ),
        newNote
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

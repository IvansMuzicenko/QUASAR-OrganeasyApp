<template>
  <q-page>
    <p class="text-center text-h6">Processes</p>
    <q-list separator bordered>
      <q-item
        v-for="(process, index) in processes"
        clickable
        :key="index"
        @click="editProcess(process)"
      >
        <q-item-section>{{ process["title"] }}</q-item-section>
        <q-separator vertical />
        <q-item-section side>{{ process["time"] }} minutes</q-item-section>
      </q-item>
    </q-list>

    <q-dialog ref="dialog" @hide="onDialogHide">
      <q-card class="q-dialog-plugin">
        <q-card-section>
          <q-input
            bottom-slots
            v-model="selectedProcess.title"
            label="Title"
            :dense="false"
          >
          </q-input>
          <q-input
            bottom-slots
            v-model.number="selectedProcess.time"
            type="number"
            label="Time"
            suffix="Minutes"
            min="0"
            :dense="false"
          >
          </q-input>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn color="primary" label="Edit" @click="onOKClick" />
          <q-btn color="primary" label="Cancel" @click="onCancelClick" />
          <q-btn color="negative" label="Delete" @click="onDeleteClick" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog ref="confirmDialog" @hide="onConfirmDialogHide">
      <q-card class="q-dialog-plugin">
        <q-card-section>
          Are you sure to premanently remove '{{ selectedProcess.title }}'
          process?
        </q-card-section>
        <q-card-actions align="right">
          <q-btn color="primary" label="Cancel" @click="onConfirmCancelClick" />
          <q-btn
            color="negative"
            label="Delete"
            @click="onConfirmDeleteClick"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { getDatabase, ref, update, remove } from "firebase/database";

const db = getDatabase();

export default {
  computed: {
    processes() {
      return this.$store.getters["users/processes"];
    },
  },
  data() {
    return {
      selectedProcess: {
        id: "",
        title: "",
        time: 0,
      },
    };
  },
  methods: {
    editProcess(process) {
      this.show();
      this.selectedProcess = JSON.parse(JSON.stringify(process));
    },
    show() {
      this.$refs.dialog.show();
    },

    hide() {
      this.$refs.dialog.hide();
    },

    onDialogHide() {
      this.$emit("hide");
    },
    onConfirmDialogHide() {
      this.$emit("hide");
    },

    onOKClick() {
      const processChanges = {
        id: this.selectedProcess.id,
        title: this.selectedProcess.title,
        time: this.selectedProcess.time,
      };

      update(
        ref(
          db,
          `${this.$store.getters["users/userId"]}/processes/id-${this.selectedProcess.id}`
        ),
        processChanges
      );

      this.$emit("ok");

      this.hide();
    },

    onCancelClick() {
      this.hide();
    },
    onConfirmCancelClick() {
      this.$refs.confirmDialog.hide();
    },
    onDeleteClick() {
      this.$refs.confirmDialog.show();
    },
    onConfirmDeleteClick() {
      remove(
        ref(
          db,
          `${this.$store.getters["users/userId"]}/processes/id-${this.selectedProcess.id}`
        )
      );
      this.$refs.confirmDialog.hide();
      this.hide();
    },
  },
};
</script>

<style></style>

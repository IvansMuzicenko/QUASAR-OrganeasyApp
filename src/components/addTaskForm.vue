<template>
  <q-dialog ref="dialog" @hide="onDialogHide">
    <q-card class="q-dialog-plugin">
      <q-card-section>
        <q-input bottom-slots v-model="todoTitle" label="Title" :dense="false">
        </q-input>
        <q-card-section>
          <p>Continious action</p>
          <q-radio v-model="continiousState" val="true" label="true" />
          <q-radio v-model="continiousState" val="false" label="false" />
        </q-card-section>
        <q-select
          outlined
          v-model="todoModel"
          :options="todoType"
          label="Type"
        />

        <q-card-section v-if="todoModel === 'Event'">
          <q-select
            outlined
            multiple
            v-model="processesModel"
            :options="processesType"
            label="Processes"
          />
          <q-input
            bottom-slots
            v-model="subtaskInput"
            label="Subtasks"
            :dense="false"
          >
            <template v-slot:append>
              <q-btn
                round
                dense
                flat
                icon="add"
                @click="addSubtask(subtaskInput)"
              />
            </template>
          </q-input>

          <q-list bordered separator>
            <q-item v-for="subtask in eventSubtasks" :key="subtask">
              <q-item-section>{{ subtask }}</q-item-section>
            </q-item>
          </q-list>
        </q-card-section>
        <q-card-section v-if="todoModel === 'Task'">
          <q-select
            outlined
            v-model="taskModel"
            :options="taskType"
            label="Task type"
          />

          <q-card-section v-if="taskModel === 'Term'">
            <q-input filled v-model="formattedDate" label="Start">
              <template v-slot:prepend>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy
                    cover
                    transition-show="scale"
                    transition-hide="scale"
                  >
                    <q-date v-model="currentDate" mask="YYYY-MM-DD HH:mm">
                      <div class="row items-center justify-end">
                        <q-btn
                          v-close-popup
                          label="Close"
                          color="primary"
                          flat
                        />
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-icon>
              </template>

              <template v-slot:append>
                <q-icon name="access_time" class="cursor-pointer">
                  <q-popup-proxy
                    cover
                    transition-show="scale"
                    transition-hide="scale"
                  >
                    <q-time
                      v-model="currentDate"
                      mask="YYYY-MM-DD HH:mm"
                      format24h
                    >
                      <div class="row items-center justify-end">
                        <q-btn
                          v-close-popup
                          label="Close"
                          color="primary"
                          flat
                        />
                      </div>
                    </q-time>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
          </q-card-section>
          <q-card-section v-if="taskModel === 'Repeatable'">
            <p>Starting date</p>
            <q-input filled v-model="formattedDate">
              <template v-slot:prepend>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy
                    cover
                    transition-show="scale"
                    transition-hide="scale"
                  >
                    <q-date v-model="formattedDate" mask="YYYY-MM-DD HH:mm">
                      <div class="row items-center justify-end">
                        <q-btn
                          v-close-popup
                          label="Close"
                          color="primary"
                          flat
                        />
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-icon>
              </template>

              <template v-slot:append>
                <q-icon name="access_time" class="cursor-pointer">
                  <q-popup-proxy
                    cover
                    transition-show="scale"
                    transition-hide="scale"
                  >
                    <q-time
                      v-model="formattedDate"
                      mask="YYYY-MM-DD HH:mm"
                      format24h
                    >
                      <div class="row items-center justify-end">
                        <q-btn
                          v-close-popup
                          label="Close"
                          color="primary"
                          flat
                        />
                      </div>
                    </q-time>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
            <q-card-section class="flex">
              <p class="full-width">Repeat in</p>
              <q-select
                outlined
                v-model="monthsModel"
                :options="monthsOptions"
                label="Months"
                style="width: 50%"
              />
              <q-select
                outlined
                v-model="weeksModel"
                :options="weeksOptions"
                label="Weeks"
                style="width: 50%"
              />
              <q-select
                outlined
                v-model="daysModel"
                :options="daysOptions"
                label="Days"
                style="width: 50%"
              />
              <q-select
                outlined
                v-model="hoursModel"
                :options="hoursOptions"
                label="Hours"
                style="width: 50%"
              />
              <q-select
                outlined
                v-model="minutesModel"
                :options="minutesOptions"
                label="Minutes"
                style="width: 50%"
              />
              <q-select
                outlined
                v-model="secondsModel"
                :options="secondsOptions"
                label="Seconds"
                style="width: 50%"
              />
            </q-card-section>
          </q-card-section>
        </q-card-section>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn color="primary" label="Add" @click="onOKClick" />
        <q-btn color="negative" label="Cancel" @click="onCancelClick" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { ref } from "vue";
import { date } from "quasar";
export default {
  data() {
    return {
      todoTitle: "",
      continiousState: "false",
      todoModel: ref(null),
      todoType: ["Event", "Task"],
      eventSubtasks: [],
      subtaskInput: "",
      processesModel: ref(null),
      processesType: [
        "Brush teeth",
        "Shave beard",
        "Take a shower",
        "Clean kitchen",
      ], // from database processes
      taskModel: ref(null),
      taskType: ["Global", "Term", "Repeatable"],
      monthsModel: 0,
      monthsOptions: Array.from({ length: 12 }, (_, index) => index + 1),
      weeksModel: 0,
      weeksOptions: Array.from({ length: 4 }, (_, index) => index + 1),
      daysModel: 0,
      daysOptions: Array.from({ length: 31 }, (_, index) => index + 1),
      hoursModel: 0,
      hoursOptions: Array.from({ length: 24 }, (_, index) => index + 1),
      minutesModel: 0,
      minutesOptions: Array.from({ length: 60 }, (_, index) => index + 1),
      secondsModel: 0,
      secondsOptions: Array.from({ length: 60 }, (_, index) => index + 1),
      currentDate: ref(Date.now()),
      formattedDate: date.formatDate(Date.now(), "DD/MM/YYYY HH:mm"),
    };
  },

  emits: [
    // REQUIRED
    "ok",
    "hide",
  ],

  methods: {
    addSubtask(newSubtask) {
      this.eventSubtasks.push(newSubtask);
      this.subtaskInput = "";
    },
    // following method is REQUIRED
    // (don't change its name --> "show")
    show() {
      this.$refs.dialog.show();
    },

    // following method is REQUIRED
    // (don't change its name --> "hide")
    hide() {
      this.$refs.dialog.hide();
    },

    onDialogHide() {
      // required to be emitted
      // when QDialog emits "hide" event
      this.$emit("hide");
    },

    onOKClick() {
      // on OK, it is REQUIRED to
      // emit "ok" event (with optional payload)
      // before hiding the QDialog
      this.$emit("ok");
      // or with payload: this.$emit('ok', { ... })

      // then hiding dialog
      this.hide();
    },

    onCancelClick() {
      // we just need to hide the dialog
      this.hide();
    },
  },
};
</script>

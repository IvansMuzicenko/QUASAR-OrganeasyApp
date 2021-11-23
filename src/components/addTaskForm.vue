<template>
  <q-dialog ref="dialog" @hide="onDialogHide">
    <q-card class="q-dialog-plugin">
      <q-card-section>
        <q-input
          bottom-slots
          v-model="todoTitle"
          label="Title"
          lazy-rules
          @blur="checkValidity()"
          :rules="[(val) => val !== '']"
          :dense="false"
        >
        </q-input>
        <q-select
          outlined
          v-model="todoModel"
          :options="todoType"
          label="Type"
          @blur="checkValidity()"
          lazy-rules
          :rules="[(val) => val !== null]"
        />
        <q-card-section>
          <p>Continuous action</p>
          <q-radio v-model="continuousState" :val="true" label="true" />
          <q-radio v-model="continuousState" :val="false" label="false" />
        </q-card-section>

        <q-card-section v-if="todoModel === 'Event'">
          <p>Event starting</p>
          <q-input filled v-model="formattedDate">
            <template v-slot:prepend>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy
                  cover
                  transition-show="scale"
                  transition-hide="scale"
                >
                  <q-date v-model="formattedDate" mask="DD-MM-YYYY HH:mm">
                    <div class="items-center justify-end row">
                      <q-btn v-close-popup label="Close" color="primary" flat />
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
                    mask="DD-MM-YYYY HH:mm"
                    format24h
                  >
                    <div class="items-center justify-end row">
                      <q-btn v-close-popup label="Close" color="primary" flat />
                    </div>
                  </q-time>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
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
            <q-input filled v-model="formattedDate" label="Term">
              <template v-slot:prepend>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy
                    cover
                    transition-show="scale"
                    transition-hide="scale"
                  >
                    <q-date v-model="formattedDate" mask="DD-MM-YYYY HH:mm">
                      <div class="items-center justify-end row">
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
                      mask="DD-MM-YYYY HH:mm"
                      format24h
                    >
                      <div class="items-center justify-end row">
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
                    <q-date v-model="formattedDate" mask="DD-MM-YYYY HH:mm">
                      <div class="items-center justify-end row">
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
                      mask="DD-MM-YYYY HH:mm"
                      format24h
                    >
                      <div class="items-center justify-end row">
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
        <q-btn
          color="primary"
          label="Add"
          :disable="error"
          @click="onOKClick"
        />
        <q-btn color="negative" label="Cancel" @click="onCancelClick" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { date } from "quasar";
import { getDatabase, ref, set } from "firebase/database";

export default {
  data() {
    return {
      error: true,
      todoTitle: "",
      continuousState: false,
      todoModel: null,
      todoType: ["Event", "Task"],
      eventSubtasks: [],
      subtaskInput: "",
      processesModel: null,
      processesType: this.$store.getters["users/userData"].processes,
      taskModel: null,
      taskType: ["Term", "Repeatable"],
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
      formattedDate: date.formatDate(Date.now(), "DD-MM-YYYY HH:mm"),
    };
  },

  emits: ["ok", "hide"],

  methods: {
    checkValidity() {
      if (this.todoTitle === "" || this.todoModel === null) {
        this.error = true;
      } else {
        this.error = false;
      }
    },
    addSubtask(newSubtask) {
      this.eventSubtasks.push(newSubtask);
      this.subtaskInput = "";
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

    onOKClick() {
      let newTodo = {};
      if (this.todoModel === "Event") {
        newTodo = {
          title: this.todoTitle,
          continuous: this.continuousState,
          type: this.todoModel,
          time: this.formattedDate,
          processes: this.processesModel,
          subtasks: this.eventSubtasks,
        };
      } else {
        newTodo = {
          title: this.todoTitle,
          continuous: this.continuousState,
          type: this.todoModel,
          taskType: this.taskModel,
          time: this.formattedDate,
          repeat: {
            months: this.monthsModel,
            weeks: this.weeksModel,
            days: this.daysModel,
            hours: this.hoursModel,
            minutes: this.minutesModel,
            seconds: this.secondsModel,
          },
        };
      }
      const db = getDatabase();
      set(
        ref(
          db,
          `${
            this.$store.getters["users/userId"]
          }/${this.todoModel.toLowerCase()}s/${this.formattedDate.slice(
            0,
            this.formattedDate.indexOf(" ")
          )}/${this.todoTitle}`
        ),
        newTodo
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

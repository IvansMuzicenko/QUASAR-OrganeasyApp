<template>
  <q-dialog ref="dialog" @hide="onDialogHide">
    <q-card class="q-dialog-plugin">
      <q-card-section>
        <q-input
          bottom-slots
          v-model="todoTitle"
          label="Title"
          @blur="checkValidity()"
          :rules="[(val) => val !== '' || 'Title is required']"
          :dense="false"
          class="q-px-md"
        >
        </q-input>

        <q-input filled v-model="eventDate" label="Event time">
          <template v-slot:prepend>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy
                cover
                transition-show="scale"
                transition-hide="scale"
              >
                <q-date v-model="eventDate" mask="DD-MM-YYYY HH:mm">
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
                <q-time v-model="eventDate" mask="DD-MM-YYYY HH:mm" format24h>
                  <div class="items-center justify-end row">
                    <q-btn v-close-popup label="Close" color="primary" flat />
                  </div>
                </q-time>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
      </q-card-section>

      <q-card-section>
        <q-toggle v-model="toggleEventEnd" label="Add event ending" />

        <q-input
          v-if="toggleEventEnd"
          filled
          v-model="eventEndingDate"
          label="Event ending"
        >
          <template v-slot:prepend>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy
                cover
                transition-show="scale"
                transition-hide="scale"
              >
                <q-date v-model="eventEndingDate" mask="DD-MM-YYYY HH:mm">
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
                  v-model="eventEndingDate"
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
      </q-card-section>

      <q-card-section>
        <q-toggle v-model="toggleNotification" label="Add notifications" />
        <q-card-section v-if="toggleNotification">
          <p>
            Notifications
            <q-btn flat @click="addNotification()">+</q-btn>
          </p>
          <q-card-section
            v-for="(notific, index) in notificationForm"
            :key="index"
            class="flex q-pa-0"
          >
            <q-select
              v-model="notificationForm[index]['notificationTimeValuesModel']"
              :options="notificationTimeValues"
              class="q-ma-xs"
              dense
              style="width: 10%"
            ></q-select>
            <q-select
              v-model="notificationForm[index]['notificationTimeTypeModel']"
              :options="notificationTimeType"
              class="q-ma-xs"
              dense
              style="width: 25%"
            ></q-select>
            <q-select
              v-model="notificationForm[index]['notificationPeriodModel']"
              :options="notificationPeriod"
              class="q-ma-xs"
              dense
              style="width: 20%"
            ></q-select>
            <q-select
              v-model="notificationForm[index]['notificationPointModel']"
              :options="notificationPoint"
              class="q-ma-xs"
              dense
              style="width: 25%"
            ></q-select>

            <q-icon
              class="cursor-pointer"
              name="close"
              @click="deleteNotification(index)"
            ></q-icon>

            <q-separator color="black" inset />
          </q-card-section>
        </q-card-section>
      </q-card-section>

      <q-card-section>
        <q-toggle v-model="continuousState" label="Continuous action" />
      </q-card-section>

      <q-card-section>
        <q-toggle v-model="toggleProcesses" label="Add processes" />
        <q-card-section v-if="toggleProcesses">
          <q-btn outline color="success" class="q-ma-xs">
            Add process
            <q-popup-proxy
              cover
              transition-show="scale"
              transition-hide="scale"
              class="q-pa-sm"
            >
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

              <q-btn flat @click="addProcess()">Add</q-btn>
            </q-popup-proxy></q-btn
          >

          <q-select
            outlined
            multiple
            v-model="processesModel"
            :options="processesType"
            label="Processes"
          />
          <q-separator color="black" inset />
        </q-card-section>
      </q-card-section>

      <q-card-section>
        <q-toggle v-model="toggleSubtasks" label="Add subtasks" />
        <q-card-section v-if="toggleSubtasks">
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
      </q-card-section>

      <q-card-section>
        <q-toggle v-model="toggleRepeat" label="Add repeat" />
        <q-card-section v-if="toggleRepeat" class="flex">
          <q-input
            type="number"
            min="1"
            v-model.number="repeatNumber"
            label="Repeat count"
            @blur="checkValidity()"
            :rules="[(val) => val >= 1 || 'Must be at least 1 repeat']"
          />
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
      eventDate: date.formatDate(Date.now(), "DD-MM-YYYY HH:mm"),

      toggleEventEnd: false,
      eventEndingDate: date.formatDate(
        Date.now() + 3600000,
        "DD-MM-YYYY HH:mm"
      ),

      continuousState: false,

      toggleProcesses: false,
      processesModel: null,
      processesType: this.$store.getters["users/userData"].processes,
      processTitle: "",
      processTime: 0,

      toggleSubtasks: false,
      eventSubtasks: [],
      subtaskInput: "",

      toggleNotification: false,
      notificationForm: [
        {
          notificationTimeValuesModel: 1,
          notificationTimeTypeModel: "minutes",
          notificationPeriodModel: "before",
          notificationPointModel: "start time",
        },
      ],
      notificationTimeValues: Array.from(
        { length: 99 },
        (_, index) => index + 1
      ),
      notificationTimeType: ["minutes", "hours", "days", "weeks", "months"],
      notificationPeriod: ["before", "after"],
      notificationPoint: ["start time", "end time"],

      toggleRepeat: false,
      repeatNumber: 1,
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
    };
  },

  emits: ["ok", "hide"],

  methods: {
    checkValidity() {
      if (this.todoTitle === "" || this.repeatNumber < 1) {
        this.error = true;
      } else {
        this.error = false;
      }
    },
    addNotification() {
      this.notificationForm.push({
        notificationTimeValuesModel: 1,
        notificationTimeTypeModel: "minutes",
        notificationPeriodModel: "before",
        notificationPointModel: "start time",
      });
    },
    addProcess() {
      const newProcess = { title: this.processTitle, time: this.processTime };
      const db = getDatabase();
      set(
        ref(
          db,
          `${this.$store.getters["users/userId"]}/processes/id-${this.processTitle}`
        ),
        newProcess
      );
    },
    deleteNotification(index) {
      this.notificationForm.splice(index, 1);
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
      const db = getDatabase();

      const newTodo = {
        title: this.todoTitle,
        time: this.eventDate,
        endingTime: this.toggleEventEnd ? this.eventEndingDate : null,
        notifications: this.toggleNotification ? this.notificationForm : null,
        continuous: this.continuousState,
        processes: this.toggleProcesses ? this.processesModel : null,
        subtasks: this.toggleSubtasks ? this.eventSubtasks : null,
        repeat: this.toggleRepeat
          ? {
              months: this.monthsModel,
              weeks: this.weeksModel,
              days: this.daysModel,
              hours: this.hoursModel,
              minutes: this.minutesModel,
            }
          : null,
      };

      set(
        ref(
          db,
          `${
            this.$store.getters["users/userId"]
          }/${this.todoModel.toLowerCase()}s/${this.eventDate.slice(
            0,
            this.eventDate.indexOf(" ")
          )}/id-${this.todoTitle}/`
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

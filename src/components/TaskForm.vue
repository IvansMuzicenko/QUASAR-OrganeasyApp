<template>
  <q-card class="q-dialog-plugin">
    <q-card-section>
      <q-input
        v-model="form.todoTitle"
        bottom-slots
        label="Title"
        :rules="[(val) => val !== '' || 'Title is required']"
        :dense="false"
        class="q-px-md"
        @keyup="checkValidity()"
      >
      </q-input>

      <q-input v-model="form.eventDate" filled label="Event time">
        <template #prepend>
          <q-icon name="event" class="cursor-pointer">
            <q-popup-proxy
              cover
              transition-show="scale"
              transition-hide="scale"
            >
              <q-date v-model="form.eventDate" mask="DD-MM-YYYY HH:mm">
                <div class="items-center justify-end row">
                  <q-btn v-close-popup label="Close" color="primary" flat />
                </div>
              </q-date>
            </q-popup-proxy>
          </q-icon>
        </template>

        <template #append>
          <q-icon name="access_time" class="cursor-pointer">
            <q-popup-proxy
              cover
              transition-show="scale"
              transition-hide="scale"
            >
              <q-time
                v-model="form.eventDate"
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
      <q-toggle v-model="form.toggleEventEnd" label="Add event ending" />

      <q-input
        v-if="form.toggleEventEnd"
        v-model="form.eventEndingDate"
        filled
        label="Event ending"
      >
        <template #prepend>
          <q-icon name="event" class="cursor-pointer">
            <q-popup-proxy
              cover
              transition-show="scale"
              transition-hide="scale"
            >
              <q-date v-model="form.eventEndingDate" mask="DD-MM-YYYY HH:mm">
                <div class="items-center justify-end row">
                  <q-btn v-close-popup label="Close" color="primary" flat />
                </div>
              </q-date>
            </q-popup-proxy>
          </q-icon>
        </template>

        <template #append>
          <q-icon name="access_time" class="cursor-pointer">
            <q-popup-proxy
              cover
              transition-show="scale"
              transition-hide="scale"
            >
              <q-time
                v-model="form.eventEndingDate"
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
      <q-toggle v-model="form.toggleLocation" label="Add event location" />
      <q-input
        v-if="form.toggleLocation"
        v-model="form.eventLocation"
        bottom-slots
        label="Location"
        class="q-px-md"
      >
      </q-input>
    </q-card-section>

    <q-card-section>
      <q-toggle v-model="form.continuousState" label="Continuous action" />
    </q-card-section>

    <q-card-section>
      <q-toggle v-model="form.toggleProcesses" label="Add processes" />
      <q-card-section v-if="form.toggleProcesses">
        <q-btn outline color="success" class="q-ma-xs">
          Add process
          <q-popup-proxy
            cover
            transition-show="scale"
            transition-hide="scale"
            class="q-pa-sm"
          >
            <q-input
              v-model="form.processTitle"
              bottom-slots
              label="Title"
              :dense="false"
            >
            </q-input>
            <q-input
              v-model.number="form.processTime"
              bottom-slots
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
          v-model="form.processesModel"
          outlined
          multiple
          :options="processesList"
          label="Processes"
        />
      </q-card-section>
    </q-card-section>

    <q-card-section>
      <q-toggle v-model="form.toggleSubtasks" label="Add subtasks" />
      <q-card-section v-if="form.toggleSubtasks">
        <q-input
          v-model="form.subtaskInput"
          bottom-slots
          label="Subtasks"
          :dense="false"
        >
          <template #append>
            <q-btn
              round
              dense
              flat
              icon="add"
              @click="addSubtask(form.subtaskInput)"
            />
          </template>
        </q-input>

        <q-list bordered separator>
          <q-item v-for="subtask in form.subtasks" :key="subtask">
            <q-item-section>{{ subtask }}</q-item-section>
          </q-item>
        </q-list>
      </q-card-section>
    </q-card-section>

    <q-card-section>
      <q-toggle v-model="form.toggleNotification" label="Add notifications" />
      <q-card-section v-if="form.toggleNotification">
        <p>
          Notifications
          <q-btn flat @click="addNotification()">+</q-btn>
        </p>
        <q-card-section
          v-for="(notific, index) in form.notificationForm"
          :key="index"
          class="flex q-pa-0"
        >
          <q-select
            v-model="
              form.notificationForm[index]['notificationTimeValuesModel']
            "
            :options="notificationTimeValues"
            class="q-ma-xs"
            dense
            style="width: 10%"
          ></q-select>
          <q-select
            v-model="form.notificationForm[index]['notificationTimeTypeModel']"
            :options="notificationTimeType"
            class="q-ma-xs"
            dense
            style="width: 25%"
          ></q-select>
          <q-select
            v-model="form.notificationForm[index]['notificationPeriodModel']"
            :options="notificationPeriod"
            class="q-ma-xs"
            dense
            style="width: 20%"
          ></q-select>
          <q-select
            v-model="form.notificationForm[index]['notificationPointModel']"
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
        </q-card-section>
      </q-card-section>
    </q-card-section>

    <q-card-section>
      <q-toggle v-model="form.toggleRepeat" label="Add repeat" />
      <q-card-section v-if="form.toggleRepeat" class="flex">
        <q-input
          v-model.number="form.repeatNumber"
          type="number"
          min="1"
          label="Repeat count"
          :rules="[(val) => val >= 1 || 'Must be at least 1 repeat']"
          @blur="checkValidity()"
        />
        <p class="full-width">Repeat in</p>
        <q-select
          v-model="form.monthsModel"
          outlined
          :options="monthsOptions"
          label="Months"
          style="width: 50%"
        />
        <q-select
          v-model="form.weeksModel"
          outlined
          :options="weeksOptions"
          label="Weeks"
          style="width: 50%"
        />
        <q-select
          v-model="form.daysModel"
          outlined
          :options="daysOptions"
          label="Days"
          style="width: 50%"
        />
        <q-select
          v-model="form.hoursModel"
          outlined
          :options="hoursOptions"
          label="Hours"
          style="width: 50%"
        />
        <q-select
          v-model="form.minutesModel"
          outlined
          :options="minutesOptions"
          label="Minutes"
          style="width: 50%"
        />
      </q-card-section>
    </q-card-section>

    <q-card-actions align="right">
      <q-btn color="primary" label="Add" :disable="error" @click="onOKClick" />
      <q-btn color="negative" label="Cancel" @click="onCancelClick" />
    </q-card-actions>
  </q-card>
</template>

<script>
import { date } from 'quasar'
import { getDatabase, ref, set } from 'firebase/database'
export default {
  emits: ['OKEvent', 'cancelEvent'],
  data() {
    return {
      form: {
        todoTitle: '',
        eventDate: date.formatDate(Date.now(), 'DD-MM-YYYY HH:mm'),

        toggleEventEnd: false,
        eventEndingDate: date.formatDate(
          Date.now() + 3600000,
          'DD-MM-YYYY HH:mm'
        ),

        toggleLocation: false,
        eventLocation: '',

        continuousState: false,

        toggleProcesses: false,
        processesModel: null,

        processTitle: '',
        processTime: 0,

        toggleSubtasks: false,
        subtasks: [],
        subtaskInput: '',

        toggleNotification: false,
        notificationForm: [
          {
            notificationTimeValuesModel: 1,
            notificationTimeTypeModel: 'minutes',
            notificationPeriodModel: 'before',
            notificationPointModel: 'start time'
          }
        ],

        toggleRepeat: false,
        repeatNumber: 0,
        monthsModel: 0,
        weeksModel: 0,
        daysModel: 0,
        hoursModel: 0,
        minutesModel: 0
      },
      error: true,
      monthsOptions: Array.from({ length: 12 }, (_, index) => index + 1),

      weeksOptions: Array.from({ length: 4 }, (_, index) => index + 1),

      daysOptions: Array.from({ length: 31 }, (_, index) => index + 1),

      hoursOptions: Array.from({ length: 24 }, (_, index) => index + 1),

      minutesOptions: Array.from({ length: 60 }, (_, index) => index + 1),
      notificationTimeValues: Array.from(
        { length: 99 },
        (_, index) => index + 1
      ),
      notificationTimeType: ['minutes', 'hours', 'days', 'weeks', 'months'],
      notificationPeriod: ['before', 'after'],
      notificationPoint: ['start time', 'end time']
    }
  },
  computed: {
    processesList() {
      const processes = this.$store.getters['users/processes']
      let processesArray = []
      for (const process in processes) {
        processesArray.push(processes[process].title)
      }
      return processesArray
    }
  },
  methods: {
    onOKClick() {
      this.$emit('OKEvent', this.form)
    },
    onCancelClick() {
      this.$emit('cancelEvent')
    },
    checkValidity() {
      if (this.todoTitle === '' || this.repeatNumber < 0) {
        this.error = true
      } else {
        this.error = false
      }
    },
    addNotification() {
      this.notificationForm.push({
        notificationTimeValuesModel: 1,
        notificationTimeTypeModel: 'minutes',
        notificationPeriodModel: 'before',
        notificationPointModel: 'start time'
      })
    },
    addProcess() {
      const newProcess = { title: this.processTitle, time: this.processTime }
      const db = getDatabase()
      set(
        ref(
          db,
          `${this.$store.getters['users/userId']}/processes/id-${this.processTitle}`
        ),
        newProcess
      )
    },
    deleteNotification(index) {
      this.notificationForm.splice(index, 1)
    },
    addSubtask(newSubtask) {
      this.subtasks.push(newSubtask)
      this.subtaskInput = ''
    }
  }
}
</script>

<style></style>

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
              v-model="processTitle"
              bottom-slots
              label="Title"
              :dense="false"
            >
            </q-input>
            <q-input
              v-model.number="processTime"
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
          v-model.number="form.repeat.repeatNumber"
          type="number"
          min="1"
          label="Repeat count"
          :rules="[(val) => val >= 1 || 'Must be at least 1 repeat']"
        />
        <p class="full-width">Repeat in</p>
        <q-select
          v-model="form.repeat.monthsModel"
          outlined
          :options="monthsOptions"
          label="Months"
          style="width: 50%"
        />
        <q-select
          v-model="form.repeat.weeksModel"
          outlined
          :options="weeksOptions"
          label="Weeks"
          style="width: 50%"
        />
        <q-select
          v-model="form.repeat.daysModel"
          outlined
          :options="daysOptions"
          label="Days"
          style="width: 50%"
        />
        <q-select
          v-model="form.repeat.hoursModel"
          outlined
          :options="hoursOptions"
          label="Hours"
          style="width: 50%"
        />
        <q-select
          v-model="form.repeat.minutesModel"
          outlined
          :options="minutesOptions"
          label="Minutes"
          style="width: 50%"
          :rules="[
            (form.repeat.monthsModel != 0 &&
              form.repeat.weeksModel != 0 &&
              form.repeat.daysModel != 0 &&
              form.repeat.hoursModel != 0 &&
              form.repeat.minutesModel != 0) ||
              'Must be selected at least 1 repeat period'
          ]"
        />
      </q-card-section>
    </q-card-section>

    <q-card-section v-if="errorMessages.length > 0">
      <p
        v-for="errorMessage in errorMessages"
        :key="errorMessage"
        class="text-negative"
      >
        {{ errorMessage }}
      </p>
    </q-card-section>

    <q-card-actions align="right">
      <q-btn
        v-if="editTask"
        color="primary"
        label="Edit"
        :disable="error"
        @click="onEditClick"
      />
      <q-btn
        v-else
        color="primary"
        label="Add"
        :disable="error"
        @click="onOKClick"
      />
      <q-btn color="negative" label="Cancel" @click="onCancelClick" />
    </q-card-actions>
  </q-card>
</template>

<script>
import { date } from 'quasar'
import { getDatabase, ref, set } from 'firebase/database'
export default {
  props: {
    editTask: {
      type: Object,
      required: false,
      default: null
    }
  },
  emits: ['OKEvent', 'cancelEvent', 'editEvent'],

  data() {
    return {
      form: {
        id: '',
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
        processesModel: [],

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
        repeat: {
          repeatNumber: 1,
          monthsModel: 0,
          weeksModel: 0,
          daysModel: 1,
          hoursModel: 0,
          minutesModel: 0
        }
      },
      processTitle: '',
      processTime: 0,
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
      notificationPoint: ['start time', 'end time'],
      errorMessages: []
    }
  },
  computed: {
    error() {
      if (this.form.todoTitle === '') {
        this.addErrorMessage('Title must not be empty')
        return true
      } else if (
        this.form.toggleRepeat == true &&
        (!this.form.repeat.repeatNumber || this.form.repeat.repeatNumber < 1)
      ) {
        this.addErrorMessage(
          'Must be at least 1 repeat number if repeats enabled'
        )
        return true
      } else if (
        this.form.toggleRepeat == true &&
        this.form.repeat.monthsModel == 0 &&
        this.form.repeat.weeksModel == 0 &&
        this.form.repeat.daysModel == 0 &&
        this.form.repeat.hoursModel == 0 &&
        this.form.repeat.minutesModel == 0
      ) {
        this.addErrorMessage(
          'Must be at least 1 repeat time value if repeats enabled'
        )
        return true
      } else if (
        this.form.toggleProcesses == true &&
        this.form.processesModel.length == 0
      ) {
        this.addErrorMessage(
          'Must be at least 1 process selected if processes enabled'
        )
        return true
      } else {
        this.clearErrorMessages()
        return false
      }
    },
    processesList() {
      const processes = this.$store.getters['users/processes']
      let processesArray = []
      for (const process in processes) {
        processesArray.push(processes[process].title)
      }
      return processesArray
    }
  },
  mounted() {
    if (this.editTask) {
      this.form.id = this.editTask.id
      this.form.todoTitle = this.editTask.title
      this.form.eventDate = this.editTask.time
      this.form.toggleEventEnd = this.editTask.endingTime ? true : false
      this.form.eventEndingDate = this.editTask.endingTime
        ? this.editTask.endingTime
        : ''
      this.form.toggleLocation = this.editTask.location ? true : false
      this.form.eventLocation = this.editTask.location
        ? this.editTask.location
        : ''
      this.form.continuousState = this.editTask.continuous
      this.form.toggleProcesses = this.editTask.processes ? true : false
      this.form.processesModel = this.editTask.processes
        ? this.editTask.processes
        : []
      this.form.toggleSubtasks = this.editTask.subtasks ? true : false
      this.form.subtasks = this.editTask.subtasks ? this.editTask.subtasks : []
      this.form.toggleNotification = this.editTask.notifications ? true : false
      this.form.notificationForm = this.editTask.notifications
        ? this.editTask.notifications
        : []
      this.form.toggleRepeat = this.editTask.repeat ? true : false
      if (this.editTask.repeat) {
        this.form.repeat.repeatNumber = this.editTask.repeat.repeatNumber
          ? this.editTask.repeat.repeatNumber
          : 0
        this.form.repeat.monthsModel = this.editTask.repeat.months
          ? this.editTask.repeat.months
          : 0
        this.form.repeat.weeksModel = this.editTask.repeat.weeks
          ? this.editTask.repeat.weeks
          : 0
        this.form.repeat.daysModel = this.editTask.repeat.days
          ? this.editTask.repeat.days
          : 0
        this.form.repeat.hoursModel = this.editTask.repeat.hours
          ? this.editTask.repeat.hours
          : 0
        this.form.repeat.minutesModel = this.editTask.repeat.minutes
          ? this.editTask.repeat.minutes
          : 0
      }
    }
  },
  methods: {
    onOKClick() {
      this.$emit('OKEvent', this.form)
    },
    onCancelClick() {
      this.$emit('cancelEvent')
    },
    onEditClick() {
      this.$emit('editEvent', this.form)
    },

    addNotification() {
      this.form.notificationForm.push({
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
      this.form.notificationForm.splice(index, 1)
    },
    addSubtask(newSubtask) {
      this.form.subtasks.push(newSubtask)
      this.form.subtaskInput = ''
    },
    addErrorMessage(message) {
      if (!this.errorMessages.includes(message)) {
        this.errorMessages.push(message)
      }
    },
    clearErrorMessages() {
      this.errorMessages = []
    }
  }
}
</script>

<style></style>

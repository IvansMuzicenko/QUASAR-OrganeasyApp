<template>
  <q-card :class="editTask ? '' : 'q-dialog-plugin'">
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

      <q-card-section>
        <q-item v-ripple tag="label">
          <q-item-section avatar>
            <q-checkbox v-model="form.progress" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Progress</q-item-label>
            <q-item-label caption>{{
              form.progress ? 'done' : 'undone'
            }}</q-item-label>
          </q-item-section>
        </q-item>
      </q-card-section>

      <q-input v-model="form.eventDate" filled label="Event time">
        <template #prepend>
          <q-icon name="event" class="cursor-pointer">
            <q-popup-proxy
              cover
              transition-show="scale"
              transition-hide="scale"
            >
              <q-date
                v-model="form.eventDate"
                mask="DD-MM-YYYY HH:mm"
                today-btn
              >
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
                now-btn
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
              <q-date
                v-model="form.eventEndingDate"
                mask="DD-MM-YYYY HH:mm"
                today-btn
              >
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
                now-btn
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
      <q-checkbox v-model="form.continuousState" label="Continuous action" />
    </q-card-section>

    <q-card-section>
      <q-toggle v-model="form.toggleProcesses" label="Add processes" />
      <q-card-section v-if="form.toggleProcesses">
        <q-btn outline color="success" class="q-ma-xs">
          Add process
          <q-popup-proxy
            ref="processPopup"
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
            <q-btn flat @click="hideProcess()">Cancel</q-btn>
          </q-popup-proxy>
        </q-btn>

        <q-select
          v-model="form.processesModel"
          outlined
          multiple
          :options="processesList"
          label="Processes"
        />
        Total time: {{ form.processesTime }} minutes
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
          <q-item v-for="(subtask, index) in form.subtasks" :key="subtask">
            <q-item-section avatar>
              <q-btn
                dense
                flat
                :color="subtask['progress'] ? 'negative' : 'positive'"
                :icon="subtask['progress'] ? 'close' : 'check'"
                @click="onSubtaskClick(index, subtask['progress'])"
              ></q-btn>
            </q-item-section>
            <q-item-section :class="subtask['progress'] ? 'text-strike' : ''">{{
              subtask['title']
            }}</q-item-section>
            <q-item-section side>
              <q-btn
                icon="cancel"
                flat
                round
                @click="deleteSubtask(index)"
              ></q-btn
            ></q-item-section>
          </q-item>
        </q-list>
      </q-card-section>
    </q-card-section>

    <q-card-section>
      <q-checkbox
        v-model="form.toggleDefaultNotif"
        label="Default notifications"
      />
    </q-card-section>

    <q-card-section>
      <q-toggle v-model="form.toggleNotifications" label="Add notifications" />
      <q-card-section v-if="form.toggleNotifications">
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
        icon="save"
        color="positive"
        label="Edit"
        :disable="error"
        @click="onEditClick"
      />
      <q-btn
        v-else
        color="positive"
        label="Add"
        :disable="error"
        @click="onOKClick"
      />
      <q-btn color="secondary" label="Cancel" @click="onCancelClick" />
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
  emits: ['OKEvent', 'cancelEvent', 'editEvent', 'subtaskEvent'],

  data() {
    return {
      form: {
        id: '',
        todoTitle: '',
        progress: false,
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
        processesTime: 0,

        toggleSubtasks: false,
        subtasks: [],
        subtaskInput: '',

        toggleDefaultNotif: false,
        toggleNotifications: false,
        notificationForm: [
          {
            notificationTimeValuesModel: 0,
            notificationTimeTypeModel: 'minutes',
            notificationPeriodModel: 'before',
            notificationPointModel: 'start time'
          }
        ],
        notificationsId: [],

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
      monthsOptions: Array.from({ length: 12 }, (_, index) => index),

      weeksOptions: Array.from({ length: 4 }, (_, index) => index),

      daysOptions: Array.from({ length: 31 }, (_, index) => index),

      hoursOptions: Array.from({ length: 24 }, (_, index) => index),

      minutesOptions: Array.from({ length: 60 }, (_, index) => index),
      notificationTimeValues: Array.from({ length: 99 }, (_, index) => index),
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
      for (const process of processes) {
        processesArray.push(process['title'])
      }
      return processesArray
    },
    processesTimeCalc() {
      const processes = this.$store.getters['users/processes']
      const selectedProcesses = this.form.processesModel
      let time = 0
      for (const select of selectedProcesses) {
        for (const process of processes) {
          if (select == process['title']) {
            time += process['time']
          }
        }
      }
      return time
    }
  },
  watch: {
    processesTimeCalc() {
      this.form.processesTime = this.processesTimeCalc
    }
  },
  mounted() {
    this.updateData()
  },
  methods: {
    updateData() {
      if (this.editTask) {
        this.form.id = this.editTask.id
        this.form.todoTitle = this.editTask.title
        this.form.progress = this.editTask.progress
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
        this.form.processesTime = this.editTask.processes
          ? this.editTask.processesTime
          : 0

        this.form.toggleSubtasks = this.editTask.subtasks ? true : false
        this.form.subtasks = this.editTask.subtasks
          ? this.editTask.subtasks
          : []

        this.form.toggleNotifications = this.editTask.notifications
          ? true
          : false
        this.form.notificationForm = this.editTask.notifications
          ? this.editTask.notifications
          : []
        this.form.notificationsId = this.editTask.notificationsId
          ? this.editTask.notificationsId
          : []
        this.form.toggleDefaultNotif = this.editTask.toggleDefaultNotif

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
    async addNotifsId() {
      const notificationsId = []
      if (this.form.toggleDefaultNotif) {
        if (this.form.processesTime != 0) {
          notificationsId.push({
            id:
              (Number(
                date.formatDate(
                  date.subtractFromDate(
                    date.extractDate(this.form.eventDate, 'DD-MM-YYYY HH:mm'),
                    { minutes: this.form.processesTime }
                  ),
                  'x'
                )
              ) +
                2000) /
              1000
          })
        }
        notificationsId.push({
          id:
            (Number(
              date.formatDate(
                date.extractDate(this.form.eventDate, 'DD-MM-YYYY HH:mm'),
                'x'
              )
            ) +
              1000) /
            1000
        })
        if (this.form.toggleEventEnd) {
          notificationsId.push({
            id:
              Number(
                date.formatDate(
                  date.extractDate(
                    this.form.eventEndingDate,
                    'DD-MM-YYYY HH:mm'
                  ),
                  'x'
                )
              ) / 1000
          })
        }
      }
      if (this.form.toggleNotifications) {
        for (const notification of this.form.notificationForm) {
          let time =
            notification.notificationPointModel == 'start time'
              ? this.form.eventDate
              : this.form.eventEndingDate
              ? this.form.eventEndingDate
              : this.form.eventDate
          if (notification.notificationPeriodModel == 'before') {
            time = date.subtractFromDate(
              date.extractDate(time, 'DD-MM-YYYY HH:mm'),
              {
                months:
                  notification.notificationTimeTypeModel == 'months'
                    ? notification.notificationTimeValuesModel
                    : 0,
                days:
                  notification.notificationTimeTypeModel == 'days'
                    ? notification.notificationTimeValuesModel
                    : 0,
                hours:
                  notification.notificationTimeTypeModel == 'hours'
                    ? notification.notificationTimeValuesModel
                    : notification.notificationTimeTypeModel == 'weeks'
                    ? notification.notificationTimeValuesModel * 7
                    : 0,
                minutes:
                  notification.notificationTimeTypeModel == 'minutes'
                    ? notification.notificationTimeValuesModel
                    : 0
              }
            )
          } else {
            time = date.addToDate(date.extractDate(time, 'DD-MM-YYYY HH:mm'), {
              months:
                notification.notificationTimeTypeModel == 'months'
                  ? notification.notificationTimeValuesModel
                  : 0,
              days:
                notification.notificationTimeTypeModel == 'days'
                  ? notification.notificationTimeValuesModel
                  : 0,
              hours:
                notification.notificationTimeTypeModel == 'hours'
                  ? notification.notificationTimeValuesModel
                  : notification.notificationTimeTypeModel == 'weeks'
                  ? notification.notificationTimeValuesModel * 7
                  : 0,
              minutes:
                notification.notificationTimeTypeModel == 'minutes'
                  ? notification.notificationTimeValuesModel
                  : 0
            })
          }
          notificationsId.push({
            id:
              (Number(date.formatDate(time, 'x')) +
                (notification.notificationPeriodModel == 'before' ? 1000 : 0)) /
              1000
          })
        }
      }
      const notifsToRemove = []
      if (this.editTask && this.form.notificationsId.length) {
        for (const notif of this.form.notificationsId) {
          notifsToRemove.push({ id: notif.id })
        }
        await this.$store.dispatch(
          'notification/removeNotifications',
          notifsToRemove
        )
      }
      this.form.notificationsId = notificationsId
    },
    async onSubtaskClick(index, progress) {
      await this.$emit(
        'subtaskEvent',
        this.form.id,
        this.form.eventDate,
        index,
        progress
      )
      this.updateData()
    },
    async onOKClick() {
      await this.addNotifsId()
      this.$emit('OKEvent', this.form)
    },
    onCancelClick() {
      this.$emit('cancelEvent')
    },
    async onEditClick() {
      await this.addNotifsId()
      this.$emit('editEvent', this.form)
    },

    addNotification() {
      this.form.notificationForm.push({
        notificationTimeValuesModel: 0,
        notificationTimeTypeModel: 'minutes',
        notificationPeriodModel: 'before',
        notificationPointModel: 'start time'
      })
    },
    hideProcess() {
      this.$refs.processPopup.hide()
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
      this.form.subtasks.push({ title: newSubtask, progress: false })
      this.form.subtaskInput = ''
    },
    deleteSubtask(index) {
      this.form.subtasks.splice(index, 1)
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

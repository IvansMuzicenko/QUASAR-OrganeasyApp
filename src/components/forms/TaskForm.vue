<template>
  <q-card :class="editTask ? '' : 'q-dialog-plugin'">
    <p v-if="!editTask" class="text-center text-subtitle1 no-margin">
      New task
      <q-btn
        icon="close"
        class="absolute-top-right"
        flat
        dense
        @click="onCancelClick"
      />
    </p>

    <q-card-actions align="center">
      <save-button v-if="editTask" :error="error" @save-event="onSaveClick" />
      <q-btn
        v-else
        color="positive"
        label="Add"
        :disable="error"
        @click="onOKClick"
      />
    </q-card-actions>

    <q-card-section class="no-padding">
      <q-input
        v-model="form.todoTitle"
        bottom-slots
        label="Title"
        :rules="[(val) => val !== '' || 'Title is required']"
        :dense="false"
        class="q-px-md"
      />
    </q-card-section>

    <q-card-section>
      <q-item v-ripple tag="label" class="no-padding">
        <q-item-section avatar>
          <q-toggle v-model="form.progress" />
        </q-item-section>
        <q-item-section>
          <q-item-label>Progress</q-item-label>
          <q-item-label caption>
            {{ form.progress ? 'done' : 'undone' }}
          </q-item-label>
        </q-item-section>
      </q-item>
    </q-card-section>

    <q-card-section>
      <q-toggle v-model="form.continuousState" label="Continuous action" />
    </q-card-section>

    <q-card-section>
      <q-toggle
        v-model="form.toggleDefaultNotif"
        label="Default notifications"
      />
    </q-card-section>

    <q-card-section>
      <q-input v-model="form.eventDate" filled label="Event time">
        <template #prepend>
          <q-icon name="event" class="cursor-pointer">
            <q-popup-proxy
              ref="datePicked"
              cover
              transition-show="scale"
              transition-hide="scale"
            >
              <q-date
                v-model="form.eventDate"
                first-day-of-week="1"
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
      <q-checkbox
        v-if="!form.toggleEventEnd"
        v-model="form.toggleEventEnd"
        label="Add event ending"
      />

      <q-card-section v-if="form.toggleEventEnd" class="row no-padding">
        <q-input
          v-model="form.eventEndingDate"
          filled
          label="Event ending"
          class="col"
        >
          <template #prepend>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy
                ref="endingDatePicked"
                cover
                transition-show="scale"
                transition-hide="scale"
              >
                <q-date
                  v-model="form.eventEndingDate"
                  first-day-of-week="1"
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
        <q-icon
          class="col-1 cursor-pointer float-right"
          color="red"
          name="close"
          size="md"
          @click="form.toggleEventEnd = !form.toggleEventEnd"
        />
      </q-card-section>
    </q-card-section>

    <q-card-section>
      <q-checkbox
        v-if="!form.toggleNotes"
        v-model="form.toggleNotes"
        label="Add notes"
      />
      <q-card-section v-if="form.toggleNotes" class="no-padding">
        <p>
          Notes
          <q-icon
            class="cursor-pointer float-right"
            color="red"
            name="close"
            size="md"
            @click="form.toggleNotes = !form.toggleNotes"
          />
        </p>

        <q-select
          v-if="notesList.length"
          v-model="form.notes.attachedNotes"
          outlined
          multiple
          use-chips
          stack-label
          label="Attach notes"
          :options="notesList"
          :option-label="
            (opt) => (isNoteFavorite(opt['id']) ? `* ${opt.title}` : opt.title)
          "
          emit-value
          map-options
        >
          <template #selected-item="scope">
            <q-chip
              removable
              dense
              :tabindex="scope.tabindex"
              class="q-ma-none"
              @remove="scope.removeAtIndex(scope.index)"
            >
              <q-icon
                v-if="isNoteFavorite(scope.opt['id'])"
                name="star"
                color="yellow"
                size="xs"
              />
              <q-icon
                v-if="noteCategory(scope.opt['id'], 'icon')"
                :name="noteCategory(scope.opt['id'], 'icon')"
                :color="noteCategory(scope.opt['id'], 'color')"
                size="xs"
              />
              {{ scope.opt.title }}
            </q-chip>
          </template>
          <template #option="scope">
            <q-item v-bind="scope.itemProps">
              <q-item-section>
                <q-item-label>
                  <q-icon
                    v-if="isNoteFavorite(scope.opt['id'])"
                    name="star"
                    color="yellow"
                    size="sm"
                    class="q-pa-none q-ma-none q-pr-xs"
                  />
                  <q-icon
                    v-else
                    name="star_outline"
                    size="sm"
                    class="q-pa-none q-ma-none q-pr-xs"
                  />
                  <q-icon
                    :name="noteCategory(scope.opt['id'], 'icon')"
                    :color="noteCategory(scope.opt['id'], 'color')"
                    size="sm"
                    class="q-pa-none q-ma-none q-pr-xs"
                  />
                  {{ scope.opt.title }}
                </q-item-label>
              </q-item-section>
            </q-item>
          </template>
        </q-select>
        <p v-else class="text-secondary">You have not notes to attach</p>
        <editor v-model="form.notes.text" full-width />
      </q-card-section>
    </q-card-section>

    <q-card-section>
      <q-checkbox
        v-if="!form.toggleLocation"
        v-model="form.toggleLocation"
        label="Add locations"
      />
      <q-card-section v-if="form.toggleLocation" class="no-padding">
        <p class="q-mb-none">
          Locations
          <q-btn flat @click="addLocation">+</q-btn>
          <q-icon
            class="col-1 cursor-pointer float-right"
            color="red"
            name="close"
            size="md"
            @click="form.toggleLocation = !form.toggleLocation"
          />
        </p>
        <q-card-section
          v-for="(location, index) in form.eventLocation"
          :key="index"
          class="row"
        >
          <q-input
            v-model="form.eventLocation[index]['address']"
            dense
            outlined
            label="Address"
            class="col"
          />
          <q-input
            v-model="form.eventLocation[index]['description']"
            dense
            outlined
            label="Description"
            class="col"
          />
          <q-icon
            class="cursor-pointer"
            name="close"
            size="xs"
            @click="deleteLocation(index)"
          />
        </q-card-section>
      </q-card-section>
    </q-card-section>

    <q-card-section>
      <q-checkbox
        v-if="!form.toggleProcesses"
        v-model="form.toggleProcesses"
        label="Add processes"
      />
      <q-card-section v-if="form.toggleProcesses" class="row no-padding">
        <q-card-section class="no-padding col">
          <q-select
            v-if="processesList.length"
            v-model="form.processesModel"
            outlined
            multiple
            use-chips
            stack-label
            label="Processes"
            :options="processesList"
            option-label="title"
            emit-value
            map-options
          />
          <p v-else>Processes list is empty</p>
          <q-btn outline color="success" class="q-ma-xs" @click="addProcess">
            Add process
          </q-btn>
          <p>Total time: {{ form.processesTime }} minutes</p>
        </q-card-section>
        <q-icon
          class="col-1 cursor-pointer float-right"
          color="red"
          name="close"
          size="md"
          @click="form.toggleProcesses = !form.toggleProcesses"
        />
      </q-card-section>
    </q-card-section>

    <q-card-section>
      <q-checkbox
        v-if="!form.toggleSubtasks"
        v-model="form.toggleSubtasks"
        label="Add subtasks"
      />
      <q-card-section v-if="form.toggleSubtasks" class="no-padding">
        <p>
          Subtasks
          <q-icon
            class="cursor-pointer float-right"
            color="red"
            name="close"
            size="md"
            @click="form.toggleSubtasks = !form.toggleSubtasks"
          />
        </p>
        <q-card-section class="no-padding">
          <q-input
            v-model="subtaskInput"
            bottom-slots
            label="Subtask"
            :dense="false"
          >
            <template #append>
              <q-btn
                round
                dense
                flat
                icon="add"
                @click="addSubtask(subtaskInput)"
              />
            </template>
          </q-input>

          <q-list v-if="form.subtasks.length" bordered separator>
            <q-item
              v-for="(subtask, index) in form.subtasks"
              :key="subtask"
              class="q-pa-none"
            >
              <q-btn
                dense
                flat
                :color="subtask['progress'] ? 'negative' : 'positive'"
                :icon="subtask['progress'] ? 'close' : 'check'"
                @click="onSubtaskClick(index, subtask['progress'])"
              />
              <q-item-section>
                <div
                  v-if="subtaskEdit != index"
                  :class="subtask['progress'] ? 'text-strike' : ''"
                  class="vertical-middle"
                >
                  <span>
                    {{ subtask['title'] }}
                  </span>

                  <span class="float-right">
                    <q-btn
                      v-if="subtaskEdit != index"
                      icon="edit"
                      flat
                      class="q-px-sm"
                      @click="editSubtask(index)"
                    />
                    <q-btn
                      icon="delete"
                      color="red"
                      flat
                      class="q-px-sm"
                      @click="deleteSubtask(index)"
                    />
                  </span>
                </div>
                <q-input v-if="subtaskEdit == index" v-model="subtask['title']">
                  <template #append>
                    <q-btn
                      v-if="subtaskEdit == index"
                      icon="save"
                      flat
                      class="q-px-sm"
                      @click="editSubtask(index)"
                    />
                    <q-btn
                      icon="delete"
                      color="red"
                      flat
                      class="q-px-sm"
                      @click="deleteSubtask(index)"
                    />
                  </template>
                </q-input>

                <q-separator
                  v-if="subtask['subtasks'] && subtask['subtasks'].length"
                />
                <q-separator
                  v-if="subtask['subtasks'] && subtask['subtasks'].length"
                />
                <q-list separator bordered>
                  <q-item
                    v-for="(subSubtask, subIndex) of subtask['subtasks']"
                    :key="subIndex"
                    dense
                    class="q-px-none"
                  >
                    <q-btn
                      dense
                      flat
                      :color="subSubtask['progress'] ? 'negative' : 'positive'"
                      :icon="subSubtask['progress'] ? 'close' : 'check'"
                      @click="
                        onSubSubtaskClick(
                          index,
                          subIndex,
                          subSubtask['progress']
                        )
                      "
                    />
                    <q-item-section>
                      <span
                        v-if="subtaskEdit != index"
                        :class="subSubtask['progress'] ? 'text-strike' : ''"
                      >
                        {{ subSubtask['title'] }}
                      </span>
                      <q-input
                        v-if="subtaskEdit == index"
                        v-model="subSubtask['title']"
                        dense
                      />
                    </q-item-section>
                    <q-btn
                      icon="delete"
                      color="red"
                      flat
                      round
                      @click="deleteSubSubtask(index, subIndex)"
                    />
                  </q-item>
                </q-list>
                <q-input
                  v-if="subtaskEdit == index"
                  v-model="subSubtaskInput"
                  dense
                  label="Add subSubtask"
                >
                  <template #append>
                    <q-btn
                      round
                      dense
                      flat
                      icon="add"
                      @click="addSubSubtask(subSubtaskInput, index)"
                    />
                  </template>
                </q-input>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>
      </q-card-section>
    </q-card-section>

    <q-card-section>
      <q-checkbox
        v-if="!form.toggleNotifications"
        v-model="form.toggleNotifications"
        label="Add notifications"
      />
      <q-card-section v-if="form.toggleNotifications" class="no-padding">
        <p class="q-mb-none">
          Notifications
          <q-btn flat @click="addNotification()">+</q-btn>
          <q-icon
            class="cursor-pointer float-right"
            color="red"
            name="close"
            size="md"
            @click="form.toggleNotifications = !form.toggleNotifications"
          />
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
          />
          <q-select
            v-model="form.notificationForm[index]['notificationTimeTypeModel']"
            :options="notificationTimeType"
            class="q-ma-xs"
            dense
            style="width: 25%"
          />
          <q-select
            v-model="form.notificationForm[index]['notificationPeriodModel']"
            :options="notificationPeriod"
            class="q-ma-xs"
            dense
            style="width: 20%"
          />
          <q-select
            v-model="form.notificationForm[index]['notificationPointModel']"
            :options="notificationPoint"
            class="q-ma-xs"
            dense
            style="width: 25%"
          />

          <q-icon
            class="cursor-pointer"
            name="close"
            @click="deleteNotification(index)"
          />
        </q-card-section>
      </q-card-section>
    </q-card-section>

    <q-card-section>
      <q-checkbox
        v-if="!form.toggleRepeat"
        v-model="form.toggleRepeat"
        label="Add repeat"
      />
      <q-card-section v-if="form.toggleRepeat" class="flex no-padding">
        <p class="full-width">
          Repeat
          <q-icon
            class="cursor-pointer float-right"
            color="red"
            name="close"
            size="md"
            @click="form.toggleRepeat = !form.toggleRepeat"
          />
        </p>
        <q-select
          v-model="form.repeat.repeatNumber"
          outlined
          :options="repeatCountOptions"
          label="Repeat count"
          style="width: 50%"
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
      <save-button v-if="editTask" :error="error" @save-event="onSaveClick" />
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

import Editor from 'src/components/common/form/Editor.vue'
import AddProcess from 'src/components/common/dialogs/AddProcess.vue'

import SaveButton from 'src/components/common/elements/buttons/SaveButton.vue'

export default {
  components: { Editor, SaveButton },
  props: {
    editTask: {
      type: Object,
      required: false,
      default: null
    },
    exactDate: {
      type: String,
      required: false,
      default: ''
    },
    copy: {
      type: Object,
      required: false,
      default: null
    }
  },
  emits: ['confirmEvent', 'cancelEvent', 'saveEvent', 'error'],

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

        toggleNotes: false,
        notes: {
          text: '',
          attachedNotes: []
        },

        toggleLocation: false,
        eventLocation: [{ address: '', description: '' }],

        continuousState: false,

        toggleProcesses: false,
        processesModel: [],
        processesTime: 0,

        toggleSubtasks: false,
        subtasks: [],

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
      subtaskInput: '',
      subSubtaskInput: '',
      subtaskEdit: null,
      processTitle: '',
      processTime: 0,

      repeatCountOptions: Array.from({ length: 99 }, (_, index) => index + 1),

      monthsOptions: Array.from({ length: 13 }, (_, index) => index),

      weeksOptions: Array.from({ length: 5 }, (_, index) => index),

      daysOptions: Array.from({ length: 32 }, (_, index) => index),

      hoursOptions: Array.from({ length: 25 }, (_, index) => index),

      minutesOptions: Array.from({ length: 61 }, (_, index) => index),
      notificationTimeValues: Array.from({ length: 100 }, (_, index) => index),
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
    eventDate() {
      return this.form.eventDate
    },
    eventEndingDate() {
      return this.form.eventEndingDate
    },
    notesList() {
      const notes = this.$store.getters['users/notes']
      let notesArray = []
      if (Object.keys(notes).length) {
        for (const note in notes) {
          if (notes[note]['favorite']) {
            notesArray.unshift({
              title: notes[note]['title'],
              id: notes[note]['id']
            })
          } else {
            notesArray.push({
              title: notes[note]['title'],
              id: notes[note]['id']
            })
          }
        }
      }
      return notesArray
    },
    processesList() {
      const processes = this.$store.getters['users/processes']
      let processesArray = []
      if (Object.keys(processes).length) {
        for (const process in processes) {
          processesArray.push({
            title: processes[process]['title'],
            id: processes[process]['id']
          })
        }
      }
      return processesArray
    },
    processesTimeCalc() {
      const processes = this.$store.getters['users/processes']
      const selectedProcesses = this.form.processesModel
      let time = 0
      if (Object.keys(processes).length) {
        for (const select in selectedProcesses) {
          for (const process in processes) {
            if (selectedProcesses[select]['id'] == processes[process]['id']) {
              time += processes[process]['time']
            }
          }
        }
      }
      return time
    }
  },
  watch: {
    processesTimeCalc() {
      this.form.processesTime = this.processesTimeCalc
    },
    eventDate() {
      this.$refs['datePicked']?.hide()
    },
    eventEndingDate() {
      if (this.form.toggleEventEnd) {
        this.$refs['endingDatePicked']?.hide()
      }
    },
    error() {
      this.$emit('error', this.error)
    }
  },
  mounted() {
    this.updateData()
  },
  methods: {
    updateData() {
      if (this.exactDate) {
        this.form.eventDate = `${this.exactDate} 00:00`
      }
      if (this.editTask) {
        this.form.id = this.editTask.id
        this.form.todoTitle = this.editTask.title
        this.form.progress = this.editTask.progress
        this.form.eventDate = this.editTask.time
        this.form.continuousState = this.editTask.continuous

        this.form.toggleEventEnd = this.editTask.endingTime ? true : false
        this.form.eventEndingDate = this.editTask.endingTime
          ? this.editTask.endingTime
          : this.form.eventDate

        this.form.toggleLocation = this.editTask.location ? true : false
        this.form.eventLocation = this.editTask.location
          ? this.editTask.location
          : []

        this.form.toggleNotes = this.editTask.notes ? true : false
        this.form.notes.attachedNotes =
          this.editTask.notes && this.editTask.notes.attachedNotes
            ? this.editTask.notes.attachedNotes
            : []
        this.form.notes.text =
          this.editTask.notes && this.editTask.notes.text
            ? this.editTask.notes.text
            : ''

        this.form.toggleProcesses = this.editTask.processes ? true : false
        this.form.processesModel = this.editTask.processes
          ? this.editTask.processes
          : []
        this.form.processesTime = this.processesTimeCalc

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
      }
      if (this.copy) {
        this.form.todoTitle = this.copy.title
        this.form.progress = this.copy.progress
        this.form.eventDate = this.copy.time
        this.form.continuousState = this.copy.continuous

        this.form.toggleEventEnd = this.copy.endingTime ? true : false
        this.form.eventEndingDate = this.copy.endingTime
          ? this.copy.endingTime
          : this.form.eventDate

        this.form.toggleLocation = this.copy.location ? true : false
        this.form.eventLocation = this.copy.location ? this.copy.location : []

        this.form.toggleNotes = this.copy.notes ? true : false
        this.form.notes.attachedNotes =
          this.copy.notes && this.copy.notes.attachedNotes
            ? this.copy.notes.attachedNotes
            : []
        this.form.notes.text =
          this.copy.notes && this.copy.notes.text ? this.copy.notes.text : ''

        this.form.toggleProcesses = this.copy.processes ? true : false
        this.form.processesModel = this.copy.processes
          ? this.copy.processes
          : []
        this.form.processesTime = this.processesTimeCalc

        this.form.toggleSubtasks = this.copy.subtasks ? true : false
        this.form.subtasks = this.copy.subtasks ? this.copy.subtasks : []

        this.form.toggleNotifications = this.copy.notifications ? true : false
        this.form.notificationForm = this.copy.notifications
          ? this.copy.notifications
          : []
        this.form.notificationsId = this.copy.notificationsId
          ? this.copy.notificationsId
          : []
        this.form.toggleDefaultNotif = this.copy.toggleDefaultNotif
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
      if (
        this.$q.platform.is.capacitor &&
        this.editTask &&
        this.form.notificationsId.length
      ) {
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
    isNoteFavorite(id) {
      const note = this.$store.getters['users/notes'][`id-${id}`]
      if (note) {
        return note['favorite']
      }
      return false
    },
    noteCategory(id, type) {
      const note = this.$store.getters['users/notes'][`id-${id}`]
      if (note) {
        const categoryId = note['category']
        if (categoryId) {
          const category =
            this.$store.getters['users/categories'][`id-${categoryId}`]
          if (category) {
            if (type == 'icon') {
              return category['icon']
            } else if (type == 'color') {
              return category['color']
            }
          }
        }
      }
      return ''
    },
    onSubtaskClick(index, progress) {
      this.form.subtasks[index]['progress'] = !progress
    },
    onSubSubtaskClick(index, subIndex, progress) {
      this.form.subtasks[index]['subtasks'][subIndex]['progress'] = !progress
    },
    async onOKClick() {
      await this.addNotifsId()
      this.$emit('confirmEvent', this.form)
    },
    onCancelClick() {
      this.$emit('cancelEvent')
    },
    async onSaveClick() {
      await this.addNotifsId()
      this.$emit('saveEvent', this.form)
    },

    addNotification() {
      this.form.notificationForm.push({
        notificationTimeValuesModel: 0,
        notificationTimeTypeModel: 'minutes',
        notificationPeriodModel: 'before',
        notificationPointModel: 'start time'
      })
    },
    addLocation() {
      this.form.eventLocation.push({ address: '', description: '' })
    },
    hideProcess() {
      this.$refs.processPopup.hide()
    },
    addProcess() {
      this.$q.dialog({
        component: AddProcess
      })
    },
    deleteNotification(index) {
      this.form.notificationForm.splice(index, 1)
    },
    deleteLocation(index) {
      this.form.eventLocation.splice(index, 1)
    },
    addSubtask(newSubtask) {
      this.form.subtasks.push({ title: newSubtask, progress: false })
      this.subtaskInput = ''
    },
    editSubtask(index) {
      if (this.subtaskEdit == index) {
        this.subtaskEdit = null
      } else {
        this.subtaskEdit = index
      }
      this.subSubtaskInput = ''
    },
    addSubSubtask(newSubSubtask, index) {
      if (typeof this.form.subtasks[index]['subtasks'] != 'object') {
        this.form.subtasks[index]['subtasks'] = []
      }
      this.form.subtasks[index]['subtasks'].push({
        title: newSubSubtask,
        progress: false
      })
      this.subSubtaskInput = ''
    },
    deleteSubtask(index) {
      this.form.subtasks.splice(index, 1)
    },
    deleteSubSubtask(index, subIndex) {
      this.form.subtasks[index]['subtasks'].splice(subIndex, 1)
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

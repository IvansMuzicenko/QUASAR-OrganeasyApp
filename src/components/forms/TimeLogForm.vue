<template>
  <q-card class="q-dialog-plugin">
    <div v-show="!typeSelected && !editTimeLog" class="column">
      <p class="text-center text-subtitle1 no-margin">
        Please choose time-log type
        <q-btn
          icon="close"
          class="absolute-top-right"
          flat
          dense
          @click="onCancelClick"
        />
      </p>
      <q-btn @click="startTypeSelected">Started</q-btn>
      <q-btn @click="endTypeSelected">Ended</q-btn>
      <q-btn v-if="lastLoggedTime" @click="fromLastLogToSelectedTypeSelected">
        From Last Log To {{ exactTime ? 'Selected' : 'Current' }} Time
      </q-btn>
      <q-btn
        v-if="!exactTime && lastLoggedTime"
        @click="fromLastLogTypeSelected"
      >
        From Last Log End
      </q-btn>
    </div>
    <div v-show="typeSelected || editTimeLog">
      <p class="text-center text-subtitle1 no-margin">
        {{ editTimeLog ? 'Edit time-log' : 'New time-log' }}
        <q-btn
          icon="close"
          class="absolute-top-right"
          flat
          dense
          @click="onCancelClick"
        />
      </p>
      <q-card-section class="row">
        <q-select
          v-model="form.logProcessId"
          filled
          use-input
          input-debounce
          hide-bottom-space
          class="full-width"
          emit-value
          map-options
          :options="logProcesses"
          :error="errorFields.includes('logProcess')"
          error-message="Please select logProcess or create new"
          label="LogProcess"
          behavior="menu"
          option-value="id"
          @filter="logProcessFilter"
          @keydown.tab="selectFirstOfLogProcesses()"
        >
          <template #no-option>
            <q-item>
              <q-item-section class="text-grey">No results</q-item-section>
            </q-item>
          </template>
          <template v-if="form.logProcessId" #append>
            <q-icon
              name="cancel"
              class="cursor-pointer"
              @click.stop.prevent="form.logProcessId = ''"
            />
          </template>
          <template #selected-item="scope">
            <div class="column items-start">
              <q-chip v-if="scope.opt.category">
                <q-avatar
                  :icon="
                    scope.opt.category
                      ? logCategories[`id-${scope.opt.category}`]['icon']
                      : ''
                  "
                  :color="
                    scope.opt.category
                      ? logCategories[`id-${scope.opt.category}`]['color']
                      : ''
                  "
                  text-color="white"
                />
                {{
                  scope.opt.category
                    ? logCategories[`id-${scope.opt.category}`]['title']
                    : ''
                }}
              </q-chip>
              {{ scope.opt.title }}
            </div>
          </template>
          <template #option="scope">
            <q-item v-bind="scope.itemProps">
              <q-item-section>
                <q-item-label class="column items-start">
                  <q-chip v-if="scope.opt.category">
                    <q-avatar
                      :icon="
                        scope.opt.category
                          ? logCategories[`id-${scope.opt.category}`]['icon']
                          : ''
                      "
                      :color="
                        scope.opt.category
                          ? logCategories[`id-${scope.opt.category}`]['color']
                          : ''
                      "
                      text-color="white"
                    />
                    {{
                      scope.opt.category
                        ? logCategories[`id-${scope.opt.category}`]['title']
                        : ''
                    }}
                  </q-chip>
                  {{ scope.opt.title }}
                </q-item-label>
              </q-item-section>
            </q-item>
          </template>
        </q-select>
        <q-btn @click="addLogProcess()">Create Log Process</q-btn>
      </q-card-section>

      <q-card-section>
        <q-input
          v-model="form.date"
          filled
          hide-bottom-space
          :error="errorFields.includes('date')"
          error-message="Please provide date in format DD-MM-YYYY"
          mask="##-##-####"
          fill-mask="#"
          label="Date"
        >
          <template #append>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy
                ref="datePicker"
                cover
                transition-show="scale"
                transition-hide="scale"
              >
                <q-date
                  v-model="form.date"
                  first-day-of-week="1"
                  mask="DD-MM-YYYY"
                  today-btn
                >
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="Close" color="primary" flat />
                  </div>
                </q-date>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
      </q-card-section>

      <q-card-section class="row">
        <q-btn
          class="modify-button"
          unelevated
          outline
          @click="form.timeFrom = modifyQuarter('from', form.timeFrom, -1)"
        >
          -
        </q-btn>
        <q-input
          v-model="form.timeFrom"
          debounce="1000"
          hide-bottom-space
          outlined
          :error="errorFields.includes('timeFrom')"
          error-message="Please provide correct time"
          mask="time"
          fill-mask="-"
          :bg-color="timesModifiers[0] === 'from' ? 'blue-2' : ''"
          label="Time from:"
          class="col"
        >
          <template #append>
            <q-icon name="access_time" class="cursor-pointer">
              <q-popup-proxy
                ref="fromPicker"
                cover
                transition-show="scale"
                transition-hide="scale"
              >
                <q-time
                  v-model="form.timeFrom"
                  mask="HH:mm"
                  now-btn
                  :minute-options="hourQuartersOptions"
                  format24h
                >
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="Close" color="primary" flat />
                  </div>
                </q-time>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
        <q-btn
          class="modify-button"
          unelevated
          outline
          @click="form.timeFrom = modifyQuarter('from', form.timeFrom)"
        >
          +
        </q-btn>
      </q-card-section>
      <q-card-section class="row">
        <q-btn
          class="modify-button"
          unelevated
          outline
          @click="form.timeTo = modifyQuarter('to', form.timeTo, -1)"
        >
          -
        </q-btn>
        <q-input
          v-model="form.timeTo"
          debounce="1000"
          hide-bottom-space
          outlined
          :error="errorFields.includes('timeTo')"
          error-message="Please provide correct time"
          mask="time"
          fill-mask="-"
          :bg-color="timesModifiers[0] === 'to' ? 'blue-2' : ''"
          label="Time to:"
          class="col"
        >
          <template #append>
            <q-icon name="access_time" class="cursor-pointer">
              <q-popup-proxy
                ref="toPicker"
                cover
                transition-show="scale"
                transition-hide="scale"
              >
                <q-time
                  v-model="form.timeTo"
                  mask="HH:mm"
                  now-btn
                  :minute-options="hourQuartersOptions"
                  format24h
                >
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="Close" color="primary" flat />
                  </div>
                </q-time>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
        <q-btn
          class="modify-button"
          unelevated
          outline
          @click="form.timeTo = modifyQuarter('to', form.timeTo)"
        >
          +
        </q-btn>
      </q-card-section>
      <q-card-section class="row">
        <q-btn
          class="modify-button"
          unelevated
          outline
          @click="form.timeSpent = modifyQuarter('spent', form.timeSpent, -1)"
        >
          -
        </q-btn>
        <q-input
          v-model="form.timeSpent"
          debounce="1000"
          hide-bottom-space
          outlined
          :error="errorFields.includes('timeSpent')"
          error-message="Please provide correct time"
          mask="time"
          fill-mask="-"
          :bg-color="timesModifiers[0] === 'spent' ? 'blue-2' : ''"
          label="Time spent:"
          class="col"
        >
          <template #append>
            <q-icon name="update" class="cursor-pointer">
              <q-popup-proxy
                ref="spentPicker"
                cover
                transition-show="scale"
                transition-hide="scale"
              >
                <q-time
                  v-model="form.timeSpent"
                  mask="HH:mm"
                  :minute-options="hourQuartersOptions"
                  format24h
                >
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="Close" color="primary" flat />
                  </div>
                </q-time>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
        <q-btn
          class="modify-button"
          unelevated
          outline
          @click="form.timeSpent = modifyQuarter('spent', form.timeSpent)"
        >
          +
        </q-btn>
      </q-card-section>

      <q-card-section>
        <editor v-model="form.description" min-height="2rem" />
      </q-card-section>

      <q-card-section v-if="error">
        <p class="text-negative">Please correct fields in form</p>
      </q-card-section>
      <q-card-actions align="right">
        <save-button
          v-if="editTimeLog"
          :error="error"
          @save-event="onSaveClick()"
        />
        <q-btn
          v-if="!editTimeLog"
          color="positive"
          :disable="error"
          label="OK"
          @click="onOKClick"
        />
        <q-btn color="primary" label="Cancel" @click="onCancelClick" />
        <item-remove
          v-if="editTimeLog"
          :item="form"
          type="time-log"
          @delete-event="onCancelClick()"
        />
      </q-card-actions>
    </div>
  </q-card>
</template>
<script>
import { date } from 'quasar'
import AddLogProcess from 'src/components/common/dialogs/AddLogProcess.vue'
import Editor from 'src/components/common/form/Editor.vue'
import ItemRemove from 'src/components/common/groups/ItemRemove.vue'
import SaveButton from 'src/components/common/elements/buttons/SaveButton.vue'
import { convertTimeToMinutes, convertMinutesToTime } from 'src/dateTimeHelper'

export default {
  components: { Editor, ItemRemove, SaveButton },
  props: {
    exactDate: {
      type: String,
      required: false,
      default: null
    },
    exactTime: {
      type: String,
      required: false,
      default: null
    },
    editTimeLog: {
      type: Object,
      required: false,
      default: null
    }
  },
  emits: ['cancelEvent', 'confirmEvent', 'update:modelValue'],
  data() {
    return {
      form: {
        logProcessId: '',
        date: '',
        timeFrom: '',
        timeTo: '',
        timeSpent: '',
        description: ''
      },
      timesModifiers: ['from', 'spent'],
      logProcesses: [],
      hourQuartersOptions: [0, 15, 30, 45],
      pauseWatch: true,
      errorFields: [],
      errorsActivated: false,
      typeSelected: false,
      lastLoggedTime: ''
    }
  },
  computed: {
    error() {
      if (this.errorsActivated) {
        this.clearErrorFields()
        if (this.form.logProcessId === '') {
          this.addErrorField('logProcess')
        }
        if (this.form.date.includes('#')) {
          this.addErrorField('date')
        }
        let timeFrom = convertTimeToMinutes(this.form.timeFrom)
        let timeTo = convertTimeToMinutes(this.form.timeTo)
        let timeSpent = convertTimeToMinutes(this.form.timeSpent)
        if (
          this.form.timeFrom.includes('-') ||
          timeFrom > timeTo - 15 ||
          timeFrom < 0
        ) {
          this.addErrorField('timeFrom')
        }
        if (
          this.form.timeTo.includes('-') ||
          timeTo < timeFrom + 15 ||
          timeFrom > 1440
        ) {
          this.addErrorField('timeTo')
        }
        if (
          this.form.timeSpent.includes('-') ||
          timeTo - timeFrom < 15 ||
          timeTo - timeFrom !== timeSpent ||
          timeSpent > 1425
        ) {
          this.addErrorField('timeSpent')
        }
      }

      if (this.errorFields.length) {
        return true
      }
      return false
    },
    logCategories() {
      return this.$store.getters['users/logCategories'] || {}
    },

    allLogProcesses() {
      // maybe should be with name allLogProcesses
      // option-value and option-label can be used to not assign twice same values
      const vuexLogProcesses = this.$store.getters['users/logProcesses']
      let logProcessesArray = []
      for (const vuexLogProcess in vuexLogProcesses) {
        const logProcess = {}
        Object.assign(logProcess, vuexLogProcesses[vuexLogProcess])
        logProcessesArray.push(logProcess)
      }
      return logProcessesArray
    }
  },
  watch: {
    'form.date'() {
      this.$refs['datePicker']?.hide()
    },
    'form.timeFrom'(newTime, oldTime) {
      this.modifyTime('from', newTime, oldTime)
    },
    'form.timeTo'(newTime, oldTime) {
      this.modifyTime('to', newTime, oldTime)
    },
    'form.timeSpent'(newTime, oldTime) {
      this.modifyTime('spent', newTime, oldTime)
    }
  },
  mounted() {
    if (this.editTimeLog) {
      let timeLog =
        this.$store.getters['users/timeLogs'][`date-${this.editTimeLog.date}`][
          `id-${this.editTimeLog.id}`
        ]
      Object.assign(this.form, timeLog)
      this.logProcesses = this.allLogProcesses
      return
    }
    this.form.date = this.exactDate ?? this.$route.query.date
    this.lastLoggedTime = this.getDateLastLog(this.form.date)
    this.form.timeFrom =
      this.exactTime ?? this.roundTime(date.formatDate(new Date(), 'HH:mm'))
    this.form.timeTo = this.modifyQuarter('to', this.form.timeFrom)
  },
  methods: {
    addLogProcess() {
      this.$q
        .dialog({
          component: AddLogProcess,
          componentProps: {
            selectOnSave: true
          }
        })
        .onOk((selectOnSave = false) => {
          if (selectOnSave) {
            this.logProcesses = this.allLogProcesses
            this.form.logProcessId = selectOnSave
          }
        })
    },
    startTypeSelected() {
      this.form.timeFrom =
        this.exactTime ?? this.roundTime(date.formatDate(new Date(), 'HH:mm'))
      this.form.timeTo = this.modifyQuarter('to', this.form.timeFrom)
      this.typeSelected = true
    },
    endTypeSelected() {
      this.form.timeTo =
        this.exactTime ?? this.roundTime(date.formatDate(new Date(), 'HH:mm'))
      this.form.timeFrom = this.modifyQuarter('from', this.form.timeTo, -1)
      this.typeSelected = true
    },
    fromLastLogToSelectedTypeSelected() {
      this.form.timeFrom = this.lastLoggedTime
      this.form.timeTo =
        this.exactTime ?? this.roundTime(date.formatDate(new Date(), 'HH:mm'))
      this.typeSelected = true
    },
    fromLastLogTypeSelected() {
      this.form.timeFrom = this.lastLoggedTime
      this.form.timeTo = this.modifyQuarter('to', this.form.timeFrom)
      this.typeSelected = true
    },
    onCancelClick() {
      this.$emit('cancelEvent')
    },
    onOKClick() {
      this.errorsActivated = true
      if (this.error) {
        return
      }
      this.$emit('confirmEvent', this.form)
    },
    onSaveClick() {
      this.errorsActivated = true
      if (this.error) {
        return
      }
      this.$emit('confirmEvent', this.form)
    },
    logProcessFilter(val, update) {
      if (val === '') {
        update(() => {
          this.logProcesses = this.allLogProcesses
        })
        return
      }

      update(() => {
        const needle = val.toLowerCase()
        this.logProcesses = this.allLogProcesses.filter(
          (el) => el.title.toLowerCase().indexOf(needle) > -1
        )
      })
    },
    selectFirstOfLogProcesses() {
      if (this.logProcesses[0] !== undefined) {
        this.form.logProcessId = this.logProcesses[0]
      }
    },
    addErrorField(type) {
      if (!this.errorFields.includes(type)) {
        this.errorFields.push(type)
      }
    },
    clearErrorFields() {
      this.errorFields = []
    },
    modifyTime(type, newTime, oldTime) {
      let typeCapitilized = type[0].toUpperCase() + type.slice(1)

      if (!this.canModify(type, newTime)) {
        this.pauseWatch = true
        return (this.form[`time${typeCapitilized}`] = oldTime)
      }
      if (newTime !== this.roundTime(newTime)) {
        return (this.form[`time${typeCapitilized}`] = this.roundTime(newTime))
      }

      if (this.pauseWatch) return (this.pauseWatch = false)
      this.$refs[`${type}Picker`].hide()

      if (oldTime && this.timesModifiers.slice(-1)[0] !== type) {
        this.timesModifiers.push(type)
        this.timesModifiers.shift()
      }
      this.calcTimes()
    },

    roundTime(time) {
      let minutes = Math.floor(convertTimeToMinutes(time) / 15) * 15
      if (convertTimeToMinutes(time) > 1440) {
        return convertMinutesToTime(1440)
      } else if (convertTimeToMinutes(time) < 0) {
        return convertMinutesToTime(0)
      }
      return convertMinutesToTime(minutes)
    },

    modifyQuarter(type, time, modifier = 1) {
      let timeInMinutes = convertTimeToMinutes(time)
      if (this.timesModifiers.slice(-1)[0] !== type) {
        this.timesModifiers.push(type)
        this.timesModifiers.shift()
      }
      if (
        (timeInMinutes === 1440 && modifier === 1) ||
        (timeInMinutes === 0 && modifier === -1)
      ) {
        return time
      }
      return convertMinutesToTime(timeInMinutes + modifier * 15)
    },

    calcTimes() {
      this.pauseWatch = true

      if (typeof this.calcSpent(this.timesModifiers) === 'number') {
        return (this.form.timeSpent = convertMinutesToTime(
          this.calcSpent(this.timesModifiers)
        ))
      }
      if (typeof this.calcTo(this.timesModifiers) === 'number') {
        return (this.form.timeTo = convertMinutesToTime(
          this.calcTo(this.timesModifiers)
        ))
      }
      if (typeof this.calcFrom(this.timesModifiers) === 'number') {
        return (this.form.timeFrom = convertMinutesToTime(
          this.calcFrom(this.timesModifiers)
        ))
      }
    },

    canModify(type, value) {
      value = this.roundTime(value)
      if (value.length < 5) return false
      if (this.pauseWatch) return true
      let timesModifiersCheck = this.timesModifiers
      if (timesModifiersCheck.slice(-1)[0] !== type) {
        timesModifiersCheck.push(type)
        timesModifiersCheck.shift()
      }
      let result = ''
      if (typeof this.calcFrom(timesModifiersCheck, value, type) === 'number') {
        result = this.calcFrom(timesModifiersCheck, value, type)
        return result >= 0 && result <= 1425
      }
      if (typeof this.calcTo(timesModifiersCheck, value, type) === 'number') {
        result = this.calcTo(timesModifiersCheck, value, type)
        return result >= 15 && result <= 1440
      }
      if (
        typeof this.calcSpent(timesModifiersCheck, value, type) === 'number'
      ) {
        result = this.calcSpent(timesModifiersCheck, value, type)
        return result >= 15 && result <= 1440
      }

      return false
    },

    calcFrom(timesModifiers, value = '', type = '') {
      if (timesModifiers.includes('to') && timesModifiers.includes('spent')) {
        let difference = convertTimeToMinutes(
          type === 'spent' ? value : this.form.timeSpent
        )
        return (
          convertTimeToMinutes(type === 'to' ? value : this.form.timeTo) -
          difference
        )
      }
      return false
    },

    calcTo(timesModifiers, value = '', type = '') {
      if (timesModifiers.includes('from') && timesModifiers.includes('spent')) {
        let difference = convertTimeToMinutes(
          type === 'spent' ? value : this.form.timeSpent
        )
        return (
          convertTimeToMinutes(type === 'from' ? value : this.form.timeFrom) +
          difference
        )
      }
      return false
    },

    calcSpent(timesModifiers, value = '', type = '') {
      if (timesModifiers.includes('from') && timesModifiers.includes('to')) {
        let difference =
          convertTimeToMinutes(type === 'to' ? value : this.form.timeTo) -
          convertTimeToMinutes(type === 'from' ? value : this.form.timeFrom)
        return difference
      }
      return false
    },
    getDateLastLog(date) {
      let dateLogs = this.$store.getters['users/timeLogs'][`date-${date}`]
      if (!dateLogs) {
        return ''
      }
      let latestLog = '00:00'
      for (let timeLog of Object.values(dateLogs)) {
        if (
          convertTimeToMinutes(latestLog) < convertTimeToMinutes(timeLog.timeTo)
        ) {
          latestLog = timeLog.timeTo
        }
      }
      return latestLog
    }
  }
}
</script>
<style lang="scss">
.modify-button {
  height: 56px;
  width: 56px;
}
</style>

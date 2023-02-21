<template>
  <q-card class="q-dialog-plugin">
    <p v-if="!editState" class="text-center text-subtitle1 no-margin">
      New time-log
      <q-btn
        icon="close"
        class="absolute-top-right"
        flat
        dense
        @click="onCancelClick"
      />
    </p>
    <q-card-section>
      <q-select
        filled
        :model-value="form.issue"
        hide-selected
        use-input
        fill-input
        emit-value
        map-options
        input-debounce
        :options="issues"
        hint="Issue or title"
        @filter="issueFilter"
        @input-value="setIssueModel"
      >
        <template #no-option>
          <q-item>
            <q-item-section class="text-grey">No results</q-item-section>
          </q-item>
        </template>
        <template v-if="form.issue" #append>
          <q-icon
            name="cancel"
            class="cursor-pointer"
            @click.stop.prevent="form.issue = null"
          />
        </template>
      </q-select>
    </q-card-section>

    <q-card-section>
      <q-input v-model="form.date" filled label="Date">
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
      <q-btn @click="form.timeFrom = modifyQuarter(form.timeFrom, -1)">-</q-btn>
      <q-input
        v-model="form.timeFrom"
        debounce
        outlined
        mask="time"
        fill-mask="-"
        label="Time from:"
        :rules="[
          (val) =>
            (convertTimeToMinutes(val) >= 0 &&
              convertTimeToMinutes(val) <= 1425 &&
              convertTimeToMinutes(val) % 15 === 0 &&
              !val.includes('-')) ||
            'Please provide correct time'
        ]"
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
      <q-btn @click="form.timeFrom = modifyQuarter(form.timeFrom)">+</q-btn>
    </q-card-section>
    <q-card-section class="row">
      <q-btn @click="form.timeTo = modifyQuarter(form.timeTo, -1)">-</q-btn>
      <q-input
        v-model="form.timeTo"
        debounce
        outlined
        mask="time"
        fill-mask="-"
        label="Time to:"
        :rules="[
          (val) =>
            (convertTimeToMinutes(val) >= 15 &&
              convertTimeToMinutes(val) <= 1440 &&
              convertTimeToMinutes(val) % 15 === 0 &&
              !val.includes('-')) ||
            'Please provide correct time'
        ]"
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
      <q-btn @click="form.timeTo = modifyQuarter(form.timeTo)">+</q-btn>
    </q-card-section>
    <q-card-section class="row">
      <q-btn @click="form.timeSpent = modifyQuarter(form.timeSpent, -1)">
        -
      </q-btn>
      <q-input
        v-model="form.timeSpent"
        debounce
        outlined
        mask="time"
        fill-mask="-"
        label="Time spent:"
        :rules="[
          (val) =>
            (convertTimeToMinutes(val) >= 15 &&
              convertTimeToMinutes(val) <= 1440 &&
              convertTimeToMinutes(val) % 15 === 0 &&
              !val.includes('-')) ||
            'Please provide correct time'
        ]"
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
      <q-btn @click="form.timeSpent = modifyQuarter(form.timeSpent)">+</q-btn>
    </q-card-section>

    <q-card-section>
      <editor v-model="form.description" />
    </q-card-section>
    <q-card-section v-if="error">
      <p class="text-negative">error message</p>
    </q-card-section>
    <q-card-actions align="right">
      <save-button v-if="editState" :error="error" @saveEvent="onSaveClick" />
      <q-btn
        v-if="!editState"
        color="positive"
        :disable="error"
        label="OK"
        @click="onOKClick"
      />
      <q-btn color="primary" label="Cancel" @click="onCancelClick" />
      <item-remove
        v-if="editState"
        :item="editState"
        type="process"
        @deleteEvent="deleteClick()"
      />
    </q-card-actions>
  </q-card>
</template>
<script>
import { date } from 'quasar'

import Editor from 'src/components/common/form/Editor.vue'
import ItemRemove from 'src/components/common/groups/ItemRemove.vue'
import SaveButton from 'src/components/common/elements/buttons/SaveButton.vue'

export default {
  components: { Editor, ItemRemove, SaveButton },
  props: {
    exactDate: {
      type: Date,
      required: false,
      default: null
    },
    exactTime: {
      type: Date,
      required: false,
      default: null
    },
    editState: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  emits: ['cancelEvent', 'OKEvent'],
  data() {
    return {
      form: {
        issue: null,
        date: '',
        timeFrom: '',
        timeTo: '',
        timeSpent: '',
        description: ''
      },
      timesModifiers: ['from', 'to'],
      issues: [
        { label: '123', value: 123 },
        { label: 'asd', value: 345 }
      ],
      allIssues: [
        { label: '123', value: 123 },
        { label: 'asd', value: 345 }
      ],
      hourQuartersOptions: [0, 15, 30, 45],
      pauseWatch: true
    }
  },
  computed: {
    error() {
      if (this.form.issue === '') {
        // this.addErrorMessage('Title must not be empty')
        // return true
        return false
      }
      return false
    }
  },
  watch: {
    'form.date'() {
      this.$refs['datePicker']?.hide()
    },
    'form.timeFrom'(newTime, oldTime) {
      console.log(newTime)
      if (!this.canModify('from', newTime)) {
        this.pauseWatch = true
        return (this.form.timeFrom = oldTime)
      }
      if (newTime !== this.roundTime(newTime)) {
        return (this.form.timeFrom = this.roundTime(newTime))
      }

      if (this.pauseWatch) return (this.pauseWatch = false)
      this.$refs.fromPicker.hide()

      if (oldTime && this.timesModifiers.slice(-1)[0] !== 'from') {
        this.timesModifiers.push('from')
        this.timesModifiers.shift()
      }
      this.calcTimes()
    },
    'form.timeTo'(newTime, oldTime) {
      console.log(newTime)
      if (!this.canModify('to', newTime)) {
        this.pauseWatch = true
        return (this.form.timeTo = oldTime)
      }
      if (newTime !== this.roundTime(newTime)) {
        console.log(this.roundTime(newTime))
        return (this.form.timeTo = this.roundTime(newTime))
      }

      //when trying to update time to 24;00 if it is greater then input not updating
      if (this.pauseWatch) return (this.pauseWatch = false)
      this.$refs.toPicker.hide()

      if (oldTime && this.timesModifiers.slice(-1)[0] !== 'to') {
        this.timesModifiers.push('to')
        this.timesModifiers.shift()
      }
      this.calcTimes()
    },
    'form.timeSpent'(newTime, oldTime) {
      if (!this.canModify('spent', newTime)) {
        this.pauseWatch = true
        return (this.form.timeSpent = oldTime)
      }
      if (newTime !== this.roundTime(newTime)) {
        return (this.form.timeSpent = this.roundTime(newTime))
      }

      if (this.pauseWatch) return (this.pauseWatch = false)
      this.$refs.spentPicker.hide()

      if (oldTime && this.timesModifiers.slice(-1)[0] !== 'spent') {
        this.timesModifiers.push('spent')
        this.timesModifiers.shift()
      }
      this.calcTimes()
    }
  },
  mounted() {
    this.form.date = this.exactDate ?? date.formatDate(new Date(), 'DD-MM-YYYY')
    this.form.timeFrom =
      this.exactTime ?? this.roundTime(date.formatDate(new Date(), 'HH:mm'))
    this.form.timeTo = this.modifyQuarter(this.form.timeFrom)
  },
  methods: {
    onCancelClick() {
      this.$emit('cancelEvent')
    },
    onOKClick() {
      this.$emit('OKEvent', this.form)
    },
    issueFilter(val, update, abort) {
      update(() => {
        const needle = val.toLowerCase()
        this.issues = this.allIssues.filter(
          (el) => el.label.toLowerCase().indexOf(needle) > -1
        )
      })
    },
    setIssueModel(val) {
      this.form.issue = val
    },

    roundTime(time) {
      let minutes = Math.floor(this.convertTimeToMinutes(time) / 15) * 15
      if (this.convertTimeToMinutes(time) > 1440) {
        return this.convertMinutesToTime(1440)
      } else if (this.convertTimeToMinutes(time) < 0) {
        return this.convertMinutesToTime(0)
      }
      return this.convertMinutesToTime(minutes)
    },

    modifyQuarter(time, modifier = 1) {
      let timeInMinutes = this.convertTimeToMinutes(time)
      if (
        (timeInMinutes === 1440 && modifier === 1) ||
        (timeInMinutes === 0 && modifier === -1)
      ) {
        return time
      }
      return this.convertMinutesToTime(timeInMinutes + modifier * 15)
    },

    calcTimes() {
      this.pauseWatch = true

      if (typeof this.calcSpent(this.timesModifiers) === 'number') {
        return (this.form.timeSpent = this.convertMinutesToTime(
          this.calcSpent(this.timesModifiers)
        ))
      }
      if (typeof this.calcTo(this.timesModifiers) === 'number') {
        return (this.form.timeTo = this.convertMinutesToTime(
          this.calcTo(this.timesModifiers)
        ))
      }
      if (typeof this.calcFrom(this.timesModifiers) === 'number') {
        return (this.form.timeFrom = this.convertMinutesToTime(
          this.calcFrom(this.timesModifiers)
        ))
      }
    },

    convertTimeToMinutes(time) {
      return Number(time.split(':')[1]) + Number(time.split(':')[0]) * 60
    },

    convertMinutesToTime(minutes) {
      let timeHours = Math.floor(minutes / 60).toString()
      timeHours = (timeHours.length === 1 ? '0' : '') + timeHours
      let timeMinutes = (minutes % 60).toString()
      timeMinutes = timeMinutes + (timeMinutes.length === 1 ? '0' : '')
      return `${timeHours}:${timeMinutes}`
    },

    canModify(type, value) {
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

      //TODO can't go lower than 15 on from
      return false //result >= 0 && result <= 1440 last modifictions
    },

    calcFrom(timesModifiers, value = '', type = '') {
      if (timesModifiers.includes('to') && timesModifiers.includes('spent')) {
        let difference = this.convertTimeToMinutes(
          type === 'spent' ? value : this.form.timeSpent
        )
        return (
          this.convertTimeToMinutes(type === 'to' ? value : this.form.timeTo) -
          difference
        )
      }
      return false
    },

    calcTo(timesModifiers, value = '', type = '') {
      if (timesModifiers.includes('from') && timesModifiers.includes('spent')) {
        let difference = this.convertTimeToMinutes(
          type === 'spent' ? value : this.form.timeSpent
        )
        return (
          this.convertTimeToMinutes(
            type === 'from' ? value : this.form.timeFrom
          ) + difference
        )
      }
      return false
    },

    calcSpent(timesModifiers, value = '', type = '') {
      if (timesModifiers.includes('from') && timesModifiers.includes('to')) {
        let difference =
          this.convertTimeToMinutes(type === 'to' ? value : this.form.timeTo) -
          this.convertTimeToMinutes(
            type === 'from' ? value : this.form.timeFrom
          )
        return difference
      }
      return false
    }
  }
}
</script>

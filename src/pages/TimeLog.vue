<template>
  <q-page
    v-touch-swipe:3e-2:10:100.mouse.horizontal="handleSwipe"
    class="relative-position"
  >
    <time-log-header
      ref="timeLogsHeader"
      :is-today="isToday"
      :is-selected="isSelected"
      :get-day-date="getDayDate"
      @date-changed="dateChanged"
    />
    <time-log-table
      ref="timeLogsTable"
      :is-today="isToday"
      :is-selected="isSelected"
      :get-day-date="getDayDate"
    />
  </q-page>
</template>

<script>
import { date } from 'quasar'
import TimeLogHeader from 'src/components/common/layout/parts/TimeLogHeader.vue'
import TimeLogTable from 'src/components/common/layout/parts/TimeLogTable.vue'
export default {
  components: {
    TimeLogHeader,
    TimeLogTable
  },
  data() {
    return {
      weekStart: '',
      weekEnd: '',
      currentWeek: {
        from: '',
        to: ''
      },
      date: new Date()
    }
  },

  updated() {
    this.scrollToCurrentTime()
  },

  mounted() {
    this.scrollToCurrentTime()
  },

  methods: {
    dateChanged(data) {
      this.weekStart = data.weekStart
      this.weekEnd = data.weekEnd
      this.date = data.date
      this.currentWeek = data.currentWeek
    },

    scrollToCurrentTime() {
      let hours = new Date().getHours()
      let minutes = new Date().getMinutes()

      minutes += hours * 60
      minutes += minutes / 3
      let currentTimeLine = document.querySelector('.current-time-line')
      currentTimeLine.style.top = minutes + 'px'

      setTimeout(() => {
        currentTimeLine.scrollIntoView({
          behavior: 'auto',
          block: 'center',
          inline: 'nearest'
        })
      }, 1)
    },

    handleSwipe(evt) {
      if (!evt.direction) {
        return
      }
      if (evt.direction == 'right') {
        this.$refs.timeLogsHeader.changeWeek(-1)
        return
      }
      this.$refs.timeLogsHeader.changeWeek()
    },

    isToday(dayOfWeek) {
      let currentDay = this.getDayDate(dayOfWeek)
      let today = date.formatDate(new Date(), 'dddd, DD-MM-YYYY')

      return currentDay === today
    },
    isSelected(dayOfWeek) {
      let currentDay = this.getDayDate(dayOfWeek)
      let selectedDate = date.formatDate(
        date.extractDate(this.$route.query.date, 'DD-MM-YYYY'),
        'dddd, DD-MM-YYYY'
      )

      return currentDay === selectedDate
    },
    getDayDate(dayOfWeek) {
      return date.formatDate(
        date.addToDate(this.weekStart, { days: dayOfWeek - 1 }),
        'dddd, DD-MM-YYYY'
      )
    }
  }
}
</script>
<style>
.hours {
  width: 36px;
}
.selected,
.selected .time {
  background: rgb(241, 245, 255);
}
.today,
.today .time {
  background: rgb(241, 254, 255);
}
</style>

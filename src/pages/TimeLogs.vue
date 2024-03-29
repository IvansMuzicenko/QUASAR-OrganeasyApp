<template>
  <q-page id="timeLogsPage" class="relative-position">
    <time-log-header
      ref="timeLogsHeader"
      :is-today="isToday"
      :is-selected="isSelected"
      :time-logs="timeLogs"
      :dates="dates"
      @date-changed="dateChanged"
    />
    <time-log-table
      ref="timeLogsTable"
      :time-logs="timeLogs"
      :is-today="isToday"
      :is-selected="isSelected"
      :dates="dates"
    />
  </q-page>
</template>

<script>
import { date } from 'quasar'
import TimeLogHeader from 'src/components/common/layout/parts/TimeLogHeader.vue'
import TimeLogTable from 'src/components/common/layout/parts/TimeLogTable.vue'
import { convertTimeToMinutes, convertMinutesToTime } from 'src/dateTimeHelper'

export default {
  components: {
    TimeLogHeader,
    TimeLogTable
  },
  data() {
    return {
      convertTimeToMinutes,
      convertMinutesToTime,
      weekStart: '',
      weekEnd: '',
      currentWeek: {
        from: '',
        to: ''
      },
      date: new Date()
    }
  },
  computed: {
    timeLogs() {
      let timeLogs = Object.fromEntries(
        Object.entries(this.$store.getters['users/timeLogs']).filter(
          ([key, value]) => this.dates.includes(key.replace('date-', ''))
        )
      )

      return timeLogs
    },
    dates() {
      let dates = []
      if (this.weekStart) {
        for (let i = 0; i < 7; i++) {
          dates.push(
            date.formatDate(
              date.addToDate(this.weekStart, { days: i }),
              'DD-MM-YYYY'
            )
          )
        }
      }

      return dates
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
      currentTimeLine.style.top =
        minutes * (window.innerWidth < 900 ? 2.5 : 1) +
        (window.innerWidth < 900 ? 15 : 0) +
        'px'

      const currentTimeBlock = document.querySelector(
        `.selected .time-${this.roundTime(
          date.formatDate(new Date(), 'HH:mm')
        )}`
      )

      setTimeout(() => {
        if (currentTimeBlock) {
          currentTimeBlock.hidden = false
          currentTimeBlock.scrollIntoView({
            behavior: 'auto',
            block: 'center',
            inline: 'center'
          })
          currentTimeBlock.hidden = true
        } else {
          currentTimeLine.scrollIntoView({
            behavior: 'auto',
            block: 'center',
            inline: 'center'
          })
        }
      }, 1)
    },

    roundTime(time) {
      let minutes = Math.floor(convertTimeToMinutes(time) / 15) * 15
      if (convertTimeToMinutes(time) > 1440) {
        return convertMinutesToTime(1440)
      } else if (convertTimeToMinutes(time) < 0) {
        return convertMinutesToTime(0)
      }
      return minutes
    },

    isToday(day) {
      let today = date.formatDate(new Date(), 'DD-MM-YYYY')

      return day === today
    },
    isSelected(day) {
      let selectedDate = this.$route.query.date

      return day === selectedDate
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

<template>
  <q-page-sticky expand position="top" class="header">
    <div class="bg-grey-1 column full-width">
      <div class="row justify-between header-actions">
        <div>
          <span>
            <q-btn flat @click="changeWeek(-1)">&lt;</q-btn>
          </span>
          <span class="cursor-pointer wrap" @click="fillMonthEdges(false)">
            {{ displayDate }}

            <q-popup-proxy
              ref="datePicked"
              class="z-top"
              cover
              transition-show="scale"
              transition-hide="scale"
            >
              <q-date
                ref="datePicker"
                v-model="currentWeek"
                first-day-of-week="1"
                mask="DD-MM-YYYY"
                today-btn
                @navigation="fillMonthEdges"
              >
                <div class="items-center justify-end row">
                  <q-btn v-close-popup label="Close" color="primary" flat />
                </div>
              </q-date>
            </q-popup-proxy>
          </span>
          <span>
            <q-btn flat @click="changeWeek()">&gt;</q-btn>
          </span>
        </div>
        <div class="row items-center">
          Total: {{ convertMinutesToTime(weekTotalHours) }}
        </div>
      </div>
      <div class="dates row full-width">
        <div class="hours" />
        <div
          v-for="day in dates"
          :key="day"
          class="col column justify-between date"
          :class="{ selected: isSelected(day), today: isToday(day) }"
        >
          <span>
            {{ day }}
          </span>
          <span>
            <!-- Total of day -->
            Total: {{ convertMinutesToTime(weekTotals[day] ?? 0) }}
          </span>
          <q-btn @click="addTimeLog(day)">+</q-btn>
        </div>
      </div>
    </div>
  </q-page-sticky>
</template>

<script>
import { date } from 'quasar'
import AddTimeLog from 'src/components/common/dialogs/AddTimeLog.vue'
import { convertTimeToMinutes, convertMinutesToTime } from 'src/dateTimeHelper'

export default {
  props: {
    isToday: {
      type: Function,
      required: true
    },
    isSelected: {
      type: Function,
      required: true
    },
    dates: {
      type: Array,
      required: true
    },
    timeLogs: {
      type: Object,
      required: true
    }
  },
  emits: ['dateChanged'],
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
      date: new Date(),
      weekTotals: [],
      weekTotalHours: 0
    }
  },

  computed: {
    displayDate() {
      return this.currentWeek.from + ' <-> ' + this.currentWeek.to
    },
    queryDate() {
      return this.$route.query.date
    }
  },

  watch: {
    currentWeek: {
      handler: function (newWeek, oldWeek) {
        if (newWeek === date.formatDate(this.date, 'DD-MM-YYYY')) {
          this.currentWeek = oldWeek
          this.$refs['datePicked']?.hide()
          return
        }
        if (typeof newWeek === 'object') return

        this.$router.push(`?date=${newWeek}`)

        this.$refs['datePicked']?.hide()
      }
    },
    queryDate: {
      handler: function () {
        if (!this.queryDate) {
          this.selectWeek(new Date())
        }

        if (this.queryDate) {
          this.selectWeek(date.extractDate(this.queryDate, 'DD-MM-YYYY'))
        }
      },
      immediate: true,
      flush: 'post'
    }
  },
  mounted() {
    for (let dayDate of this.dates) {
      for (const timeLog of Object.values(
        this.timeLogs[`date-${dayDate}`] ?? {}
      )) {
        this.weekTotals[dayDate] = this.weekTotals[dayDate] ?? 0
        this.weekTotals[dayDate] += convertTimeToMinutes(timeLog.timeSpent)
        this.weekTotalHours += convertTimeToMinutes(timeLog.timeSpent)
      }
    }
  },

  methods: {
    selectWeek(selectedDate) {
      this.date = selectedDate

      this.weekStart = date.addToDate(selectedDate, {
        days: -(selectedDate.getDay() === 0 ? 6 : selectedDate.getDay() - 1)
      })
      this.weekEnd = date.addToDate(this.weekStart, { days: 6 })

      this.currentWeek = {
        from: date.formatDate(this.weekStart, 'DD-MM-YYYY'),
        to: date.formatDate(this.weekEnd, 'DD-MM-YYYY')
      }
      this.$router.push(`?date=${date.formatDate(this.date, 'DD-MM-YYYY')}`)

      this.$emit('dateChanged', this)
    },

    changeWeek(modifier = 1) {
      let newDate = date.addToDate(this.weekStart, { days: modifier * 7 })
      this.selectWeek(newDate)
    },

    fillMonthEdges(selectedDate = false) {
      setTimeout(() => {
        if (!selectedDate) {
          this.changeToCurrentMonth()
        }
        if (!date.isSameDate(this.weekStart, this.weekEnd, 'month')) {
          setTimeout(() => {
            let monthModifier = date.isBetweenDates(
              this.weekStart,
              date.startOfDate(this.date, 'month'),
              date.endOfDate(this.date, 'month')
            )
            let monthDifference = selectedDate
              ? selectedDate.year * 12 +
                selectedDate.month -
                (this.date.getFullYear() * 12 + this.date.getMonth() + 1)
              : 0

            this.highlightFillers(monthModifier, monthDifference)
          }, 1)
        }
      }, 1)
    },

    changeToCurrentMonth() {
      this.$refs.datePicker.setCalendarTo(
        this.date.getFullYear(),
        this.date.getMonth() + 1
      )
    },

    highlightFillers(monthModifier, monthDifference) {
      let fillers = document.querySelectorAll('.q-date__calendar-item--fill')
      for (let filler in fillers) {
        let fillerValue = Number(fillers[filler].innerText)
        if (
          (monthDifference === 1 && monthModifier && fillerValue > 15) ||
          (monthDifference === -1 && !monthModifier && fillerValue < 15) ||
          (monthDifference === 0 &&
            ((monthModifier && fillerValue < 15) ||
              (!monthModifier && fillerValue > 15)))
        ) {
          fillers[filler].classList.add(
            'q-date__calendar-item--in',
            'q-date__range'
          )
        }
      }

      Array.from(document.querySelectorAll('.q-date__range'))
        .filter(
          (el) =>
            Number(el.innerText) === this.weekStart.getDate() ||
            Number(el.innerText) === this.weekEnd.getDate()
        )
        .forEach((el) => {
          if (Number(el.innerText) === this.weekStart.getDate()) {
            el.classList.add('q-date__range-from', 'circle')
          }
          if (Number(el.innerText) === this.weekEnd.getDate()) {
            el.classList.add('q-date__range-to', 'circle')
          }
        })
    },
    addTimeLog(date) {
      this.$q.dialog({
        component: AddTimeLog,
        componentProps: {
          exactDate: date
        }
      })
    }
  }
}
</script>
<style>
.header {
  z-index: 100;
}
@media only screen and (max-width: 900px) {
  .header {
    position: relative;
    justify-content: start;
    transform: translate(0px, 0px) !important;
  }

  #timeLogsPage {
    min-width: 1200px;
  }

  .header-actions {
    padding-right: 20px;
    width: 100vw;
  }
}
@media only screen and (max-width: 600px) {
  .header {
    padding-top: 3rem;
  }
}
.date {
  min-height: 100px;
}
.q-date__calendar-item--fill {
  visibility: visible;
  color: lightgray;
}

.circle {
  z-index: 0;
}
.circle div {
  width: 30px;
  height: 30px;
  background: rgb(182, 182, 182);
  border-radius: 50%;
  background-clip: border-box;
  z-index: 1;
  color: white;
}
</style>

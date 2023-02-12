<template>
  <q-page-sticky expand position="top" class="header">
    <q-toolbar class="bg-grey-1 q-pa-none column">
      <div class="row full-width justify-between">
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
            <q-btn flat @click="changeWeek(1)">&gt;</q-btn>
          </span>
        </div>
        <div>Total: {{ 0 }}</div>
      </div>
      <div class="dates row full-width">
        <div class="hours" />
        <div
          v-for="i in 7"
          :key="i"
          class="col column justify-between date"
          :class="{ selected: isSelected(i), today: isToday(i) }"
        >
          <span>
            {{ getDayDate(i) }}
          </span>
          <span>
            <!-- Total of day -->
            Total: {{ 0 }}
          </span>
          <q-btn>+</q-btn>
        </div>
      </div>
    </q-toolbar>
  </q-page-sticky>
</template>

<script>
import { date } from 'quasar'
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
    getDayDate: {
      type: Function,
      required: true
    }
  },
  emits: ['dateChanged'],
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
    }
  }
}
</script>
<style>
.header {
  z-index: 10;
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
<template>
  <span class="cursor-pointer wrap" @click="fillMonthEdges(false)">
    {{ displayDate }}

    <q-popup-proxy
      ref="datePicked"
      class="z-top"
      cover
      transition-show="scale"
      transition-hide="scale"
      @hide="checkDateExisting()"
    >
      <q-date
        ref="datePicker"
        v-model="selectedPeriod"
        first-day-of-week="1"
        mask="DD-MM-YYYY"
        range
        today-btn
        @navigation="fillMonthEdges"
      >
        <div class="items-center justify-end row">
          <q-btn v-close-popup label="Close" color="primary" flat />
        </div>
      </q-date>
    </q-popup-proxy>
  </span>
</template>

<script>
import { date } from 'quasar'
export default {
  emits: ['dateSelected'],
  data() {
    return {
      selectedPeriod: date.formatDate(new Date(), 'DD-MM-YYYY')
    }
  },
  computed: {
    displayDate() {
      if (!this.selectedPeriod) {
        return 'Select Date'
      }
      return typeof this.selectedPeriod === 'string'
        ? this.selectedPeriod
        : `${this.selectedPeriod.from} - ${this.selectedPeriod.to}`
    },
    queryDate() {
      if (this.$route.query.date) {
        return this.$route.query.date
      } else if (this.$route.query.dateFrom && this.$route.query.dateTo) {
        return {
          from: this.$route.query.dateFrom,
          to: this.$route.query.dateTo
        }
      } else {
        return null
      }
    }
  },
  watch: {
    selectedPeriod: {
      handler: function (newValue, oldValue) {
        if (!newValue || oldValue === newValue) {
          return
        }

        this.$refs['datePicked']?.hide()
        this.$emit('dateSelected', this.selectedPeriod)
      }
    },
    queryDate: {
      handler: function () {
        if (!this.queryDate) {
          this.selectDate(new Date())
        }

        if (this.queryDate) {
          if (typeof this.queryDate === 'object') {
            this.selectedPeriod = {
              from: this.queryDate.from,
              to: this.queryDate.to
            }
          } else {
            this.selectedPeriod = this.queryDate
          }
        }
      },
      immediate: true,
      flush: 'post'
    }
  },
  methods: {
    selectDate(selectedDate) {
      let weekStart = date.addToDate(selectedDate, {
        days: -(selectedDate.getDay() === 0 ? 6 : selectedDate.getDay() - 1)
      })
      let weekEnd = date.addToDate(weekStart, { days: 6 })

      this.selectedPeriod = {
        from: date.formatDate(weekStart, 'DD-MM-YYYY'),
        to: date.formatDate(weekEnd, 'DD-MM-YYYY')
      }
    },
    checkDateExisting() {
      if (!this.selectedPeriod) {
        this.selectDate(new Date())
      }
    },
    fillMonthEdges(selectedDate = false) {
      if (typeof this.selectedPeriod !== 'object') return
      setTimeout(() => {
        if (!selectedDate) {
          this.changeToCurrentMonth()
        }
        if (
          !date.isSameDate(
            date.extractDate(this.selectedPeriod.from, 'DD-MM-YYYY'),
            date.extractDate(this.selectedPeriod.to, 'DD-MM-YYYY'),
            'month'
          )
        ) {
          setTimeout(() => {
            let monthModifier = date.isBetweenDates(
              this.selectedPeriod.from,
              date.startOfDate(this.selectedPeriod.from, 'month'),
              date.endOfDate(this.selectedPeriod.to, 'month'),
              { inclusiveFrom: true, inclusiveTo: true }
            )
            let monthDifference = selectedDate
              ? selectedDate.year * 12 +
                selectedDate.month -
                (date
                  .extractDate(this.selectedPeriod.to, 'DD-MM-YYYY')
                  .getFullYear() *
                  12 +
                  date
                    .extractDate(this.selectedPeriod.to, 'DD-MM-YYYY')
                    .getMonth() +
                  1)
              : 0
            this.highlightFillers(monthModifier, monthDifference)
          }, 1)
        }
      }, 1)
    },
    changeToCurrentMonth() {
      if (!this.selectedPeriod) {
        return
      }
      this.$refs.datePicker.setCalendarTo(
        date
          .extractDate(
            this.selectedPeriod.to ?? this.selectedPeriod,
            'DD-MM-YYYY'
          )
          .getFullYear(),
        date
          .extractDate(
            this.selectedPeriod.to ?? this.selectedPeriod,
            'DD-MM-YYYY'
          )
          .getMonth() + 1
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
            Number(el.innerText) ===
              date.extractDate(this.selectedPeriod.from, 'DD-MM-YYYY') ||
            Number(el.innerText) ===
              date.extractDate(this.selectedPeriod.to, 'DD-MM-YYYY')
        )
        .forEach((el) => {
          if (
            Number(el.innerText) ===
            date.extractDate(this.selectedPeriod.from, 'DD-MM-YYYY')
          ) {
            el.classList.add('q-date__range-from', 'circle')
          }
          if (
            Number(el.innerText) ===
            date.extractDate(this.selectedPeriod.to, 'DD-MM-YYYY')
          ) {
            el.classList.add('q-date__range-to', 'circle')
          }
        })
    }
  }
}
</script>

<style lang="scss">
.q-date__calendar-item--fill {
  visibility: visible;
  color: lightgray;
}
</style>

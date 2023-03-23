<template>
  <div class="flex full-width main-logs-block">
    <div class="hours day cursor-none">
      <div
        v-for="hourQuarter in dayQuartersCount"
        :key="hourQuarter"
        class="time-field relative-position"
      >
        <span class="hour">
          {{ hourQuarter % 4 ? '-' : convertMinutesToTime(hourQuarter * 15) }}
        </span>
        <button
          class="hours-add full-width"
          @click="addTimeLog(convertMinutesToTime(hourQuarter * 15))"
        >
          +
        </button>
      </div>
    </div>
    <div
      v-for="day in dates"
      :key="day"
      class="col day"
      :class="{ selected: isSelected(day), today: isToday(day) }"
    >
      <time-log-column :time-logs="timeLogs" :date="day" />
    </div>
    <q-separator
      ref="currentTimeLine"
      size="2px"
      color="primary"
      class="absolute-top full-width current-time-line"
    />
  </div>
</template>
<script>
import AddTimeLog from 'src/components/common/dialogs/AddTimeLog.vue'
import TimeLogColumn from 'src/components/common/elements/blocks/TimeLogColumn.vue'
import { convertTimeToMinutes, convertMinutesToTime } from 'src/dateTimeHelper'

export default {
  components: { TimeLogColumn },
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
  data() {
    return {
      convertMinutesToTime,
      dayQuartersCount: [...Array(97).keys()]
    }
  },
  mounted() {
    this.$store.dispatch('users/checkTimeLogCrossings')
  },
  updated() {
    this.$store.dispatch('users/checkTimeLogCrossings')
  },
  methods: {
    addTimeLog(time, date = null) {
      this.$q.dialog({
        component: AddTimeLog,
        componentProps: {
          exactTime: time,
          exactDate: date
        }
      })
    }
  }
}
</script>
<style lang="scss">
.main-logs-block {
  margin-top: 139px;
}
.current-time-line {
  margin-top: 9px;
  z-index: 5;
}
.day {
  border-right: 1px solid darkgray;
}
.field,
.time-field {
  cursor: pointer;
  height: 20px;
}

.field:hover .divider {
  height: 10px;
}

.time-field:hover > .hour {
  display: none;
}
.time-field:hover > .hours-add,
.field:hover .time {
  display: inline-block;
}

.hours-add {
  height: 20px;
  display: none;
}
.drag-enter {
  border: 1px solid gray;

  .time {
    display: inline-block;
  }
}
@media only screen and (max-width: 900px) {
  .main-logs-block {
    margin: 0;
  }
  .current-time-line {
    margin-top: 149px;
  }
  .field,
  .time-field {
    height: 50px;
  }
  .hours-add {
    height: 50px;
  }
  .divider {
    margin-top: 25px;
  }
  .time {
    margin-top: 15px;
  }
  .time-field {
    display: flex;
    align-items: center;
  }
}
</style>

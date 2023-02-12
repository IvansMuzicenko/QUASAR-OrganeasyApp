<template>
  <div class="flex full-width q-pt-lg main-logs-block">
    <div class="hours day cursor-none">
      <div v-for="l in 97" :key="l" class="time-field relative-position">
        <span class="hour">{{ (l - 1) % 4 ? '-' : formatField(l) }}</span>
        <button class="hours-add full-width">+</button>
      </div>
    </div>
    <div
      v-for="i in 7"
      :key="i"
      class="col day"
      :class="{ selected: isSelected(i), today: isToday(i) }"
    >
      <div
        v-for="l in 97"
        :key="l"
        class="field relative-position row justify-center"
      >
        <span
          :ref="i + '' + l"
          class="time absolute-top q-mx-auto text-center"
          hidden
        >
          {{ formatField(l) }}
        </span>
        <q-separator
          :size="(l - 1) % 4 ? '1px' : '3px'"
          class="absolute-top divider"
        />
      </div>
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
  methods: {
    formatField(l) {
      let hours = Math.floor(((l - 1) * 15) / 60).toString()
      hours = (hours.length > 1 ? '' : '0') + hours

      let minutes = (((l - 1) * 15) % 60).toString()
      minutes = minutes + (minutes.length > 1 ? '' : '0')

      return hours + ':' + minutes
    }
  }
}
</script>
<style>
.main-logs-block {
  margin-top: 115px;
}
.current-time-line {
  margin-top: 35px;
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
.field:hover > .time {
  display: inline-block;
}
.hours-add {
  height: 20px;
  display: none;
}
.divider {
  margin-top: 10px;
}

.time {
  user-select: none;
  background: white;
  z-index: 2;
  width: 40px;
}
</style>

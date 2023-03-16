<template>
  <div
    v-if="timeLog"
    :id="timeLog.id"
    draggable="true"
    class="log-block"
    :style="`height: ${
      (convertTimeToMinutes(timeLog.timeSpent) / 15) * 20 - 2
    }px;
    width: calc(100% - ${(timeLog.crossings ?? 0) * 5}px);`"
    @dragstart="onDragStart"
    @click.prevent.stop="editTimeLog(timeLog.id, date)"
  >
    {{ timeLogText }}
  </div>
  <div v-else class="quarters-field">
    <span class="time absolute-top q-mx-auto text-center" hidden>
      {{ timeFrom }}
    </span>
    <q-separator
      :size="(convertTimeToMinutes(timeFrom) / 15) % 4 ? '1px' : '3px'"
      class="absolute-top divider"
    />
  </div>
</template>

<script>
import AddTimeLog from 'src/components/common/dialogs/AddTimeLog.vue'
import { convertTimeToMinutes, convertMinutesToTime } from 'src/dateTimeHelper'

export default {
  props: {
    timeLogs: {
      type: Object,
      required: true
    },
    date: {
      type: String,
      required: true
    },
    timeFrom: {
      type: String,
      required: true
    }
  },
  data() {
    return { convertTimeToMinutes, convertMinutesToTime }
  },
  computed: {
    timeLog() {
      if (!this.timeLogs[`date-${this.date}`]) {
        return false
      }
      return Object.values(this.timeLogs[`date-${this.date}`] || {}).filter(
        (el) => el.timeFrom === this.timeFrom
      )[0]
    },
    timeLogText() {
      return `${this.timeLog.issueId}, ${this.timeLog.description}, ${this.timeLog.crossings}`
    }
  },
  methods: {
    onDragStart(e) {
      e.dataTransfer.setData('text', e.target.id)
      e.dataTransfer.dropEffect = 'move'
    },
    editTimeLog(id, date) {
      this.$q.dialog({
        component: AddTimeLog,
        componentProps: {
          editTimeLog: { id: id, date: date }
        }
      })
    }
  }
}
</script>

<style lang="scss">
.log-block {
  position: absolute;
  z-index: 50;
  transform: translateY(9px);
  background: rgb(240, 240, 240);
  overflow: hidden;
  border: 2px solid rgb(175, 175, 175);
  border-radius: 4px;

  &:hover {
    background: rgb(220, 220, 220);
  }
}
.time {
  user-select: none;
  background: white;
  z-index: 51;
  width: 40px;
}
.divider {
  margin-top: 10px;
}
</style>

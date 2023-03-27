<template>
  <div
    v-if="timeLog"
    :id="timeLog.id"
    draggable="true"
    class="log-block"
    :style="`height: ${
      (convertTimeToMinutes(timeLog.timeSpent) / 15) *
        (20 * (screenWidth < 900 ? 2.5 : 1)) -
      2
    }px;
    width: calc(100% - ${(timeLog.crossings ?? 0) * 5}px);`"
    @dragstart="onDragStart"
    @click.prevent.stop="editTimeLog(timeLog.id, date)"
  >
    <div class="column full-width">
      <p class="full-width q-ma-none log-text">
        {{ logProcess?.title ?? 'Default' }}
      </p>
      <q-chip v-if="logCategory" dense class="q-ma-none full-width log-text">
        <q-avatar
          :icon="logCategory ? logCategory['icon'] : ''"
          :color="logCategory ? logCategory['color'] : ''"
          text-color="white"
        />
        <span>{{ logCategory ? logCategory['title'] : '' }}</span>
      </q-chip>
      <p class="full-width q-ma-none log-text">{{ timeLog.description }}</p>
      <div class="row justify-between q-px-xs field-times">
        <span>{{ `${timeLog.timeFrom} - ${timeLog.timeTo}` }}</span>
        <span>{{ timeLog.timeSpent }}</span>
      </div>
    </div>
    <span
      :class="`bg-${logCategory?.color ?? 'grey-5'} full-height`"
      style="width: 5px"
    />
  </div>
  <div v-else class="quarters-field">
    <span
      class="time absolute-top q-mx-auto text-center"
      hidden
      :class="(convertTimeToMinutes(timeFrom) / 15) % 4 ? '' : 'quarterTime'"
    >
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
    return {
      convertTimeToMinutes,
      convertMinutesToTime,
      screenWidth: window.innerWidth
    }
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
    logProcess() {
      return this.$store.getters['users/logProcesses'][
        `id-${this.timeLog.logProcessId}`
      ]
    },
    logCategory() {
      return (
        this.$store.getters['users/logCategories'][
          `id-${this.logProcess?.category}`
        ] ?? null
      )
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
  display: flex;
  justify-content: space-between;
  z-index: 50;
  transform: translateY(9px);
  background: rgb(250, 250, 250);
  overflow: hidden;
  border: 2px solid rgb(175, 175, 175);
  border-radius: 4px;
  border-right: 0;

  &:hover {
    background: rgb(240, 240, 240);
  }
}
.log-text {
  line-height: 16px;
  font-size: 14px;
}
.time {
  user-select: none;
  z-index: 49;
  width: 40px;
}
.divider {
  margin-top: 10px;
}
.field-times {
  border-top: 1px solid gray;
  font-size: 13px;
  line-height: 15px;
}
.quarterTime {
  display: none;
}
@media only screen and (max-width: 900px) {
  .quarterTime {
    display: inline-block;
  }
  .log-block {
    margin-top: 15px;
  }
}
@media only screen and (max-width: 600px) {
  .log-text {
    line-height: 18px;
    font-size: 16px;
  }
  .field-times {
    border-top: 1px solid gray;
    font-size: 15px;
    line-height: 17px;
  }
}
</style>

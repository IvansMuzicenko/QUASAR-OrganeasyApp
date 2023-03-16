<template>
  <div
    v-for="hourQuarter in dayQuartersCount"
    :key="hourQuarter"
    class="field relative-position"
    @click="addTimeLog(convertMinutesToTime(hourQuarter * 15), date)"
    @dragenter="onDragEnter"
    @dragleave="onDragLeave"
    @dragover="onDragOver"
    @drop="onDrop"
  >
    <time-log-field
      :time-logs="timeLogs"
      :date="date"
      :time-from="convertMinutesToTime(hourQuarter * 15)"
    />
  </div>
</template>
<script>
import TimeLogField from 'src/components/common/elements/blocks/TimeLogField.vue'
import AddTimeLog from 'src/components/common/dialogs/AddTimeLog.vue'
import { convertTimeToMinutes, convertMinutesToTime } from 'src/dateTimeHelper'

export default {
  components: { TimeLogField },
  props: {
    timeLogs: {
      type: Object,
      required: true
    },
    date: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      dayQuartersCount: [...Array(97).keys()],
      convertMinutesToTime
    }
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
    },

    //drag&drop
    onDragEnter(e) {
      if (e.target.draggable !== true) {
        e.target.classList.add('drag-enter')
      }
    },

    onDragLeave(e) {
      e.target.classList.remove('drag-enter')
    },

    onDragOver(e) {
      e.preventDefault()
    },

    onDrop(e) {
      e.preventDefault()

      // don't drop on other draggables
      if (e.target.draggable === true) {
        e.target.classList.remove('drag-enter')
        return
      }

      const draggedId = e.dataTransfer.getData('text')
      const draggedEl = document.getElementById(draggedId)

      // check if original parent node
      if (draggedEl.parentNode === e.target) {
        e.target.classList.remove('drag-enter')
        return
      }

      // make the exchange
      draggedEl.parentNode.removeChild(draggedEl)
      e.target.appendChild(draggedEl)
      e.target.classList.remove('drag-enter')
    }
  }
}
</script>
<style lang="scss"></style>

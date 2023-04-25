<template>
  <q-page>
    <logs-stats-header @filters-change="applyStatsFilter" />
    <logs-stats-table :time-logs="timeLogsArray" />
  </q-page>
</template>

<script>
import { date } from 'quasar'

import LogsStatsHeader from 'src/components/common/layout/parts/LogsStatsHeader.vue'
import LogsStatsTable from 'src/components/common/layout/parts/LogsStatsTable.vue'

export default {
  components: { LogsStatsHeader, LogsStatsTable },
  data() {
    return {
      timeLogsArray: [],
      filters: null
    }
  },
  computed: {
    timeLogs() {
      return this.$store.getters['users/timeLogs']
    },
    logProcesses() {
      return this.$store.getters['users/logProcesses']
    },
    logCategories() {
      return this.$store.getters['users/logCategories']
    }
  },
  methods: {
    applyStatsFilter(filters) {
      this.filters = filters
      if (!filters.selectedDate) {
        return
      }
      this.timeLogsArray = []
      let timeLogsArray = []
      let timeLogsArrayFiltered = []
      // Date filters start
      if (typeof filters.selectedDate === 'string') {
        timeLogsArray.push(this.timeLogs[`date-${filters.selectedDate}`])
      } else if (typeof filters.selectedDate === 'object') {
        for (const timeLogsKey in this.timeLogs) {
          let fromDate = filters.selectedDate.from
          let toDate = filters.selectedDate.to
          if (
            date.isBetweenDates(
              date.extractDate(timeLogsKey.replace('date-', ''), 'DD-MM-YYYY'),
              date.extractDate(fromDate, 'DD-MM-YYYY'),
              date.extractDate(toDate, 'DD-MM-YYYY')
            )
          ) {
            timeLogsArray.push(this.timeLogs[timeLogsKey])
          }
        }
      }
      for (const timeLogs of timeLogsArray) {
        for (const timeLogKey in timeLogs) {
          timeLogsArrayFiltered.push(timeLogs[timeLogKey])
        }
      }
      // Date filters end
      // Category filters start
      if (filters.selectedCategories.length) {
        //get processes that have this category
        timeLogsArrayFiltered = timeLogsArrayFiltered.filter((el) => {
          let process = this.logProcesses[`id-${el.logProcessId}`]
          if (!process) {
            return false
          }
          return filters.selectedCategories.includes(process.category)
        })
      }
      // Category filters end
      // Processes filters start
      if (filters.selectedProcesses.length) {
        timeLogsArrayFiltered = timeLogsArrayFiltered.filter((el) =>
          filters.selectedProcesses.includes(el.logProcessId)
        )
      }
      // Processes filters end
      timeLogsArrayFiltered = timeLogsArrayFiltered.sort((a, b) => {
        if (a.logProcessId < b.logProcessId) {
          return -1
        }
        if (a.logProcessId > b.logProcessId) {
          return 1
        }

        return 0
      })
      this.timeLogsArray = timeLogsArrayFiltered
    }
  }
}
</script>

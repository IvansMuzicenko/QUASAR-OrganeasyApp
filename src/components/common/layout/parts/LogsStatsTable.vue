<template>
  <div>
    <q-table
      v-if="tableRows.length"
      v-model:pagination="pagination"
      class="my-sticky-header-column-table"
      flat
      bordered
      dense
      :rows="tableRows"
      :columns="tableColumns"
      row-key="index"
      separator="cell"
      hide-bottom
      virtual-scroll
      :rows-per-page-options="[0]"
    >
      <template #top-row>
        <q-tr>
          <q-td class="border-b text-right">Totals:</q-td>
          <q-td
            v-for="logDate in timeLogsDates"
            :key="logDate"
            class="text-center border-b"
          >
            {{ tableTotals[logDate] }}
          </q-td>
        </q-tr>
      </template>
    </q-table>
    <div v-if="groupedProcesses.length">
      <h5>Processes statistics</h5>
      <div class="row grouped justify-center">
        <q-card
          v-for="groupedProcess in groupedProcesses"
          :key="groupedProcess.name"
        >
          <div class="q-pa-sm q-pb-none">
            <q-chip class="full-width">
              <q-avatar
                :icon="groupedProcess.category?.icon ?? ''"
                :color="groupedProcess.category?.color ?? ''"
                text-color="white"
              />
              {{ groupedProcess.category?.title ?? 'uncategorized' }}
            </q-chip>
          </div>
          <div class="q-pa-sm">
            <div>
              Process name:
              <span class="grouped-value">{{ groupedProcess.name }}</span>
            </div>
            <div>
              Overall time:
              <span class="grouped-value">{{ groupedProcess.time }}</span>
            </div>
            <div>
              Percentage:
              <span class="grouped-value">{{ groupedProcess.percent }}%</span>
            </div>
          </div>
        </q-card>
      </div>
    </div>
    <div v-if="groupedCategories.length">
      <h5>Categories statistics</h5>
      <div class="row grouped justify-center">
        <q-card
          v-for="groupedCategory in groupedCategories"
          :key="groupedCategory.category?.name"
        >
          <div class="q-pa-sm q-pb-none">
            <q-chip class="full-width">
              <q-avatar
                :icon="groupedCategory.category?.icon ?? ''"
                :color="groupedCategory.category?.color ?? ''"
                text-color="white"
              />
              {{ groupedCategory.category?.title ?? 'uncategorized' }}
            </q-chip>
          </div>
          <div class="q-pa-sm">
            <div>
              Overall time:
              <span class="grouped-value">{{ groupedCategory.time }}</span>
            </div>
            <div>
              Percentage:
              <span class="grouped-value">{{ groupedCategory.percent }}%</span>
            </div>
          </div>
        </q-card>
      </div>
    </div>
  </div>
</template>
<script>
import { convertTimeToMinutes, convertMinutesToTime } from 'src/dateTimeHelper'
export default {
  props: {
    timeLogs: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      pagination: {
        rowsPerPage: 0
      }
    }
  },
  computed: {
    logProcesses() {
      return this.$store.getters['users/logProcesses']
    },
    logCategories() {
      return this.$store.getters['users/logCategories']
    },
    timeLogsDates() {
      let timeLogsDates = []
      this.timeLogs.forEach((el) => timeLogsDates.push(el.date))
      return [...new Set(timeLogsDates)].sort((a, b) => {
        const aDate = a.split('-').reverse().join('')
        const bDate = b.split('-').reverse().join('')
        return aDate - bDate
      })
    },
    tableTotals() {
      let totals = {}
      for (const logDate of this.timeLogsDates) {
        for (const tableRow of this.tableRows) {
          if (tableRow[logDate]) {
            totals[logDate] =
              (totals[logDate] ?? 0) + convertTimeToMinutes(tableRow[logDate])
          }
        }
      }
      for (let [key, total] of Object.entries(totals)) {
        totals[key] = convertMinutesToTime(total)
      }
      return totals
    },
    tableColumns() {
      if (!this.timeLogsDates.length) {
        return []
      }
      let columns = [
        {
          name: 'process',
          required: true,
          label: 'Process name',
          align: 'left',
          field: 'process',
          sortable: true
        }
      ]
      for (const logDate of this.timeLogsDates) {
        columns.push({
          name: logDate,
          label: logDate,
          align: 'center',
          field: logDate,
          sortable: true
        })
      }
      return columns
    },
    tableRows() {
      let rows = []
      let index = 0
      let list = {}

      for (const timeLog of this.timeLogs) {
        if (timeLog.logProcessId !== '0') {
          if (!list[timeLog.logProcessId]) {
            list[timeLog.logProcessId] = {}
          }

          list[timeLog.logProcessId][timeLog.date] =
            (list[timeLog.logProcessId][timeLog.date] ?? 0) +
            convertTimeToMinutes(timeLog.timeSpent)
        }
      }

      for (const [key, item] of Object.entries(list)) {
        for (const [key, value] of Object.entries(item)) {
          item[key] = convertMinutesToTime(value)
        }
        let row = {}
        let process = this.logProcesses[`id-${key}`]
        let categoryString = this.logCategories[`id-${process.category}`]
          ? `(${this.logCategories[`id-${process.category}`]['title']})`
          : ''
        let processString = process['title']

        let fullString =
          (categoryString + processString).slice(0, 30) +
          ((categoryString + processString).length > 30 ? '...' : '')
        row['process'] = fullString
        row['index'] = index
        Object.assign(row, item)
        rows.push(row)
        index++
      }

      return rows
    },
    groupedProcesses() {
      let list = {}
      let totalTime = 0
      for (const timeLog of this.timeLogs) {
        if (timeLog.logProcessId !== '0') {
          list[timeLog.logProcessId] = list[timeLog.logProcessId] ?? {}
          list[timeLog.logProcessId]['time'] =
            (list[timeLog.logProcessId]['time'] ?? 0) +
            convertTimeToMinutes(timeLog.timeSpent)

          totalTime += convertTimeToMinutes(timeLog.timeSpent)
        }
      }
      for (const [key, item] of Object.entries(list)) {
        if (key !== '0') {
          list[key]['name'] = this.logProcesses[`id-${key}`]['title']
          list[key]['percent'] = Math.round(
            (list[key]['time'] / totalTime) * 100
          )
          list[key]['time'] = convertMinutesToTime(list[key]['time'])
          list[key]['process'] = this.logProcesses[`id-${key}`]
          list[key]['category'] =
            this.logCategories[
              `id-${this.logProcesses[`id-${key}`]['category']}`
            ]
          list[key]['id'] = key
        }
      }
      return Object.values(list).sort((a, b) => {
        if (!a.category?.title) return -1
        if (a.category.title < b.category.title) {
          return -1
        }
        if (a.category.title > b.category.title) {
          return 1
        }

        return 0
      })
    },
    groupedCategories() {
      let list = {}
      let totalTime = 0
      for (const groupedProcess of Object.values(this.groupedProcesses)) {
        let logProcess = this.logProcesses[`id-${groupedProcess.id}`]
        list[logProcess.category] = list[logProcess.category] ?? {}
        list[logProcess.category]['time'] =
          (list[logProcess.category]['time'] ?? 0) +
          convertTimeToMinutes(groupedProcess.time)

        totalTime += convertTimeToMinutes(groupedProcess.time)
      }
      for (const [key, item] of Object.entries(list)) {
        list[key]['category'] = this.logCategories[`id-${key}`]
        list[key]['percent'] = Math.round((list[key]['time'] / totalTime) * 100)
        list[key]['time'] = convertMinutesToTime(list[key]['time'])
      }
      return Object.values(list)
    }
  }
}
</script>

<style lang="scss">
.grouped {
  gap: 15px;

  .grouped-value {
    font-weight: bold;
  }
}
.stats-table {
  gap: 10px;
}
.stats-item {
  width: 300px;
}
.q-table--dense .q-table tr th {
  padding-left: 1px;
  padding-right: 1px;

  .q-icon {
    margin-left: 0;
  }
}
.my-sticky-header-column-table {
  max-height: 80vh;
  height: fit-content;

  width: fit-content;
  max-width: 100%;

  .border-b {
    border-bottom: 1px solid rgba(0, 0, 0, 0.3);
  }

  td:first-child {
    background-color: #ffeab1;
  }

  tr th {
    position: sticky;
    z-index: 2;
    background: #ffeab1;
  }

  thead tr:last-child th {
    top: 48px;
    z-index: 3;
  }
  thead tr:first-child th {
    top: 0;
    z-index: 1;
  }
  tr:first-child th:first-child {
    z-index: 3;
  }

  td:first-child {
    z-index: 1;
  }

  td:first-child,
  th:first-child {
    position: sticky;
    left: 0;
  }

  tbody {
    scroll-margin-top: 48px;
  }
}
</style>

<template>
  <div>
    <log-stats-date-picker class="q-ma-sm" @date-selected="dateSelected" />
    <div class="row q-col-gutter-sm">
      <log-categories-select
        class="filter-select col"
        multiple
        @category-selected="categorySelected"
      />
      <log-processes-select
        class="filter-select col"
        multiple
        :categories="filters.selectedCategories"
        @process-selected="processSelected"
      />
    </div>
  </div>
</template>

<script>
import LogProcessesSelect from 'src/components/common/groups/LogProcessesSelect.vue'
import LogCategoriesSelect from 'src/components/common/groups/LogCategoriesSelect.vue'
import LogStatsDatePicker from 'src/components/common/groups/LogStatsDatePicker.vue'

export default {
  components: { LogProcessesSelect, LogCategoriesSelect, LogStatsDatePicker },
  emits: ['filtersChange'],
  data() {
    return {
      filters: {
        selectedCategories: [],
        selectedProcesses: [],
        selectedDate: null
      }
    }
  },
  methods: {
    processSelected(selectedProcesses) {
      this.filters.selectedProcesses = selectedProcesses
      this.setSearchQuery()
      this.$emit('filtersChange', this.filters)
    },
    categorySelected(selectedCategories) {
      this.filters.selectedCategories = selectedCategories
      this.setSearchQuery()
      this.$emit('filtersChange', this.filters)
    },
    dateSelected(selectedDate) {
      this.filters.selectedDate = selectedDate
      this.setSearchQuery()
      this.$emit('filtersChange', this.filters)
    },
    setSearchQuery() {
      let query = ''
      if (!this.filters.selectedDate) {
        return
      }
      if (typeof this.filters.selectedDate === 'object') {
        query = `?dateFrom=${this.filters.selectedDate.from}&dateTo=${this.filters.selectedDate.to}`
      } else {
        query = `?date=${this.filters.selectedDate}`
      }
      if (this.filters.selectedProcesses.length) {
        query += `&selectedProcesses=${this.filters.selectedProcesses}`
      }

      if (this.filters.selectedCategories.length) {
        query += `&selectedCategories=${this.filters.selectedCategories}`
      }

      this.$router.push(query)
    }
  }
}
</script>

<style lang="scss" scoped>
.filter-select {
  min-width: 375px;
}
</style>

<template>
  <q-select
    ref="processesSelect"
    v-model="filters.selectedLogProcesses"
    filled
    use-input
    input-debounce
    hide-bottom-space
    class="full-width"
    emit-value
    map-options
    :multiple="multiple"
    :options="filters.logProcesses"
    label="Log processes"
    behavior="menu"
    option-value="id"
    @filter="logProcessFilter"
    @keydown.tab="selectFirstOfLogProcesses()"
  >
    <template #no-option>
      <q-item>
        <q-item-section class="text-grey">No results</q-item-section>
      </q-item>
    </template>
    <template v-if="filters.selectedLogProcesses" #append>
      <q-icon
        name="cancel"
        class="cursor-pointer"
        @click.stop.prevent="filters.selectedLogProcesses = []"
      />
    </template>
    <template #selected-item="scope">
      <q-card class="column items-start q-mr-xs q-pa-xs">
        <q-chip v-if="scope.opt.category" dense>
          <q-avatar
            :icon="
              scope.opt.category
                ? logCategories[`id-${scope.opt.category}`]['icon']
                : ''
            "
            :color="
              scope.opt.category
                ? logCategories[`id-${scope.opt.category}`]['color']
                : ''
            "
            text-color="white"
          />
          {{
            scope.opt.category
              ? logCategories[`id-${scope.opt.category}`]['title']
              : ''
          }}
        </q-chip>
        {{ scope.opt.title }}
      </q-card>
    </template>
    <template #option="scope">
      <q-item v-bind="scope.itemProps" :class="{ 'bg-grey-3': scope.selected }">
        <q-item-section>
          <q-item-label class="column items-start">
            <q-chip v-if="scope.opt.category">
              <q-avatar
                :icon="
                  scope.opt.category
                    ? logCategories[`id-${scope.opt.category}`]['icon']
                    : ''
                "
                :color="
                  scope.opt.category
                    ? logCategories[`id-${scope.opt.category}`]['color']
                    : ''
                "
                text-color="white"
              />
              {{
                scope.opt.category
                  ? logCategories[`id-${scope.opt.category}`]['title']
                  : ''
              }}
            </q-chip>
            {{ scope.opt.title }}
          </q-item-label>
        </q-item-section>
      </q-item>
    </template>
  </q-select>
</template>

<script>
export default {
  props: {
    multiple: {
      type: Boolean,
      required: false,
      defaulf: false
    },
    categories: {
      type: Array,
      required: false,
      default: new Array()
    }
  },
  emits: ['processSelected'],
  data() {
    return {
      filters: {
        logProcesses: [],
        selectedLogProcesses: []
      }
    }
  },
  computed: {
    allLogProcesses() {
      return this.$store.getters['users/logProcesses']
    },
    logCategories() {
      return this.$store.getters['users/logCategories']
    },
    logProcessesArray() {
      const vuexLogProcesses = this.allLogProcesses
      let logProcessesArray = []
      for (const vuexLogProcess in vuexLogProcesses) {
        const logProcess = {}
        Object.assign(logProcess, vuexLogProcesses[vuexLogProcess])
        logProcessesArray.push(logProcess)
      }
      if (this.categories.length) {
        logProcessesArray = logProcessesArray.filter((el) =>
          this.categories.includes(el.category)
        )
      }
      return logProcessesArray.sort((a, b) => {
        if (a.category < b.category) {
          return -1
        }
        if (a.category > b.category) {
          return 1
        }

        return 0
      })
    },
    queryProcesses() {
      if (this.$route.query.selectedProcesses) {
        return this.$route.query.selectedProcesses.split(',')
      } else {
        return null
      }
    }
  },
  watch: {
    'filters.selectedLogProcesses': {
      handler: function (newValue, oldValue) {
        if (!newValue || oldValue === newValue) {
          return
        }
        this.$emit('processSelected', this.filters.selectedLogProcesses)
      },
      immediate: true,
      flush: 'post'
    },
    queryProcesses: {
      handler: function () {
        if (this.queryProcesses) {
          this.filters.selectedLogProcesses = this.queryProcesses
        }
      },
      immediate: true,
      flush: 'post'
    }
  },
  methods: {
    logProcessFilter(val, update) {
      if (val === '') {
        update(() => {
          this.filters.logProcesses = this.logProcessesArray
        })
        return
      }

      update(() => {
        const needle = val.toLowerCase()
        this.filters.logProcesses = this.logProcessesArray.filter(
          (el) => el.title.toLowerCase().indexOf(needle) > -1
        )
      })
    },
    selectFirstOfLogProcesses() {
      if (this.filters.logProcesses[0] !== undefined) {
        if (
          !this.filters.selectedLogProcesses.includes(
            this.filters.logProcesses[0]['id']
          )
        ) {
          this.filters.selectedLogProcesses.push(
            this.filters.logProcesses[0]['id']
          )
        }
      }
    }
  }
}
</script>

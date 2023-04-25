<template>
  <q-select
    ref="processesSelect"
    v-model="filters.selectedLogCategories"
    filled
    use-input
    input-debounce
    hide-bottom-space
    class="full-width"
    emit-value
    map-options
    :multiple="multiple"
    :options="filters.logCategories"
    label="Log Categories"
    behavior="menu"
    option-value="id"
    @filter="logCategoryFilter"
    @keydown.tab="selectFirstOfLogCategories()"
  >
    <template #no-option>
      <q-item>
        <q-item-section class="text-grey">No results</q-item-section>
      </q-item>
    </template>
    <template v-if="filters.selectedLogCategories" #append>
      <q-icon
        name="cancel"
        class="cursor-pointer"
        @click.stop.prevent="filters.selectedLogCategories = []"
      />
    </template>
    <template #selected-item="scope">
      <q-chip
        :icon="scope.opt.icon"
        :color="scope.opt.color"
        class="bg-white"
        outline
      >
        {{ scope.opt.title }}
      </q-chip>
    </template>
    <template #option="scope">
      <q-item v-bind="scope.itemProps" :class="{ 'bg-grey-3': scope.selected }">
        <q-item-section>
          <q-item-label class="column items-start">
            <q-chip
              :icon="scope.opt.icon"
              :color="scope.opt.color"
              text-color="white"
              outline
            >
              {{ scope.opt.title }}
            </q-chip>
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
    }
  },
  emits: ['categorySelected'],
  data() {
    return {
      filters: {
        logCategories: [],
        selectedLogCategories: []
      }
    }
  },
  computed: {
    allLogCategories() {
      return this.$store.getters['users/logCategories']
    },
    logCategoriesArray() {
      const vuexLogCategories = this.allLogCategories
      let logCategoriesArray = []
      for (const vuexLogProcess in vuexLogCategories) {
        const logCategory = {}
        Object.assign(logCategory, vuexLogCategories[vuexLogProcess])
        logCategoriesArray.push(logCategory)
      }
      return logCategoriesArray
    },
    queryCategories() {
      if (this.$route.query.selectedCategories) {
        return this.$route.query.selectedCategories.split(',')
      } else {
        return null
      }
    }
  },
  watch: {
    'filters.selectedLogCategories': {
      handler: function (newValue, oldValue) {
        if (!newValue || oldValue === newValue) {
          return
        }
        this.$emit('categorySelected', this.filters.selectedLogCategories)
      },
      immediate: true,
      flush: 'post'
    },
    queryCategories: {
      handler: function () {
        if (this.queryCategories) {
          this.filters.selectedLogCategories = this.queryCategories
        }
      },
      immediate: true,
      flush: 'post'
    }
  },
  mounted() {
    this.$refs.processesSelect.reset()
    this.$refs.processesSelect.refresh()
  },
  methods: {
    logCategoryFilter(val, update) {
      if (val === '') {
        update(() => {
          this.filters.logCategories = this.logCategoriesArray
        })
        return
      }

      update(() => {
        const needle = val.toLowerCase()
        this.filters.logCategories = this.logCategoriesArray.filter(
          (el) => el.title.toLowerCase().indexOf(needle) > -1
        )
      })
    },
    selectFirstOfLogCategories() {
      if (this.filters.logCategories[0] !== undefined) {
        if (
          !this.filters.selectedLogCategories.includes(
            this.filters.logCategories[0]['id']
          )
        ) {
          this.filters.selectedLogCategories.push(
            this.filters.logCategories[0]['id']
          )
        }
      }
    }
  }
}
</script>

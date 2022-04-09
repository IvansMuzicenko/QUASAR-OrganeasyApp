<template>
  <q-btn
    icon="tune"
    :color="Object.values(filter).some((el) => el != 'all') ? 'green' : ''"
    class="zindex-high"
    flat
  >
    <q-popup-proxy>
      <q-card>
        <q-card-section class="text-subtitle1 text-center">
          <q-icon name="filter_alt" />
          Filter

          <q-btn
            icon="backspace"
            color="red-5"
            flat
            dense
            size="sm"
            class="q-ml-md"
            @click="defaultFiltering()"
          >
            Clear
          </q-btn>
        </q-card-section>
        <q-card-section v-if="type == 'tasks' || type == 'free-tasks'">
          Progress:
          <q-radio
            v-model="filter.progress"
            val="all"
            label="All"
            class="full-width"
          />
          <q-radio
            v-model="filter.progress"
            val="1"
            label="Done"
            class="full-width"
          />
          <q-radio
            v-model="filter.progress"
            val="0"
            label="Undone"
            class="full-width"
          />
        </q-card-section>
        <q-separator />
        <q-card-section v-if="type == 'free-tasks'">
          Priority:
          <q-radio
            v-model="filter.priority"
            val="all"
            label="All"
            class="full-width"
          />
          <q-radio
            v-model="filter.priority"
            val="1"
            label="High"
            class="full-width"
          />
          <q-radio
            v-model="filter.priority"
            val="2"
            label="Medium"
            class="full-width"
          />
          <q-radio
            v-model="filter.priority"
            val="3"
            label="Low"
            class="full-width"
          />
        </q-card-section>
        <q-separator />
        <q-card-section v-if="type == 'notes'">
          Favorite:
          <q-radio
            v-model="filter.favorite"
            val="all"
            label="All"
            class="full-width"
          />
          <q-radio
            v-model="filter.favorite"
            val="1"
            label="Favorites"
            class="full-width"
          />
          <q-radio
            v-model="filter.favorite"
            val="0"
            label="Common"
            class="full-width"
          />
        </q-card-section>
        <q-separator />
        <q-card-section v-if="type == 'notes' || type == 'free-tasks'">
          Category:
          <q-radio
            v-model="filter.category"
            val="all"
            label="All"
            class="full-width"
          />
          <q-radio
            v-model="filter.category"
            val="uncategorized"
            label="Uncategorized"
            class="full-width"
          />
          <q-radio
            v-for="(category, index) of itemsCategories"
            :key="index"
            v-model="filter.category"
            :val="category['id']"
            class="full-width"
          >
            <q-icon
              :name="category['icon']"
              :color="category['color']"
              size="xs"
            />
            {{ category['title'] }}
          </q-radio>
        </q-card-section>
        <q-separator />

        <q-card-section class="text-subtitle1 text-center">
          <q-icon name="sort" />
          Sort

          <q-btn
            icon="backspace"
            color="red-5"
            flat
            dense
            size="sm"
            class="q-ml-md"
            @click="defaultSorting()"
          >
            Clear
          </q-btn>
        </q-card-section>
        <q-card-section>
          <q-btn
            :icon="
              sort.title == 'none'
                ? 'last_page'
                : sort.title == 'asc'
                ? 'vertical_align_bottom'
                : 'vertical_align_top'
            "
            class="full-width"
            @click="sortByTitle"
          >
            Title
          </q-btn>
          <q-btn
            v-if="type == 'tasks' || type == 'processes'"
            :icon="
              sort.time == 'none'
                ? 'last_page'
                : sort.time == 'asc'
                ? 'vertical_align_bottom'
                : 'vertical_align_top'
            "
            class="full-width"
            @click="sortByTime"
          >
            Time
          </q-btn>
          <q-btn
            v-if="type == 'free-tasks'"
            :icon="
              sort.priority == 'none'
                ? 'last_page'
                : sort.priority == 'asc'
                ? 'vertical_align_bottom'
                : 'vertical_align_top'
            "
            class="full-width"
            @click="sortByPriority"
          >
            Priority
          </q-btn>
          <q-btn
            v-if="type != 'processes'"
            :icon="
              sort.dateModified == 'none'
                ? 'last_page'
                : sort.dateModified == 'asc'
                ? 'vertical_align_bottom'
                : 'vertical_align_top'
            "
            class="full-width"
            @click="sortByDateModified"
          >
            Date modified
          </q-btn>
        </q-card-section>
      </q-card>
    </q-popup-proxy>
  </q-btn>
</template>
<script>
export default {
  props: {
    items: {
      type: Array,
      required: true
    },
    type: {
      type: String,
      required: true
    }
  },
  emits: ['updateData'],
  data() {
    return {
      filter: {
        progress: 'all',
        priority: 'all',
        favorite: 'all',
        category: 'all'
      },
      sort: {
        title: 'none',
        time: 'asc',
        priority: 'asc',
        dateModified: 'none'
      }
    }
  },
  computed: {
    modifiedItems() {
      let modifiedItems = this.items
        .filter(
          (el) =>
            (this.filter.progress == 'all' ||
              (el['progress'] != undefined &&
                this.filter.progress == el['progress'])) &&
            (this.filter.priority == 'all' ||
              (el['priority'] != undefined &&
                this.filter.priority == el['priority'])) &&
            (this.filter.category == 'all' ||
              (el['category'] == undefined &&
                this.filter.category == 'uncategorized') ||
              (el['category'] != undefined &&
                this.filter.category == el['category'])) &&
            (this.filter.favorite == 'all' ||
              (el['favorite'] != undefined &&
                this.filter.favorite == el['favorite']))
        )
        .sort((a, b) => {
          if (this.sort.title != 'none') {
            if (this.sort.title == 'asc') {
              if (a.title.toLowerCase() > b.title.toLowerCase()) return 1
              if (a.title.toLowerCase() < b.title.toLowerCase()) return -1
              return 0
            } else {
              if (a.title.toLowerCase() < b.title.toLowerCase()) return 1
              if (a.title.toLowerCase() > b.title.toLowerCase()) return -1
              return 0
            }
          } else if (this.sort.time != 'none') {
            const first =
              this.type == 'tasks'
                ? a.time.slice(a.time.indexOf(' ')).replace(':', '.')
                : a.time
            const second =
              this.type == 'tasks'
                ? b.time.slice(b.time.indexOf(' ')).replace(':', '.')
                : b.time
            if (this.sort.time == 'asc') {
              return first - second
            } else {
              return second - first
            }
          } else if (this.sort.priority != 'none') {
            if (this.sort.priority == 'asc') {
              return (
                (a.priority ? a.priority : 3) - (b.priority ? b.priority : 3)
              )
            } else {
              return (
                (b.priority ? b.priority : 3) - (a.priority ? a.priority : 3)
              )
            }
          } else if (this.sort.dateModified != 'none') {
            if (this.sort.dateModified == 'asc') {
              return (
                (a.dateModified ? a.dateModified : 0) -
                (b.dateModified ? b.dateModified : 0)
              )
            } else {
              return (
                (b.dateModified ? b.dateModified : 0) -
                (a.dateModified ? a.dateModified : 0)
              )
            }
          }
        })
      return modifiedItems
    },
    itemsCategories() {
      let itemsCategories = []
      for (const item of this.items) {
        if (
          item['category'] &&
          (!itemsCategories.length ||
            !itemsCategories.some(
              (element) => element['id'] == item['category']
            ))
        ) {
          itemsCategories.push(this.findCategory(item['category']))
        }
      }
      return itemsCategories
    }
  },
  watch: {
    modifiedItems() {
      this.$emit('updateData', this.modifiedItems)
    }
  },
  mounted() {
    this.defaultFiltering()
    this.defaultSorting()
  },
  methods: {
    findCategory(id) {
      return this.$store.getters['users/categories'][`id-${id}`] || {}
    },
    defaultFiltering() {
      this.filter.progress =
        this.filter.priority =
        this.filter.favorite =
        this.filter.category =
          'all'
    },
    defaultSorting() {
      this.sort.priority =
        this.sort.time =
        this.sort.dateModified =
        this.sort.title =
          'none'

      if (this.type == 'free-tasks') {
        this.sort.priority = 'asc'
      } else if (this.type == 'tasks' || this.type == 'processes') {
        this.sort.time = 'asc'
      } else if (this.type == 'notes') {
        this.sort.dateModified = 'asc'
      }
    },
    sortByTitle() {
      this.sort.priority = this.sort.time = this.sort.dateModified = 'none'
      this.sort.title = this.sort.title == 'asc' ? 'desc' : 'asc'
    },
    sortByTime() {
      this.sort.priority = this.sort.title = this.sort.dateModified = 'none'
      this.sort.time = this.sort.time == 'asc' ? 'desc' : 'asc'
    },
    sortByPriority() {
      this.sort.time = this.sort.title = this.sort.dateModified = 'none'
      this.sort.priority = this.sort.priority == 'asc' ? 'desc' : 'asc'
    },
    sortByDateModified() {
      this.sort.priority = this.sort.title = this.sort.time = 'none'
      this.sort.dateModified = this.sort.dateModified == 'asc' ? 'desc' : 'asc'
    }
  }
}
</script>

<template>
  <q-btn flat dense>
    <q-icon
      :name="currentCategory['icon'] || ''"
      :color="currentCategory['color'] || ''"
    />
    {{ iconOnly ? '' : currentCategory['title'] || 'None' }}
    <q-icon name="expand_more" />
    <q-menu anchor="bottom left" self="top left" auto-close>
      <p class="text-center text-subtitle1 no-margin">Categories</p>
      <q-list separator>
        <q-separator />
        <q-item
          clickable
          class="full-width text-subtitle1"
          @click="categorySelected(null)"
        >
          <div>None</div>
        </q-item>
        <q-item
          v-for="(category, categoryIndex) of categories"
          :key="categoryIndex"
          clickable
          class="full-width text-subtitle1"
          @click="categorySelected(category.id)"
        >
          <div class="full-width">
            <q-icon
              :name="category['icon']"
              :color="category['color']"
              size="sm"
            />
            {{ category['title'] }}
          </div>
        </q-item>
        <q-item
          clickable
          class="full-width text-subtitle1"
          @click="addCategory"
        >
          <div>
            <q-icon name="add" />
            Add new
            <q-icon name="add" />
          </div>
        </q-item>
      </q-list>
    </q-menu>
  </q-btn>
</template>

<script>
import { getDatabase, ref, update } from 'firebase/database'

import AddCategory from 'src/components/common/dialogs/AddCategory.vue'

const db = getDatabase()

export default {
  props: {
    itemCategory: {
      type: String,
      required: true
    },
    rewrite: {
      type: Boolean,
      required: false,
      default: false
    },
    iconOnly: {
      type: Boolean,
      required: false,
      default: false
    },
    itemPath: {
      type: String,
      required: false,
      default: ''
    }
  },
  emits: ['categorySelected'],
  computed: {
    categories() {
      const vuexCategories = this.$store.getters['users/categories']
      let categories = []
      for (const category in vuexCategories) {
        categories.push(vuexCategories[category])
      }
      return categories
    },
    currentCategory() {
      return (
        this.$store.getters['users/categories'][`id-${this.itemCategory}`] || {}
      )
    }
  },
  methods: {
    categorySelected(categoryId) {
      if ((this.itemCategory || null) != categoryId) {
        if (this.rewrite) {
          update(
            ref(db, `${this.$store.getters['users/userId']}/${this.itemPath}`),
            {
              category: categoryId
            }
          )
          this.$emit('categorySelected')
        } else {
          this.$emit('categorySelected', categoryId)
        }
      }
    },
    addCategory() {
      this.$q.dialog({
        component: AddCategory
      })
    }
  }
}
</script>

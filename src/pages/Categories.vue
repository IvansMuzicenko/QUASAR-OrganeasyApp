<template>
  <q-page>
    <q-card class="q-py-sm">
      <q-btn
        icon="arrow_back"
        flat
        class="absolute zindex-high"
        @click="$router.push('/')"
      />
      <p class="text-center text-h6 full-width no-margin">Categories</p>
    </q-card>

    <q-list separator bordered>
      <q-item
        v-for="(category, index) of categories"
        :key="index"
        clickable
        @click="editCategory(category)"
      >
        <q-icon :name="category['icon']" :color="category['color']" size="sm" />
        {{ category['title'] }}
      </q-item>
    </q-list>

    <div class="text-center q-my-md">
      <p v-if="!Object.keys(categories).length">You have not categories!</p>
      <q-btn color="secondary" @click="addCategory()">Add category</q-btn>
    </div>
    <q-dialog ref="dialog" @hide="onDialogHide">
      <category-form
        :edit-category="selectedCategory"
        @saveEvent="onSaveClick"
        @cancelEvent="onCancelClick"
      />
    </q-dialog>
  </q-page>
</template>

<script>
import { getDatabase, ref, update, remove } from 'firebase/database'
import AddCategoryForm from 'src/components/AddCategoryForm.vue'
import CategoryForm from 'src/components/CategoryForm.vue'

const db = getDatabase()

export default {
  components: {
    CategoryForm
  },
  emits: ['ok', 'hide'],
  data() {
    return {
      selectedCategory: {}
    }
  },
  computed: {
    categories() {
      const vuexCategories = this.$store.getters['users/categories']
      let categories = []
      for (const category in vuexCategories) {
        categories.push(vuexCategories[category])
      }
      return categories
    }
  },

  methods: {
    addCategory() {
      this.$q.dialog({
        component: AddCategoryForm
      })
    },
    editCategory(category) {
      this.selectedCategory = JSON.parse(JSON.stringify(category))
      this.show()
    },
    show() {
      this.$refs.dialog.show()
    },

    hide() {
      this.$refs.dialog.hide()
    },

    onDialogHide() {
      this.$emit('hide')
    },

    onSaveClick(form) {
      update(
        ref(
          db,
          `${this.$store.getters['users/userId']}/categories/id-${form.id}`
        ),
        form
      )

      this.$emit('ok')

      this.hide()

      this.$q.notify({
        position: 'top',
        message: 'Category edited',
        color: 'blue',
        timeout: 1000
      })
    },

    onCancelClick() {
      this.hide()
    }
  }
}
</script>

<style></style>

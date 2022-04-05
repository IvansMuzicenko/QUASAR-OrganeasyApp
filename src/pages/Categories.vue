<template>
  <q-page>
    <q-card class="q-py-sm">
      <back-button />

      <p class="text-center text-h6 full-width no-margin">Categories</p>
    </q-card>

    <q-list separator bordered>
      <q-item
        v-for="(category, index) of categories"
        :key="index"
        clickable
        @click="editCategory(category)"
      >
        <q-item-section>
          <div>
            <q-icon
              :name="category['icon']"
              :color="category['color']"
              size="sm"
              class="vertical-middle"
            />
            {{ category['title'] }}
          </div>
        </q-item-section>
        <q-item-section side>
          <div class="float-right">
            <q-btn
              flat
              round
              icon="edit"
              color="secondary"
              @click.prevent.stop="editCategory(category)"
            />

            <item-remove :item="category" type="category" small />
          </div>
        </q-item-section>
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

import AddCategory from 'src/components/common/dialogs/AddCategory.vue'
import CategoryForm from 'src/components/forms/CategoryForm.vue'

import ItemRemove from 'src/components/common/groups/ItemRemove.vue'

import BackButton from 'src/components/common/elements/buttons/BackButton.vue'

const db = getDatabase()

export default {
  components: {
    CategoryForm,
    ItemRemove,
    BackButton
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
        component: AddCategory
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
      this.selectedCategory = {}
    },

    onDialogHide() {
      this.$emit('hide')
      this.selectedCategory = {}
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

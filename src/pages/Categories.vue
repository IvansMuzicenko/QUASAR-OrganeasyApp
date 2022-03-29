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
            <q-btn
              flat
              round
              icon="delete"
              color="red"
              @click.prevent.stop="deleteCategory(category)"
            />
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
    <q-dialog ref="deleteDialog" @hide="deleteDialogHide">
      <q-card>
        <q-card-section>
          Are you sure you wand to delete
          <q-icon
            :name="selectedCategory['icon']"
            :color="selectedCategory['color']"
          />
          {{ selectedCategory['title'] }} category?
        </q-card-section>
        <q-card-actions align="right">
          <q-btn icon="delete" color="red" @click="onConfirmDelete">
            Delete
          </q-btn>
          <q-btn color="primary" @click="deleteDialogHide">Cancel</q-btn>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { getDatabase, ref, update, remove } from 'firebase/database'
import AddCategory from 'src/components/common/dialogs/AddCategory.vue'
import CategoryForm from 'src/components/forms/CategoryForm.vue'

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
        component: AddCategory
      })
    },
    editCategory(category) {
      this.selectedCategory = JSON.parse(JSON.stringify(category))
      this.show()
    },
    deleteCategory(category) {
      this.selectedCategory = JSON.parse(JSON.stringify(category))
      this.$refs['deleteDialog'].show()
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
    deleteDialogHide() {
      this.$refs['deleteDialog'].hide()
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
    },
    onConfirmDelete() {
      remove(
        ref(
          db,
          `${this.$store.getters['users/userId']}/categories/id-${this.selectedCategory.id}`
        )
      )
      this.deleteExists(this.selectedCategory.id)
      this.deleteDialogHide()
      this.$q.notify({
        position: 'top',
        message: 'Category deleted',
        color: 'red',
        timeout: 1000
      })
    },
    deleteExists(id) {
      const vuexFreeTasks = this.$store.getters['users/freeTasks']
      for (const vuexFreeTask in vuexFreeTasks) {
        const freeTask = vuexFreeTasks[vuexFreeTask]
        if (freeTask.category && freeTask.category == id) {
          remove(
            ref(
              db,
              `${this.$store.getters['users/userId']}/freeTasks/id-${freeTask['id']}/category`
            )
          )
        }
      }

      const vuexNotes = this.$store.getters['users/notes']
      for (const vuexNote in vuexNotes) {
        const note = vuexNotes[vuexNote]
        if (note.category && note.category == id) {
          remove(
            ref(
              db,
              `${this.$store.getters['users/userId']}/notes/id-${note['id']}/category`
            )
          )
        }
      }
    }
  }
}
</script>

<style></style>

<template>
  <q-card :class="editNote ? '' : 'q-dialog-plugin'">
    <p v-if="!editNote" class="text-center text-subtitle1 no-margin">
      New note
      <q-btn
        icon="close"
        class="absolute-top-right"
        flat
        dense
        @click="onCancelClick"
      />
    </p>

    <q-card-section>
      <q-input
        v-model="form.title"
        bottom-slots
        label="Title"
        lazy-rules
        :dense="false"
      />
      <q-btn dense flat @click="form.favorite = !form.favorite">
        <q-icon
          :name="form['favorite'] ? 'star' : 'star_outline'"
          :color="form['favorite'] ? 'yellow' : ''"
        />
        Favorite
      </q-btn>

      <q-card-section class="q-pl-xs">
        Category:
        <q-btn flat dense>
          <q-icon
            :name="form.category ? selectedCategory['icon'] : ''"
            :color="form.category ? selectedCategory['color'] : ''"
          />
          {{ selectedCategory['title'] || 'Uncategorized' }}
          <q-icon name="expand_more" />
          <q-menu anchor="bottom left" self="top left">
            <p class="text-center text-subtitle1 no-margin">Categories</p>
            <q-list separator>
              <q-separator />
              <q-item
                clickable
                class="full-width text-subtitle1"
                @click="form.category = null"
              >
                <div>
                  <q-icon />
                  None
                </div>
              </q-item>
              <q-item
                v-for="(listCategory, categoryIndex) of categories"
                :key="categoryIndex"
                clickable
                class="full-width text-subtitle1"
                @click="form.category = listCategory['id']"
              >
                <div class="full-width">
                  <q-icon
                    :name="listCategory['icon']"
                    :color="listCategory['color']"
                    size="sm"
                  />
                  {{ listCategory['title'] }}
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
                </div>
              </q-item>
            </q-list>
          </q-menu>
        </q-btn>
      </q-card-section>

      <editor v-model="form.text" />
    </q-card-section>
    <q-card-section v-if="error">
      <p class="text-negative">Title or text is required</p>
    </q-card-section>

    <q-card-actions align="right">
      <save-button v-if="editNote" :error="error" @saveEvent="onSaveClick" />
      <q-btn
        v-if="!editNote"
        color="primary"
        :disable="error"
        label="Add"
        @click="onOKClick"
      />
      <q-btn color="negative" label="Cancel" @click="onCancelClick" />
    </q-card-actions>
  </q-card>
</template>
<script>
import Editor from 'src/components/common/form/Editor.vue'
import AddCategory from 'src/components/common/dialogs/AddCategory.vue'

import SaveButton from 'src/components/common/elements/buttons/SaveButton.vue'

export default {
  components: { Editor, SaveButton },
  props: {
    editNote: {
      type: Object,
      required: false,
      default: null
    }
  },
  emits: ['OKEvent', 'cancelEvent', 'saveEvent', 'error'],
  data() {
    return {
      form: {
        id: '',
        title: '',
        text: '',
        favorite: false,
        category: null
      }
    }
  },
  computed: {
    error() {
      return (
        !this.form.text.replace('<br>', '') &&
        !this.form.title.replace('<br>', '')
      )
    },
    categories() {
      const vuexCategories = this.$store.getters['users/categories']
      let categories = []
      for (const category in vuexCategories) {
        categories.push(vuexCategories[category])
      }
      return categories
    },
    selectedCategory() {
      const vuexCategories = this.$store.getters['users/categories']
      if (this.form.category) {
        return vuexCategories[`id-${this.form.category}`] || {}
      } else {
        return {}
      }
    }
  },
  watch: {
    error() {
      this.$emit('error', this.error)
    }
  },
  mounted() {
    this.updateData()
  },
  methods: {
    updateData() {
      if (this.editNote) {
        this.form.id = this.editNote.id
        this.form.title = this.editNote.title
        this.form.text = this.editNote.text
        this.form.favorite = this.editNote.favorite
        this.form.category = this.editNote.category || null
      }
    },
    addCategory() {
      this.$q.dialog({
        component: AddCategory
      })
    },
    onOKClick() {
      this.$emit('OKEvent', this.form)
    },
    onSaveClick() {
      this.$emit('saveEvent', this.form)
    },
    onCancelClick() {
      this.$emit('cancelEvent')
    }
  }
}
</script>

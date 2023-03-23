<template>
  <q-page>
    <q-card class="q-py-sm">
      <back-button />

      <p class="text-center text-h6 full-width no-margin">Log Categories</p>
    </q-card>

    <div>
      <q-input
        v-model="searchQuery"
        outlined
        debounce="500"
        type="search"
        label="Search"
      >
        <template #prepend>
          <q-icon name="search" />
        </template>
      </q-input>
    </div>

    <q-list separator bordered>
      <q-item
        v-for="(logCategory, index) of logCategories"
        :key="index"
        clickable
        @click="editCategory(logCategory)"
      >
        <q-item-section>
          <div>
            <q-icon
              :name="logCategory['icon']"
              :color="logCategory['color']"
              size="sm"
              class="vertical-middle"
            />
            {{ logCategory['title'] }}
          </div>
        </q-item-section>
        <q-item-section side>
          <div class="float-right">
            <q-btn
              flat
              round
              icon="edit"
              color="secondary"
              @click.prevent.stop="editCategory(logCategory)"
            />

            <item-remove :item="logCategory" type="log-category" small />
          </div>
        </q-item-section>
      </q-item>
    </q-list>

    <div class="text-center q-my-md">
      <p v-if="!Object.keys(logCategories).length">
        You have not logCategories!
      </p>
      <q-btn color="secondary" @click="addCategory()">Add logCategory</q-btn>
    </div>
  </q-page>
</template>

<script>
import AddCategory from 'src/components/common/dialogs/AddCategory.vue'

import ItemRemove from 'src/components/common/groups/ItemRemove.vue'

import BackButton from 'src/components/common/elements/buttons/BackButton.vue'

export default {
  components: {
    ItemRemove,
    BackButton
  },
  data() {
    return {
      selectedCategory: {},
      searchQuery: ''
    }
  },
  computed: {
    logCategories() {
      const vuexCategories = this.$store.getters['users/logCategories']
      let logCategories = []
      for (const logCategory in vuexCategories) {
        logCategories.push(vuexCategories[logCategory])
      }

      if (this.searchQuery.length) {
        logCategories = logCategories.filter((item) => {
          return this.searchQuery
            .toLowerCase()
            .split(' ')
            .every((v) => item.title.toLowerCase().includes(v))
        })
      }

      return logCategories
    }
  },

  methods: {
    addCategory() {
      this.$q.dialog({
        component: AddCategory,
        componentProps: {
          logCategory: true
        }
      })
    },
    editCategory(logCategory) {
      this.$q.dialog({
        component: AddCategory,
        componentProps: {
          logCategory: true,
          editCategory: logCategory
        }
      })
    }
  }
}
</script>

<style></style>

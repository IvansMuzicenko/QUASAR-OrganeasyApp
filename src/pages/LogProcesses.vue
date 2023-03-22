<template>
  <q-page>
    <q-card class="q-py-sm column">
      <p class="text-center text-h6 full-width no-margin">Log Processes</p>
      <div class="row justify-between">
        <back-button />

        <filter-sort
          :items="logProcesses"
          type="log-processes"
          @update-data="(modifiedItems) => (logProcessesFilter = modifiedItems)"
        />
      </div>
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
        v-for="(logProcess, index) of logProcessesFilter"
        :key="index"
        clickable
        class="column"
        @click="editLogProcess(logProcess)"
      >
        <q-item-section v-show="logProcess.category">
          <div class="">
            <q-chip>
              <q-avatar
                :icon="
                  logProcess.category
                    ? logCategories[`id-${logProcess.category}`]['icon']
                    : ''
                "
                :color="
                  logProcess.category
                    ? logCategories[`id-${logProcess.category}`]['color']
                    : ''
                "
                text-color="white"
              />
              {{
                logProcess.category
                  ? logCategories[`id-${logProcess.category}`]['title']
                  : ''
              }}
            </q-chip>
          </div>
        </q-item-section>
        <q-item-section>
          <p>{{ logProcess.title }}</p>
        </q-item-section>
        <q-item-section v-show="logProcess.description">
          <p v-html="logProcess.description" />
        </q-item-section>
      </q-item>
    </q-list>

    <div class="text-center q-my-md">
      <p v-if="!Object.keys(logProcesses).length">
        You have not log processes!
      </p>
      <q-btn color="secondary" @click="addLogProcess()">Add logProcess</q-btn>
    </div>
  </q-page>
</template>

<script>
import AddLogProcess from 'src/components/common/dialogs/AddLogProcess.vue'

import FilterSort from 'src/components/common/groups/FilterSort.vue'

import BackButton from 'src/components/common/elements/buttons/BackButton.vue'

export default {
  components: {
    BackButton,
    FilterSort
  },
  data() {
    return {
      selectedProcess: {},
      searchQuery: '',
      logProcessesFilter: []
    }
  },
  computed: {
    logProcesses() {
      const vuexProcesses = this.$store.getters['users/logProcesses']

      let logProcesses = []
      for (const logProcess in vuexProcesses) {
        logProcesses.push(vuexProcesses[logProcess])
      }

      if (this.searchQuery.length) {
        logProcesses = logProcesses.filter((item) => {
          return this.searchQuery
            .toLowerCase()
            .split(' ')
            .every(
              (v) =>
                item.title.toLowerCase().includes(v) ||
                item.description.toLowerCase().includes(v) ||
                this.logCategories[`id-${item.category}`]?.title
                  .toLowerCase()
                  .includes(v)
            )
        })
      }
      return logProcesses
    },
    logCategories() {
      return this.$store.getters['users/logCategories'] || {}
    }
  },

  methods: {
    addLogProcess() {
      this.$q.dialog({
        component: AddLogProcess,
        componentProps: {
          logProcess: true
        }
      })
    },
    editLogProcess(logProcess) {
      this.$q.dialog({
        component: AddLogProcess,
        componentProps: {
          logProcess: true,
          editLogProcess: logProcess
        }
      })
    }
  }
}
</script>

<style></style>

<template>
  <q-page>
    <q-card class="q-py-sm">
      <p class="text-center text-h6 full-width no-margin">Free Tasks</p>
      <q-card-section class="flex justify-between no-padding">
        <q-card-section class="no-padding">
          <back-button />
        </q-card-section>

        <q-card-section class="no-padding">
          <q-btn
            icon="search"
            class="zindex-high"
            flat
            rounded
            @click="openSearch"
          />
          <filter-sort
            :items="freeTasksArray"
            type="free-tasks"
            @update-data="(modifiedItems) => (freeTasks = modifiedItems)"
          />
        </q-card-section>
      </q-card-section>
    </q-card>
    <p
      v-if="freeTasks.some((el) => !el['progress'])"
      class="text-center text-body1"
    >
      Uncompleted tasks
    </p>
    <q-list v-if="freeTasks.some((el) => !el['progress'])" separator bordered>
      <q-item
        v-for="(task, index) of freeTasks.filter((el) => !el['progress'])"
        :key="index"
        v-touch-hold:400:12:15.mouse="(event) => taskHold(event, task['id'])"
        :style="task['progress'] ? ' background: lightgrey' : ''"
        style="border: 2px solid lightgrey"
        clickable
        :to="`/free-tasks/${task['id']}`"
        class="q-pa-none"
      >
        <q-item-section thumbnail class="no-margin">
          <div
            :class="
              task['priority'] == 1
                ? 'bg-green'
                : task['priority'] == 2
                ? 'bg-yellow'
                : 'bg-red-11'
            "
            class="full-height"
            style="width: 1rem; border-right: 1px solid lightgrey"
          />
          <q-icon
            :name="task.category ? findCategory(task.category)['icon'] : ''"
            :color="task.category ? findCategory(task.category)['color'] : ''"
          />
        </q-item-section>
        <q-item-section>
          <q-item-section class="q-px-md text-weight-bolder">
            <q-item-section>
              {{ task['title'] }}
            </q-item-section>
            <q-separator
              v-if="task['subtasks'] && subtasksState(task['subtasks'])"
              spaced="sm"
              size="7px"
            />

            <q-list separator dense class="q-pl-sm">
              <q-item
                v-for="(subtask, subIndex) in task['subtasks']"
                v-show="!subtask['progress']"
                :key="subtask"
                v-touch-hold:400:12:15.mouse.stop="
                  (event) => doneSubtask(task, subIndex)
                "
                dense
                class="no-padding"
                @touchstart.stop
                @mousedown.stop
              >
                <q-item-section>
                  <q-separator
                    v-if="subIndex > 0 && !subtask['progress']"
                    size="3px"
                    spaced="sm"
                  />
                  <q-item-label>- {{ subtask['title'] }}</q-item-label>
                  <q-separator
                    v-if="subtask['subtasks'] && subtask['subtasks'].length"
                    spaced="sm"
                  />
                  <q-list separator>
                    <q-item
                      v-for="(subSubtask, subSubIndex) of subtask['subtasks']"
                      v-show="!subSubtask['progress']"
                      :key="subSubIndex"
                      v-touch-hold:400:12:15.mouse.stop="
                        (event) => doneSubSubtask(task, subIndex, subSubIndex)
                      "
                      dense
                      @touchstart.stop
                      @mousedown.stop
                    >
                      ~~ {{ subSubtask['title'] }}
                    </q-item>
                  </q-list>
                </q-item-section>
              </q-item>
            </q-list>
          </q-item-section>
        </q-item-section>
      </q-item>
    </q-list>

    <q-separator
      v-if="
        freeTasks.some((el) => el['progress']) &&
        freeTasks.some((el) => !el['progress'])
      "
    />

    <p
      v-if="freeTasks.some((el) => el['progress'])"
      class="text-center text-body1"
    >
      Completed tasks
    </p>
    <q-separator v-if="freeTasks.some((el) => el['progress'])" />
    <q-list v-if="freeTasks.some((el) => el['progress'])" separator bordered>
      <q-item
        v-for="(task, index) of freeTasks.filter((el) => el['progress'])"
        :key="index"
        v-touch-hold:400:12:15.mouse="(event) => taskHold(event, task['id'])"
        :class="task['progress'] ? 'bg-green-11' : ''"
        clickable
        :to="`/free-tasks/${task['id']}`"
      >
        <q-item-section thumbnail class="q-px-sm">
          <q-icon
            :name="task.category ? findCategory(task.category)['icon'] : ''"
            :color="task.category ? findCategory(task.category)['color'] : ''"
          />
        </q-item-section>
        <q-item-section class="text-weight-bolder">
          {{ task['title'] }}
        </q-item-section>
      </q-item>
    </q-list>
    <hold-menu ref="holdMenu" :item="holdedTask" type="free-task" />
    <div class="text-center q-my-md">
      <p v-if="!Object.keys(freeTasks).length">You have not free-tasks</p>
      <q-btn color="secondary" @click="addFreeTask()">Add free-task</q-btn>
    </div>
  </q-page>
</template>

<script>
import { getDatabase, ref, update } from 'firebase/database'

import AddFreeTask from 'src/components/common/dialogs/AddFreeTask.vue'
import Search from 'src/components/common/dialogs/Search.vue'
import FilterSort from 'src/components/common/groups/FilterSort.vue'

import HoldMenu from 'src/components/common/dialogs/HoldMenu.vue'

import BackButton from 'src/components/common/elements/buttons/BackButton.vue'

const db = getDatabase()

export default {
  components: {
    FilterSort,
    HoldMenu,
    BackButton
  },
  data() {
    return {
      freeTasks: [],
      holdedTaskId: ''
    }
  },
  computed: {
    freeTasksArray() {
      const vuexFreeTasks = this.$store.getters['users/freeTasks']
      let freeTasks = []
      if (vuexFreeTasks) {
        for (const vuexFreeTask in vuexFreeTasks) {
          freeTasks.push(vuexFreeTasks[vuexFreeTask])
        }
      }
      return freeTasks
    },
    holdedTask() {
      return (
        this.$store.getters['users/freeTasks'][`id-${this.holdedTaskId}`] || {}
      )
    }
  },
  methods: {
    addFreeTask() {
      this.$q.dialog({
        component: AddFreeTask
      })
    },
    subtasksState(subtasks) {
      for (const sub of subtasks) {
        if (!sub['progress']) return true
      }
      return false
    },
    doneSubtask(task, index) {
      update(
        ref(
          db,
          `${this.$store.getters['users/userId']}/freeTasks/id-${task.id}/subtasks/${index}`
        ),
        { progress: true }
      )
    },
    doneSubSubtask(task, index, subIndex) {
      update(
        ref(
          db,
          `${this.$store.getters['users/userId']}/freeTasks/id-${task.id}/subtasks/${index}/subtasks/${subIndex}`
        ),
        { progress: true }
      )
    },
    taskHold(event, id) {
      this.holdedTaskId = id
      this.$refs['holdMenu'].show()
    },

    findCategory(id) {
      return this.$store.getters['users/categories'][`id-${id}`] || {}
    },
    openSearch() {
      this.$q.dialog({
        component: Search,
        componentProps: {
          searchType: 'free-tasks'
        }
      })
    }
  }
}
</script>

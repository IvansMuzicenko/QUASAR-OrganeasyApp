<template>
  <q-page>
    <q-card class="flex justify-between q-py-sm">
      <q-card-section class="no-padding">
        <q-btn
          icon="arrow_back"
          flat
          class="absolute zindex-high"
          @click="$router.push('/')"
        />
      </q-card-section>

      <q-card-section class="no-padding">
        <q-btn
          icon="search"
          class="zindex-high"
          flat
          rounded
          @click="openSearch"
        ></q-btn>
        <q-btn icon="tune" class="zindex-high" flat>
          <q-popup-proxy>
            <q-card>
              <q-card-section class="text-subtitle1 text-center">
                <q-icon name="filter_alt" /> Filter
              </q-card-section>
              <q-card-section class="no-padding">
                <q-card-section>
                  Progress:
                  <q-radio
                    v-model="filtering.progress"
                    val="all"
                    label="All"
                    class="full-width"
                  >
                  </q-radio>
                  <q-radio
                    v-model="filtering.progress"
                    val="done"
                    label="Done"
                    class="full-width"
                  >
                  </q-radio>
                  <q-radio
                    v-model="filtering.progress"
                    val="undone"
                    label="Undone"
                    class="full-width"
                  >
                  </q-radio>
                </q-card-section>
                <q-separator></q-separator>
                <q-card-section>
                  Priority:
                  <q-radio
                    v-model="filtering.priority"
                    val="all"
                    label="All"
                    class="full-width"
                  >
                  </q-radio>
                  <q-radio
                    v-model="filtering.priority"
                    val="1"
                    label="High"
                    class="full-width"
                  >
                  </q-radio>
                  <q-radio
                    v-model="filtering.priority"
                    val="2"
                    label="Medium"
                    class="full-width"
                  >
                  </q-radio>
                  <q-radio
                    v-model="filtering.priority"
                    val="3"
                    label="Low"
                    class="full-width"
                  >
                  </q-radio>
                </q-card-section>
              </q-card-section>

              <q-separator></q-separator>

              <q-card-section class="text-subtitle1 text-center">
                <q-icon name="sort" /> Sort
              </q-card-section>
              <q-card-section>
                <q-btn
                  :icon="
                    sorting.title == 'none'
                      ? 'last_page'
                      : sorting.title == 'asc'
                      ? 'vertical_align_bottom'
                      : 'vertical_align_top'
                  "
                  class="full-width"
                  @click="sortByTitle"
                >
                  Title
                </q-btn>
                <q-btn
                  :icon="
                    sorting.priority == 'none'
                      ? 'last_page'
                      : sorting.priority == 'asc'
                      ? 'vertical_align_bottom'
                      : 'vertical_align_top'
                  "
                  class="full-width"
                  @click="sortByPriority"
                >
                  Priority
                </q-btn>
              </q-card-section>
            </q-card>
          </q-popup-proxy>
        </q-btn>
      </q-card-section>

      <p class="text-center text-h6 full-width no-margin">Free Tasks</p>
    </q-card>
    <p
      v-if="
        Object.keys(freeTasks).length &&
        (filtering.progress == 'all' || filtering.progress == 'undone')
      "
      class="text-center text-body1"
    >
      Uncompleted tasks
    </p>
    <q-list
      v-if="filtering.progress == 'all' || filtering.progress == 'undone'"
      separator
      bordered
    >
      <q-item
        v-for="(task, index) of freeTasks"
        v-show="
          !task['progress'] &&
          (filtering.priority == 'all' ||
            filtering.priority == task['priority'])
        "
        :key="index"
        v-touch-hold:400:12:15.mouse="(event) => holdUncompleted(event, index)"
        :style="task['progress'] ? ' background: lightgrey' : ''"
        clickable
        :to="`/free-tasks/${task['id']}`"
        class="q-pa-none"
      >
        <q-item-section
          thumbnail
          class="no-margin no-padding"
          :class="
            task['priority'] == 1
              ? 'bg-green'
              : task['priority'] == 2
              ? 'bg-yellow'
              : 'bg-red-11'
          "
          style="width: 1rem"
        >
        </q-item-section>
        <q-item-section>
          <q-item-section class="q-px-md">
            <q-item-section class="text-weight-bolder">{{
              task['title']
            }}</q-item-section>
            <q-separator
              v-if="task['subtasks'] && subtasksState(task['subtasks'])"
              spaced="sm"
            />
            <q-separator
              v-if="task['subtasks'] && subtasksState(task['subtasks'])"
              spaced="sm"
            />

            <q-list separator dense>
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
                <q-item-label> ~ {{ subtask['title'] }}</q-item-label>
              </q-item>
            </q-list>
          </q-item-section>
          <q-separator size="5px"></q-separator>
        </q-item-section>
        <q-popup-proxy
          :ref="`taskHoldUncompleted-${index}`"
          cover
          :breakpoint="10000"
          transition-show="scale"
          transition-hide="scale"
        >
          <q-card>
            {{ index }}
            <q-card-section class="text-center">
              <q-btn color="primary" icon="visibility" @click="openTask(task)"
                >View</q-btn
              >
            </q-card-section>
            <q-card-section class="text-center">
              <q-btn color="secondary" icon="edit" @click="openTask(task, true)"
                >Edit</q-btn
              >
            </q-card-section>
            <q-card-section class="text-center">
              <q-btn
                :icon="task['progress'] ? 'close' : 'check'"
                :color="task['progress'] ? 'red' : 'positive'"
                @click="changeProgress(task)"
                >{{ task['progress'] ? 'Undone' : 'Done' }}</q-btn
              >
            </q-card-section>
            <q-card-section class="text-center border">
              <q-separator></q-separator>
              <q-btn
                v-if="task['priority'] != 1"
                flat
                dense
                class="full-width"
                icon="expand_less"
                @click="changePriority(task, -1)"
              ></q-btn>
              Priority
              <q-btn
                v-if="task['priority'] != 3"
                flat
                dense
                class="full-width"
                icon="expand_more"
                @click="changePriority(task, 1)"
              ></q-btn>
              <q-separator></q-separator>
            </q-card-section>
          </q-card>
        </q-popup-proxy>
      </q-item>
    </q-list>
    <q-separator v-if="filtering.progress == 'all'"></q-separator>
    <p
      v-if="
        Object.keys(freeTasks).length &&
        (filtering.progress == 'all' || filtering.progress == 'done')
      "
      class="text-center text-body1"
    >
      Completed tasks
    </p>
    <q-separator
      v-if="filtering.progress == 'all' || filtering.progress == 'done'"
    ></q-separator>
    <q-list
      v-if="filtering.progress == 'all' || filtering.progress == 'done'"
      separator
      bordered
    >
      <q-item
        v-for="(task, index) of freeTasks"
        v-show="task['progress']"
        :key="index"
        v-touch-hold:400:12:15.mouse="(event) => holdCompleted(event, index)"
        :class="task['progress'] ? 'bg-green-11' : ''"
        clickable
        :to="`/free-tasks/${task['id']}`"
      >
        <q-item-section>
          <q-item-section class="text-weight-bolder">{{
            task['title']
          }}</q-item-section>
        </q-item-section>
        <q-popup-proxy
          :ref="`taskHoldCompleted-${index}`"
          cover
          :breakpoint="10000"
          transition-show="scale"
          transition-hide="scale"
        >
          <q-card>
            {{ index }}
            <q-card-section class="text-center">
              <q-btn color="primary" icon="visibility" @click="openTask(task)"
                >View</q-btn
              >
            </q-card-section>
            <q-card-section class="text-center">
              <q-btn color="secondary" icon="edit" @click="openTask(task, true)"
                >Edit</q-btn
              >
            </q-card-section>
            <q-card-section class="text-center">
              <q-btn
                :icon="task['progress'] ? 'close' : 'check'"
                :color="task['progress'] ? 'red' : 'positive'"
                @click="changeProgress(task)"
                >{{ task['progress'] ? 'Undone' : 'Done' }}</q-btn
              >
            </q-card-section>
            <q-card-section class="text-center border">
              <q-separator></q-separator>
              <q-btn
                v-if="task['priority'] != 1"
                flat
                dense
                class="full-width"
                icon="expand_less"
                @click="changePriority(task, -1)"
              ></q-btn>
              Priority
              <q-btn
                v-if="task['priority'] != 3"
                flat
                dense
                class="full-width"
                icon="expand_more"
                @click="changePriority(task, 1)"
              ></q-btn>
              <q-separator></q-separator>
            </q-card-section>
          </q-card>
        </q-popup-proxy>
      </q-item>
    </q-list>
    <div class="text-center q-my-md">
      <p v-if="!Object.keys(freeTasks).length">You have not free-tasks</p>
      <q-btn color="secondary" @click="addFreeTask()">Add free-task</q-btn>
    </div>
  </q-page>
</template>

<script>
import { date } from 'quasar'
import { getDatabase, ref, update } from 'firebase/database'
import AddFreeTaskForm from 'src/components/AddFreeTaskForm.vue'
import Search from 'src/components/Search.vue'
const db = getDatabase()

export default {
  data() {
    return {
      sorting: {
        title: 'none',
        priority: 'asc'
      },
      filtering: {
        progress: 'all',
        priority: 'all'
      }
    }
  },
  computed: {
    freeTasks() {
      return this.$store.getters['users/freeTasks']
    }
  },
  methods: {
    addFreeTask() {
      this.$q.dialog({
        component: AddFreeTaskForm
      })
    },
    openTask(task, edit) {
      if (!edit) {
        this.$router.push(`/free-tasks/${task.id}`)
      } else {
        this.$router.push(`/free-tasks/${task.id}?edit=true`)
      }
    },

    changeProgress(task) {
      update(
        ref(
          db,
          `${this.$store.getters['users/userId']}/freeTasks/id-${task.id}`
        ),
        { progress: !task.progress }
      )
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

    holdUncompleted(event, index) {
      this.$refs[`taskHoldUncompleted-${index}`].show()
    },
    holdCompleted(event, index) {
      this.$refs[`taskHoldCompleted-${index}`].show()
    },
    changePriority(task, modifier) {
      const modifiedPriority =
        Number(task['priority'] ? task['priority'] : 3) + modifier
      if (modifiedPriority > 0 && modifiedPriority < 4) {
        update(
          ref(
            db,
            `${this.$store.getters['users/userId']}/freeTasks/id-${task.id}`
          ),
          { priority: modifiedPriority }
        )
      }
    },
    sortByTitle() {
      this.sorting.priority = 'none'
      this.sorting.title = this.sorting.title == 'asc' ? 'desc' : 'asc'
      this.$store.dispatch('users/sortFreeTasksByTitle', this.sorting.title)
    },
    sortByPriority() {
      this.sorting.title = 'none'
      this.sorting.priority = this.sorting.priority == 'asc' ? 'desc' : 'asc'
      this.$store.dispatch(
        'users/sortFreeTasksByPriority',
        this.sorting.priority
      )
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

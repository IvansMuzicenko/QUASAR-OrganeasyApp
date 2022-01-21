<template>
  <q-page>
    <q-card class="q-py-sm">
      <p class="text-center text-h6 full-width no-margin">Free Tasks</p>
      <q-card-section class="flex justify-between no-padding">
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
          />
          <q-btn
            icon="tune"
            :color="
              filtering.priority != 'all' || filtering.progress != 'all'
                ? 'green'
                : ''
            "
            class="zindex-high"
            flat
          >
            <q-popup-proxy>
              <q-card>
                <q-card-section class="text-subtitle1 text-center">
                  <q-icon name="filter_alt" />
                  Filter
                </q-card-section>
                <q-card-section class="no-padding">
                  <q-card-section>
                    Progress:
                    <q-radio
                      v-model="filtering.progress"
                      val="all"
                      label="All"
                      class="full-width"
                    />
                    <q-radio
                      v-model="filtering.progress"
                      val="done"
                      label="Done"
                      class="full-width"
                    />
                    <q-radio
                      v-model="filtering.progress"
                      val="undone"
                      label="Undone"
                      class="full-width"
                    />
                  </q-card-section>
                  <q-separator />
                  <q-card-section>
                    Priority:
                    <q-radio
                      v-model="filtering.priority"
                      val="all"
                      label="All"
                      class="full-width"
                    />
                    <q-radio
                      v-model="filtering.priority"
                      val="1"
                      label="High"
                      class="full-width"
                    />
                    <q-radio
                      v-model="filtering.priority"
                      val="2"
                      label="Medium"
                      class="full-width"
                    />
                    <q-radio
                      v-model="filtering.priority"
                      val="3"
                      label="Low"
                      class="full-width"
                    />
                  </q-card-section>
                </q-card-section>

                <q-separator />

                <q-card-section class="text-subtitle1 text-center">
                  <q-icon name="sort" />
                  Sort
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
                  <q-btn
                    :icon="
                      sorting.dateModified == 'none'
                        ? 'last_page'
                        : sorting.dateModified == 'asc'
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
        </q-card-section>
      </q-card-section>
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
        v-for="(task, index) of freeTasks.filter(
          (el) =>
            !el['progress'] &&
            (filtering.priority == 'all' ||
              filtering.priority == el['priority'])
        )"
        :key="index"
        v-touch-hold:400:12:15.mouse="(event) => taskHold(event, task['id'])"
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
        />
        <q-item-section>
          <q-item-section class="q-px-md">
            <q-item-section class="text-weight-bolder">
              {{ task['title'] }}
            </q-item-section>
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
                <q-item-label>~ {{ subtask['title'] }}</q-item-label>
              </q-item>
            </q-list>
          </q-item-section>
          <q-separator size="5px" />
        </q-item-section>
      </q-item>
    </q-list>

    <q-separator v-if="filtering.progress == 'all'" />

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
    />
    <q-list
      v-if="filtering.progress == 'all' || filtering.progress == 'done'"
      separator
      bordered
    >
      <q-item
        v-for="(task, index) of freeTasks.filter((el) => el['progress'])"
        :key="index"
        v-touch-hold:400:12:15.mouse="(event) => taskHold(event, task['id'])"
        :class="task['progress'] ? 'bg-green-11' : ''"
        clickable
        :to="`/free-tasks/${task['id']}`"
      >
        <q-item-section>
          <q-item-section class="text-weight-bolder">
            {{ task['title'] }}
          </q-item-section>
        </q-item-section>
      </q-item>
      <q-popup-proxy
        v-if="holdedTask"
        :ref="`taskHold`"
        cover
        :breakpoint="10000"
        transition-show="scale"
        transition-hide="scale"
      >
        <q-card>
          <q-card-section class="text-center text-subtitle1">
            <p class="no-margin">Free Task</p>
            <p v-if="holdedTask['title']" class="no-margin">
              {{
                `${holdedTask['title'].slice(0, 10)}${
                  holdedTask['title'].length > 10 ? '...' : ''
                }`
              }}
            </p>
          </q-card-section>
          <q-card-section class="text-center">
            <q-btn
              color="primary"
              icon="visibility"
              :to="`/free-tasks/${holdedTask['id']}`"
            >
              View
            </q-btn>
          </q-card-section>
          <q-card-section class="text-center">
            <q-btn
              color="secondary"
              icon="edit"
              :to="`/free-tasks/${holdedTask['id']}?edit=true`"
            >
              Edit
            </q-btn>
          </q-card-section>
          <q-card-section class="text-center">
            <q-btn
              :icon="holdedTask['progress'] ? 'close' : 'check'"
              :color="holdedTask['progress'] ? 'red' : 'positive'"
              @click="changeProgress(holdedTask)"
            >
              {{ holdedTask['progress'] ? 'Undone' : 'Done' }}
            </q-btn>
          </q-card-section>
          <q-card-section
            v-if="holdedTask['continuous'] && !holdedTask['continuousStarted']"
            class="text-center"
          >
            <q-btn
              icon="play_arrow"
              color="green"
              @click="continuousStart(holdedTask)"
            >
              Start
            </q-btn>
          </q-card-section>
          <q-card-section
            v-if="
              holdedTask['continuous'] &&
              holdedTask['continuousStarted'] &&
              !holdedTask['continuousEnded']
            "
            class="text-center"
          >
            <q-btn icon="stop" color="red" @click="continuousStop(holdedTask)">
              Stop
            </q-btn>
          </q-card-section>
          <q-card-section class="text-center border">
            <q-separator />
            <q-btn
              v-if="holdedTask['priority'] != 1"
              flat
              dense
              class="full-width"
              icon="expand_less"
              @click="changePriority(holdedTask, -1)"
            />
            Priority
            <q-btn
              v-if="holdedTask['priority'] != 3"
              flat
              dense
              class="full-width"
              icon="expand_more"
              @click="changePriority(holdedTask, 1)"
            />
            <q-separator />
          </q-card-section>
        </q-card>
      </q-popup-proxy>
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
      holdedTaskId: '',
      sorting: {
        title: 'none',
        priority: 'asc',
        dateModified: 'none'
      },
      filtering: {
        progress: 'all',
        priority: 'all'
      }
    }
  },
  computed: {
    freeTasks() {
      const vuexFreeTasks = this.$store.getters['users/freeTasks']
      let freeTasks = []
      if (vuexFreeTasks) {
        for (const vuexFreeTask in vuexFreeTasks) {
          freeTasks.push(vuexFreeTasks[vuexFreeTask])
        }
        freeTasks.sort((a, b) => {
          if (this.sorting.title != 'none') {
            if (this.sorting.title == 'asc') {
              if (a.title.toLowerCase() > b.title.toLowerCase()) return 1
              if (a.title.toLowerCase() < b.title.toLowerCase()) return -1
              return 0
            } else {
              if (a.title.toLowerCase() < b.title.toLowerCase()) return 1
              if (a.title.toLowerCase() > b.title.toLowerCase()) return -1
              return 0
            }
          } else if (this.sorting.priority != 'none') {
            if (this.sorting.priority == 'asc') {
              return (
                (a.priority ? a.priority : 3) - (b.priority ? b.priority : 3)
              )
            } else {
              return (
                (b.priority ? b.priority : 3) - (a.priority ? a.priority : 3)
              )
            }
          } else if (this.sorting.dateModified != 'none') {
            if (this.sorting.dateModified == 'asc') {
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
        component: AddFreeTaskForm
      })
    },

    changeProgress(task) {
      update(
        ref(
          db,
          `${this.$store.getters['users/userId']}/freeTasks/id-${task.id}`
        ),
        {
          progress: !task.progress,
          finishedDate: !task.progress ? Date.now() : null
        }
      )
    },
    continuousStart(task) {
      update(
        ref(
          db,
          `${this.$store.getters['users/userId']}/freeTasks/id-${task.id}`
        ),
        {
          continuousStarted: Date.now()
        }
      )
    },
    continuousStop(task) {
      update(
        ref(
          db,
          `${this.$store.getters['users/userId']}/freeTasks/id-${task.id}`
        ),
        {
          continuousEnded: Date.now()
        }
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
    taskHold(event, id) {
      this.holdedTaskId = id
      this.$refs[`taskHold`].show()
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
      this.sorting.dateModified = 'none'
      this.sorting.title = this.sorting.title == 'asc' ? 'desc' : 'asc'
    },
    sortByPriority() {
      this.sorting.title = 'none'
      this.sorting.dateModified = 'none'
      this.sorting.priority = this.sorting.priority == 'asc' ? 'desc' : 'asc'
    },
    sortByDateModified() {
      this.sorting.title = 'none'
      this.sorting.priority = 'none'
      this.sorting.dateModified =
        this.sorting.dateModified == 'asc' ? 'desc' : 'asc'
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

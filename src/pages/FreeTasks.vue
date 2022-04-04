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
                <q-separator />
                <q-card-section>
                  Category:
                  <q-radio
                    v-model="filtering.category"
                    val="all"
                    label="All"
                    class="full-width"
                  />
                  <q-radio
                    v-for="(category, index) of freeTasksCategories"
                    :key="index"
                    v-model="filtering.category"
                    :val="category['id']"
                    class="full-width"
                  >
                    <q-icon
                      :name="category['icon']"
                      :color="category['color']"
                      size="xs"
                    />
                    {{ category['title'] }}
                  </q-radio>
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
              filtering.priority == el['priority']) &&
            (filtering.category == 'all' ||
              (el['category'] && filtering.category == el['category']))
        )"
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
        v-for="(task, index) of freeTasks.filter(
          (el) =>
            el['progress'] &&
            (filtering.priority == 'all' ||
              filtering.priority == el['priority']) &&
            (filtering.category == 'all' ||
              (el['category'] && filtering.category == el['category']))
        )"
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
            <edit-button :path="`/free-tasks/${holdedTask['id']}`" />
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
          <q-card-section class="text-center">
            <copy-button :task="holdedTask" type="free-task" />
          </q-card-section>
          <q-card-section
            v-if="holdedTask['continuous'] && !holdedTask['continuousStarted']"
            class="text-center"
          >
            <start-continuous-button :path="`freeTasks/id-${holdedTask.id}`" />
          </q-card-section>
          <q-card-section
            v-if="
              holdedTask['continuous'] &&
              holdedTask['continuousStarted'] &&
              !holdedTask['continuousEnded']
            "
            class="text-center"
          >
            <stop-continuous-button :path="`freeTasks/id-${holdedTask.id}`" />
          </q-card-section>
          <q-card-section class="text-center border">
            <p class="text-center no-margin">Priority</p>
            <q-btn flat dense>
              <q-icon
                name="fiber_manual_record"
                :color="
                  holdedTask.priority === 1
                    ? 'green'
                    : holdedTask.priority === 2
                    ? 'yellow'
                    : 'red-11'
                "
              />
              {{
                holdedTask['priority'] == 1
                  ? 'High'
                  : holdedTask['priority'] == 2
                  ? 'Medium'
                  : 'Low'
              }}
              <q-icon name="expand_more" />
              <q-menu anchor="bottom left" self="top left" auto-close>
                <q-list separator>
                  <q-item clickable @click="changePriority(holdedTask, 1)">
                    <div class="full-width">
                      <q-icon name="fiber_manual_record" color="green" />
                      High
                    </div>
                  </q-item>
                  <q-item clickable @click="changePriority(holdedTask, 2)">
                    <div class="full-width">
                      <q-icon name="fiber_manual_record" color="yellow" />
                      Medium
                    </div>
                  </q-item>
                  <q-item clickable @click="changePriority(holdedTask, 3)">
                    <div class="full-width">
                      <q-icon name="fiber_manual_record" color="red" />
                      Low
                    </div>
                  </q-item>
                </q-list>
              </q-menu>
            </q-btn>
          </q-card-section>
          <q-card-section class="text-center">
            <p class="text-center no-margin">Category</p>
            <q-btn flat dense>
              <q-icon
                :name="
                  holdedTask.category
                    ? findCategory(holdedTask.category)['icon']
                    : ''
                "
                :color="
                  holdedTask.category
                    ? findCategory(holdedTask.category)['color']
                    : ''
                "
              />
              {{ findCategory(holdedTask.category)['title'] || 'None' }}
              <q-icon name="expand_more" />
              <q-menu anchor="bottom left" self="top left" auto-close>
                <p class="text-center text-subtitle1 no-margin">Categories</p>
                <q-list separator>
                  <q-separator />
                  <q-item
                    clickable
                    class="full-width text-subtitle1"
                    @click="changeCategory(null, holdedTask['id'])"
                  >
                    <div>
                      <q-icon />
                      None
                    </div>
                  </q-item>
                  <q-item
                    v-for="(category, categoryIndex) of categories"
                    :key="categoryIndex"
                    clickable
                    class="full-width text-subtitle1"
                    @click="changeCategory(category.id, holdedTask['id'])"
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
                    </div>
                  </q-item>
                </q-list>
              </q-menu>
            </q-btn>
          </q-card-section>
        </q-card>
        <q-dialog ref="progressCheck" @hide="onProgressCheckHide">
          <q-card class="q-dialog-plugin">
            <q-card-section>
              You have uncompleted subtasks. Do you want to complete all
              subtasks too?
            </q-card-section>
            <q-card-actions align="right">
              <q-btn
                color="positive"
                label="Done all"
                @click="onDoneAllClick(holdedTask)"
              />
              <q-btn
                color="secondary"
                label="Done task only"
                @click="changeProgress(holdedTask, true)"
              />
              <q-btn
                color="primary"
                label="Cancel"
                @click="onProgressCheckHide"
              />
            </q-card-actions>
          </q-card>
        </q-dialog>
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

import AddFreeTask from 'src/components/common/dialogs/AddFreeTask.vue'
import AddCategory from 'src/components/common/dialogs/AddCategory.vue'
import Search from 'src/components/common/dialogs/Search.vue'

import BackButton from 'src/components/common/elements/buttons/BackButton.vue'
import EditButton from 'src/components/common/elements/buttons/EditButton.vue'
import CopyButton from 'src/components/common/elements/buttons/CopyButton.vue'

import StartContinuousButton from 'src/components/common/elements/buttons/StartContinuousButton.vue'
import StopContinuousButton from 'src/components/common/elements/buttons/StopContinuousButton.vue'

const db = getDatabase()

export default {
  components: {
    BackButton,
    EditButton,
    CopyButton,
    StartContinuousButton,
    StopContinuousButton
  },
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
        priority: 'all',
        category: 'all'
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
    categories() {
      const vuexCategories = this.$store.getters['users/categories']
      let categories = []
      for (const category in vuexCategories) {
        categories.push(vuexCategories[category])
      }
      return categories
    },
    freeTasksCategories() {
      let freeTasksCategories = []
      for (const freeTask in this.freeTasks) {
        const task = this.freeTasks[freeTask]
        if (
          task['category'] &&
          (!freeTasksCategories.length ||
            !freeTasksCategories.some(
              (element) => element['id'] == task['category']['id']
            ))
        ) {
          freeTasksCategories.push(this.findCategory(task['category']))
        }
      }
      return freeTasksCategories
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
    changeProgress(task, strictMode) {
      const subtasks = task.subtasks

      if (
        !task.progress &&
        strictMode != true &&
        subtasks &&
        subtasks.length &&
        subtasks.some(
          (el) =>
            !el['progress'] ||
            (el['subtasks'] &&
              el['subtasks'].some((subEl) => !subEl['progress']))
        )
      ) {
        this.$refs['progressCheck'].show()
      } else {
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
        this.onProgressCheckHide()
      }
    },
    onDoneAllClick(task) {
      let subtasks = []
      for (const subtask in JSON.parse(JSON.stringify(task.subtasks))) {
        subtasks.push(JSON.parse(JSON.stringify(task.subtasks))[subtask])
      }
      subtasks.forEach((subtask) => {
        subtask.progress = true
        if (subtask.subtasks && subtask.subtasks.length) {
          subtask.subtasks.forEach((subSubtask) => (subSubtask.progress = true))
        }
      })
      update(
        ref(
          db,
          `${this.$store.getters['users/userId']}/freeTasks/id-${task.id}`
        ),
        {
          progress: !task.progress,
          finishedDate: !task.progress ? Date.now() : null,
          subtasks: subtasks
        }
      )
      this.onProgressCheckHide()
    },
    onProgressCheckHide() {
      this.$refs['progressCheck'].hide()
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
      this.$refs[`taskHold`].show()
    },
    changePriority(task, priority) {
      update(
        ref(
          db,
          `${this.$store.getters['users/userId']}/freeTasks/id-${task.id}`
        ),
        { priority: priority }
      )
    },
    changeCategory(category, id) {
      update(
        ref(db, `${this.$store.getters['users/userId']}/freeTasks/id-${id}`),
        {
          category: category
        }
      )
    },
    addCategory() {
      this.$q.dialog({
        component: AddCategory
      })
    },
    findCategory(id) {
      const vuexCategories = this.$store.getters['users/categories']
      if (id) {
        return vuexCategories[`id-${id}`] || {}
      } else {
        return {}
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

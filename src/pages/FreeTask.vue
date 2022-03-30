<template>
  <q-page>
    <q-card class="flex justify-between no-padding">
      <q-btn icon="arrow_back" flat class="zindex-high" @click="routerBack()" />

      <q-btn
        v-if="!editState && task['continuous'] && !task['continuousStarted']"
        icon="play_arrow"
        color="green"
        flat
        class="zindex-high"
        @click="continuousStart"
      >
        Start
      </q-btn>
      <q-btn
        v-if="
          !editState &&
          task['continuous'] &&
          task['continuousStarted'] &&
          !task['continuousEnded']
        "
        class="zindex-high"
        icon="stop"
        color="red"
        flat
        @click="continuousStop"
      >
        Stop
      </q-btn>
      <q-btn
        v-if="!editState"
        class="zindex-high"
        :icon="task['progress'] ? 'close' : 'check'"
        :color="task['progress'] ? 'red' : 'positive'"
        flat
        @click="changeProgress"
      >
        {{ task['progress'] ? 'Undone' : 'Done' }}
      </q-btn>
      <q-btn
        v-if="!editState"
        icon="content_copy"
        color="secondary"
        flat
        class="zindex-high"
        @click="copyTask()"
      >
        Copy
      </q-btn>
      <q-btn
        v-if="!editState"
        class="zindex-high"
        icon="edit"
        color="secondary"
        flat
        @click="toggleEdit()"
      >
        Edit
      </q-btn>

      <q-btn
        v-if="editState"
        class="zindex-high"
        icon="save"
        color="positive"
        flat
        @click="callEditClick"
      >
        Save
      </q-btn>
      <q-btn
        v-if="editState"
        class="zindex-high"
        icon="delete"
        color="negative"
        flat
        @click="onDeleteClick"
      >
        Delete
      </q-btn>
    </q-card>
    <q-list v-if="!editState" separator bordered>
      <q-item>
        <q-item-section avatar class="taskInfo">Title</q-item-section>
        <q-separator vertical spaced="md" />
        {{ task.title }}
      </q-item>
      <q-item>
        <q-item-section avatar class="taskInfo">Progress</q-item-section>
        <q-separator vertical spaced="md" />
        {{ task.progress ? 'Done' : 'Undone' }}
      </q-item>
      <q-item v-if="task.progress && task.finishedDate">
        <q-item-section avatar class="taskInfo">Completion Date</q-item-section>
        <q-separator vertical spaced="md" />
        {{ formatUnix(task.finishedDate) }}
      </q-item>

      <q-item>
        <q-item-section avatar class="taskInfo">Priority</q-item-section>
        <q-separator vertical spaced="md" />
        <q-btn flat dense>
          <q-icon
            name="fiber_manual_record"
            :color="
              task.priority === 1
                ? 'green'
                : task.priority === 2
                ? 'yellow'
                : 'red-11'
            "
          />
          {{
            task['priority'] == 1
              ? 'High'
              : task['priority'] == 2
              ? 'Medium'
              : 'Low'
          }}
          <q-icon name="expand_more" />
          <q-menu anchor="bottom left" self="top left" auto-close>
            <q-list separator>
              <q-item clickable @click="changePriority(1)">
                <div class="full-width">
                  <q-icon name="fiber_manual_record" color="green" />
                  High
                </div>
              </q-item>
              <q-item clickable @click="changePriority(2)">
                <div class="full-width">
                  <q-icon name="fiber_manual_record" color="yellow" />
                  Medium
                </div>
              </q-item>
              <q-item clickable @click="changePriority(3)">
                <div class="full-width">
                  <q-icon name="fiber_manual_record" color="red" />
                  Low
                </div>
              </q-item>
            </q-list>
          </q-menu>
        </q-btn>
      </q-item>

      <q-item>
        <q-item-section avatar class="taskInfo">Category</q-item-section>
        <q-separator vertical spaced="md" />
        <q-btn flat dense>
          <q-icon
            :name="task.category ? selectedCategory['icon'] : ''"
            :color="task.category ? selectedCategory['color'] : ''"
          />
          {{ selectedCategory['title'] || 'None' }}
          <q-icon name="expand_more" />
          <q-menu anchor="bottom left" self="top left" auto-close>
            <p class="text-center text-subtitle1 no-margin">Categories</p>
            <q-list separator>
              <q-separator />
              <q-item
                clickable
                class="full-width text-subtitle1"
                @click="changeCategory(null)"
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
                @click="changeCategory(category['id'])"
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
      </q-item>

      <q-item v-if="task.continuous">
        <q-item-section avatar class="taskInfo">Action</q-item-section>
        <q-separator vertical spaced="md" />
        <q-item-section>
          <q-item-section>
            {{ task.continuous ? 'Continuous' : 'Common' }}
          </q-item-section>
          <q-separator />
          <q-item-section v-if="task.continuousStarted && task.continuousEnded">
            Spent time : {{ timeSpent }} minutes
          </q-item-section>
          <q-separator />
          <q-item-section v-if="task.continuousStarted">
            Started : {{ formatUnix(task.continuousStarted) }}
          </q-item-section>
          <q-separator />
          <q-item-section v-if="task.continuousEnded">
            Ended : {{ formatUnix(task.continuousEnded) }}
          </q-item-section>
        </q-item-section>
      </q-item>

      <q-item
        v-if="task.notes && (task.notes.text || task.notes.attachedNotes)"
      >
        <q-item-section avatar class="taskInfo">Notes</q-item-section>
        <q-separator vertical spaced="md" />
        <q-item-section>
          <q-item-section v-if="task.notes.attachedNotes">
            <p class="text-center">Attached notes:</p>
            <q-list separator bordered>
              <q-item
                v-for="note of task.notes.attachedNotes"
                :key="note"
                class="q-pl-xs"
                :to="`/notes/${note['id']}`"
              >
                <q-item-label>
                  <q-icon
                    :name="isNoteFavorite(note['id']) ? 'star' : 'star_outline'"
                    :color="isNoteFavorite(note['id']) ? 'yellow' : ''"
                    size="sm"
                  />
                  <q-icon
                    :name="
                      findCategory(note['id'])
                        ? findCategory(note['id'])['icon']
                        : ''
                    "
                    :color="
                      findCategory(note['id'])
                        ? findCategory(note['id'])['color']
                        : ''
                    "
                    size="sm"
                  />

                  {{ note['title'] }}
                </q-item-label>
              </q-item>
            </q-list>
            <q-separator spaced="sm" />
          </q-item-section>
          <q-item-section v-if="task.notes.text" class="no-margin">
            <p class="text-center">Note:</p>
            <q-card class="q-pa-sm">
              <p v-html="task.notes.text" />
            </q-card>
          </q-item-section>
        </q-item-section>
      </q-item>

      <q-item v-if="task.location && task.location.length">
        <q-item-section avatar class="taskInfo">Location</q-item-section>
        <q-separator vertical spaced="md" />
        <q-item-section>
          <q-item-section
            v-for="(location, index) of task.location"
            :key="index"
            class="q-ml-sm"
          >
            <a
              :href="`https://www.google.com/maps/search/${location[
                'address'
              ].replace(' ', '+')}`"
            >
              {{ location['description'] }}: {{ location['address'] }}
            </a>
          </q-item-section>
        </q-item-section>
      </q-item>

      <q-item v-if="task.subtasks">
        <q-item-section avatar class="taskInfo">Subtasks</q-item-section>
        <q-separator vertical spaced="md" />
        <q-item-section>
          <q-item-section
            v-for="(subtask, index) in task.subtasks"
            :key="subtask"
            class="cursor-pointer q-ml-sm"
            @click="changeSubtaskProgress(index, subtask['progress'])"
          >
            <q-separator v-if="index > 0" size="5px" spaced="sm" />
            <q-item-label :class="subtask['progress'] ? 'text-strike' : ''">
              {{ subtask['title'] }}
            </q-item-label>
            <q-separator
              v-if="subtask['subtasks'] && subtask['subtasks'].length"
              spaced="sm"
            />
            <q-list separator>
              <q-item
                v-for="(subSubtask, subIndex) of subtask['subtasks']"
                :key="subIndex"
                dense
                clickable
                @click.prevent.stop="
                  changeSubSubtaskProgress(
                    index,
                    subIndex,
                    subSubtask['progress']
                  )
                "
              >
                <q-item-label
                  :class="subSubtask['progress'] ? 'text-strike' : ''"
                >
                  ~~ {{ subSubtask['title'] }}
                </q-item-label>
              </q-item>
            </q-list>
          </q-item-section>
        </q-item-section>
      </q-item>
    </q-list>

    <free-task-form
      v-if="editState"
      ref="freeTaskForm"
      :edit-task="task"
      @editEvent="onEditClick"
      @cancelEvent="onCancelClick"
    />
    <q-dialog ref="confirmDialog" @hide="onConfirmDialogHide">
      <q-card class="q-dialog-plugin">
        <q-card-section>
          Are you sure to premanently remove '{{ task.title }}' task?
        </q-card-section>
        <q-card-actions align="right">
          <q-btn color="primary" label="Cancel" @click="onConfirmCancelClick" />
          <q-btn
            color="negative"
            label="Delete"
            @click="onConfirmDeleteClick"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog ref="progressCheck" @hide="onProgressCheckHide">
      <q-card class="q-dialog-plugin">
        <q-card-section>
          You have uncompleted subtasks. Do you want to complete all subtasks
          too?
        </q-card-section>
        <q-card-actions align="right">
          <q-btn color="positive" label="Done all" @click="onDoneAllClick" />
          <q-btn
            color="secondary"
            label="Done task only"
            @click="changeProgress(true)"
          />
          <q-btn color="primary" label="Cancel" @click="onProgressCheckHide" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { getDatabase, ref, set, update, remove } from 'firebase/database'
import { date } from 'quasar'
import FreeTaskForm from 'src/components/forms/FreeTaskForm.vue'
import AddCategory from 'src/components/common/dialogs/AddCategory.vue'
import AddFreeTask from 'src/components/common/dialogs/AddFreeTask.vue'

const db = getDatabase()

export default {
  components: {
    FreeTaskForm
  },
  emits: ['hide'],
  data() {
    return {
      task: {
        id: '',
        title: '',
        progress: false,
        finishedDate: '',
        priority: 3,
        category: null,
        continuous: false,
        continuousStarted: '',
        continuousEnded: '',

        notes: {
          text: '',
          attachedNotes: []
        },

        location: [],

        subtasks: []
      }
    }
  },
  computed: {
    path() {
      return this.$route.path
    },
    taskId() {
      return this.$route.params.id
    },
    editState() {
      return this.$route.query.edit ? true : false
    },
    timeSpent() {
      if (this.task.continuousEnded && this.task.continuousStarted) {
        const timeSpent = date.getDateDiff(
          this.task.continuousEnded,
          this.task.continuousStarted,
          'minutes'
        )
        return timeSpent
      }
      return 0
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
      if (this.task.category) {
        return vuexCategories[`id-${this.task.category}`] || {}
      } else {
        return {}
      }
    }
  },
  watch: {
    path: {
      handler: function () {
        this.updateTaskData()
      },
      immediate: true,
      flush: 'post'
    }
  },
  methods: {
    formatUnix(unix) {
      return date.formatDate(unix, 'DD-MM-YYYY HH:mm')
    },

    updateTaskData() {
      const freeTask =
        this.$store.getters['users/freeTasks'][`id-${this.taskId}`]
      if (!freeTask) {
        return this.$router.push('/free-tasks')
      }
      this.task = JSON.parse(JSON.stringify(freeTask))
    },
    isNoteFavorite(id) {
      const note = this.$store.getters['users/notes'][`id-${id}`]
      if (note) {
        return note['favorite']
      }
      return false
    },
    routerBack() {
      if (this.editState) {
        return this.$router.push(this.$route.path)
      }
      return this.$router.push('/free-tasks')
    },
    toggleEdit() {
      this.$router.push(this.path + '?edit=true')
    },
    callEditClick() {
      this.$refs.freeTaskForm.onEditClick()
    },
    copyTask() {
      this.$q.dialog({
        component: AddFreeTask,
        componentProps: {
          copy: this.task
        }
      })
    },
    changePriority(priority) {
      update(
        ref(
          db,
          `${this.$store.getters['users/userId']}/freeTasks/id-${this.taskId}`
        ),
        { priority: priority }
      )
      this.updateTaskData()
    },
    changeCategory(category) {
      update(
        ref(
          db,
          `${this.$store.getters['users/userId']}/freeTasks/id-${this.taskId}`
        ),
        { category: category }
      )
      this.updateTaskData()
    },
    addCategory() {
      this.$q.dialog({
        component: AddCategory
      })
    },
    findCategory(id) {
      const note = this.$store.getters['users/notes'][`id-${id}`]
      if (note) {
        const categoryId = note['category']
        if (categoryId) {
          const vuexCategories = this.$store.getters['users/categories']
          return vuexCategories[`id-${categoryId}`] || {}
        }
      }
      return {}
    },
    changeSubtaskProgress(index, progress) {
      update(
        ref(
          db,
          `${this.$store.getters['users/userId']}/freeTasks/id-${this.taskId}/subtasks/${index}`
        ),
        { progress: !progress }
      )
      this.updateTaskData()
    },
    changeSubSubtaskProgress(index, subIndex, progress) {
      update(
        ref(
          db,
          `${this.$store.getters['users/userId']}/freeTasks/id-${this.taskId}/subtasks/${index}/subtasks/${subIndex}`
        ),
        { progress: !progress }
      )
      this.updateTaskData()
    },
    onEditClick(form) {
      const updateTodo = {
        id: form.id,
        title: form.todoTitle,
        priority: form.priority,
        progress: form.progress,
        notes:
          form.toggleNotes &&
          form.notes &&
          (form.notes.text || form.notes.attachedNotes.length)
            ? form.notes
            : null,
        location: form.toggleLocation ? form.eventLocation : null,
        category: form.category || null,
        continuous: form.continuousState,
        continuousStarted:
          form.continuousState && this.task.continuousStarted
            ? this.task.continuousStarted
            : null,
        continuousEnded:
          form.continuousState && this.task.continuousEnded
            ? this.task.continuousEnded
            : null,
        subtasks: form.toggleSubtasks ? form.subtasks : null,
        dateModified: Date.now(),
        finishedDate:
          form.progress &&
          (form.progress != this.task.progress || this.task.finishedDate)
            ? this.task.finishedDate
              ? this.task.finishedDate
              : Date.now()
            : null
      }
      update(
        ref(
          db,
          `${this.$store.getters['users/userId']}/freeTasks/id-${this.taskId}/`
        ),
        updateTodo
      )
      this.updateTaskData()
      this.$router.push(this.path)

      this.$q.notify({
        position: 'top',
        message: 'Task edited',
        color: 'blue',
        timeout: 1000
      })
    },
    continuousStart() {
      update(
        ref(
          db,
          `${this.$store.getters['users/userId']}/freeTasks/id-${this.taskId}`
        ),
        {
          continuousStarted: Date.now()
        }
      )
      this.updateTaskData()
    },
    continuousStop() {
      update(
        ref(
          db,
          `${this.$store.getters['users/userId']}/freeTasks/id-${this.taskId}`
        ),
        {
          continuousEnded: Date.now()
        }
      )
      this.updateTaskData()
    },
    changeProgress(strictMode) {
      const subtasks = this.task.subtasks

      if (
        !this.task.progress &&
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
            `${this.$store.getters['users/userId']}/freeTasks/id-${this.taskId}`
          ),
          {
            progress: !this.task.progress,
            finishedDate: !this.task.progress ? Date.now() : null
          }
        )
        this.onProgressCheckHide()
        this.updateTaskData()
      }
    },
    onDoneAllClick() {
      const subtasks = this.task.subtasks
      subtasks.forEach((subtask) => {
        subtask.progress = true
        if (subtask.subtasks && subtask.subtasks.length) {
          subtask.subtasks.forEach((subSubtask) => (subSubtask.progress = true))
        }
      })
      update(
        ref(
          db,
          `${this.$store.getters['users/userId']}/freeTasks/id-${this.taskId}`
        ),
        {
          progress: !this.task.progress,
          finishedDate: !this.task.progress ? Date.now() : null,
          subtasks: subtasks
        }
      )
      this.onProgressCheckHide()
      this.updateTaskData()
    },
    onProgressCheckHide() {
      this.$refs['progressCheck'].hide()
    },
    onDeleteClick() {
      this.$refs.confirmDialog.show()
    },
    onCancelClick() {
      this.$router.push(this.path)
    },
    onConfirmDeleteClick() {
      remove(
        ref(
          db,
          `${this.$store.getters['users/userId']}/freeTasks/id-${this.taskId}`
        )
      )
      this.$router.push('/')

      this.$q.notify({
        position: 'top',
        message: 'Task removed',
        color: 'red',
        timeout: 1000
      })
    },
    onConfirmDialogHide() {
      this.$emit('hide')
    },
    onConfirmCancelClick() {
      this.$refs.confirmDialog.hide()
    }
  }
}
</script>

<style>
.taskInfo {
  width: 5rem;
  overflow-wrap: anywhere;
  padding: 0;
}
</style>

<template>
  <q-card :class="editTask ? '' : 'q-dialog-plugin'">
    <p v-if="!editTask" class="text-center text-subtitle1 no-margin">
      New free-task
      <q-btn
        icon="close"
        class="absolute-top-right"
        flat
        dense
        @click="onCancelClick"
      />
    </p>
    <q-card-actions align="center">
      <save-button v-if="editTask" :error="error" @save-event="onSaveClick" />
      <q-btn
        v-else
        color="positive"
        label="Add"
        :disable="error"
        @click="onOKClick"
      />
    </q-card-actions>
    <q-card-section class="no-padding">
      <q-input
        v-model="form.todoTitle"
        bottom-slots
        label="Title"
        :rules="[(val) => val !== '' || 'Title is required']"
        :dense="false"
        class="q-px-md"
      />
    </q-card-section>

    <q-card-section>
      <q-item v-ripple tag="label" class="no-padding">
        <q-item-section avatar>
          <q-toggle v-model="form.progress" />
        </q-item-section>
        <q-item-section>
          <q-item-label>Progress</q-item-label>
          <q-item-label caption>
            {{ form.progress ? 'done' : 'undone' }}
          </q-item-label>
        </q-item-section>
      </q-item>
    </q-card-section>

    <q-card-section>
      Priority:
      <priority-select
        :item-priority="form.priority || 3"
        @priority-selected="
          (selectedPriority) => (form.priority = selectedPriority)
        "
      />
    </q-card-section>

    <q-card-section>
      <q-toggle v-model="form.continuousState" label="Continuous action" />
    </q-card-section>

    <q-card-section>
      Category:
      <category-select
        :item-category="form.category || ''"
        :select-on-save="true"
        @category-selected="
          (selectedCategory) => (form.category = selectedCategory)
        "
      />
    </q-card-section>

    <q-card-section>
      <q-checkbox
        v-if="!form.toggleNotes"
        v-model="form.toggleNotes"
        label="Add notes"
      />
      <q-card-section v-if="form.toggleNotes" class="no-padding">
        <p>
          Notes
          <q-icon
            class="cursor-pointer float-right"
            color="red"
            name="close"
            size="md"
            @click="form.toggleNotes = !form.toggleNotes"
          />
        </p>

        <q-select
          v-if="notesList.length"
          v-model="form.notes.attachedNotes"
          outlined
          multiple
          use-chips
          stack-label
          label="Attach notes"
          :options="notesList"
          :option-label="
            (opt) => (isNoteFavorite(opt['id']) ? `* ${opt.title}` : opt.title)
          "
          emit-value
          map-options
        >
          <template #selected-item="scope">
            <q-chip
              removable
              dense
              :tabindex="scope.tabindex"
              class="q-ma-none"
              @remove="scope.removeAtIndex(scope.index)"
            >
              <q-icon
                v-if="isNoteFavorite(scope.opt['id'])"
                name="star"
                color="yellow"
                size="xs"
              />
              <q-icon
                v-if="findNoteCategory(scope.opt['id'], 'icon')"
                :name="findNoteCategory(scope.opt['id'], 'icon')"
                :color="findNoteCategory(scope.opt['id'], 'color')"
                size="xs"
              />
              {{ scope.opt.title }}
            </q-chip>
          </template>
          <template #option="scope">
            <q-item v-bind="scope.itemProps">
              <q-item-section>
                <q-item-label>
                  <q-icon
                    v-if="isNoteFavorite(scope.opt['id'])"
                    name="star"
                    color="yellow"
                    size="sm"
                    class="q-pa-none q-ma-none q-pr-xs"
                  />
                  <q-icon
                    v-else
                    name="star_outline"
                    size="sm"
                    class="q-pa-none q-ma-none q-pr-xs"
                  />
                  <q-icon
                    :name="findNoteCategory(scope.opt['id'], 'icon')"
                    :color="findNoteCategory(scope.opt['id'], 'color')"
                    size="sm"
                    class="q-pa-none q-ma-none q-pr-xs"
                  />
                  {{ scope.opt.title }}
                </q-item-label>
              </q-item-section>
            </q-item>
          </template>
        </q-select>
        <p v-else class="text-secondary">You have not notes to attach</p>

        <editor v-model="form.notes.text" full-width />
      </q-card-section>
    </q-card-section>

    <q-card-section>
      <q-checkbox
        v-if="!form.toggleLocation"
        v-model="form.toggleLocation"
        label="Add locations"
      />
      <q-card-section v-if="form.toggleLocation" class="no-padding">
        <p class="q-mb-none">
          Locations
          <q-btn flat @click="addLocation">+</q-btn>
          <q-icon
            class="col-1 cursor-pointer float-right"
            color="red"
            name="close"
            size="md"
            @click="form.toggleLocation = !form.toggleLocation"
          />
        </p>
        <q-card-section
          v-for="(location, index) in form.eventLocation"
          :key="index"
          class="row"
        >
          <q-input
            v-model="form.eventLocation[index]['address']"
            dense
            outlined
            label="Address"
            class="col"
          />
          <q-input
            v-model="form.eventLocation[index]['description']"
            dense
            outlined
            label="Description"
            class="col"
          />
          <q-icon
            class="cursor-pointer"
            name="close"
            size="xs"
            @click="deleteLocation(index)"
          />
        </q-card-section>
      </q-card-section>
    </q-card-section>

    <q-card-section>
      <q-checkbox
        v-if="!form.toggleSubtasks"
        v-model="form.toggleSubtasks"
        label="Add subtasks"
      />
      <q-card-section v-if="form.toggleSubtasks" class="no-padding">
        <p>
          Subtasks
          <q-icon
            class="cursor-pointer float-right"
            color="red"
            name="close"
            size="md"
            @click="form.toggleSubtasks = !form.toggleSubtasks"
          />
        </p>
        <q-card-section class="no-padding">
          <q-input
            v-model="subtaskInput"
            bottom-slots
            label="Subtask"
            :dense="false"
          >
            <template #append>
              <q-btn
                round
                dense
                flat
                icon="add"
                @click="addSubtask(subtaskInput)"
              />
            </template>
          </q-input>

          <q-list v-if="form.subtasks.length" bordered separator>
            <q-item
              v-for="(subtask, index) in form.subtasks"
              :key="subtask"
              class="q-pa-none"
            >
              <q-btn
                dense
                flat
                :color="subtask['progress'] ? 'negative' : 'positive'"
                :icon="subtask['progress'] ? 'close' : 'check'"
                @click="onSubtaskClick(index, subtask['progress'])"
              />
              <q-item-section>
                <div
                  v-if="subtaskEdit != index"
                  :class="subtask['progress'] ? 'text-strike' : ''"
                  class="vertical-middle"
                >
                  <span>
                    {{ subtask['title'] }}
                  </span>

                  <span class="float-right">
                    <q-btn
                      v-if="subtaskEdit != index"
                      icon="edit"
                      flat
                      class="q-px-sm"
                      @click="editSubtask(index)"
                    />
                    <q-btn
                      icon="delete"
                      color="red"
                      flat
                      class="q-px-sm"
                      @click="deleteSubtask(index)"
                    />
                  </span>
                </div>
                <q-input v-if="subtaskEdit == index" v-model="subtask['title']">
                  <template #append>
                    <q-btn
                      v-if="subtaskEdit == index"
                      icon="save"
                      flat
                      class="q-px-sm"
                      @click="editSubtask(index)"
                    />
                    <q-btn
                      icon="delete"
                      color="red"
                      flat
                      class="q-px-sm"
                      @click="deleteSubtask(index)"
                    />
                  </template>
                </q-input>

                <q-separator
                  v-if="subtask['subtasks'] && subtask['subtasks'].length"
                />
                <q-separator
                  v-if="subtask['subtasks'] && subtask['subtasks'].length"
                />
                <q-list separator bordered>
                  <q-item
                    v-for="(subSubtask, subIndex) of subtask['subtasks']"
                    :key="subIndex"
                    dense
                    class="q-px-none"
                  >
                    <q-btn
                      dense
                      flat
                      :color="subSubtask['progress'] ? 'negative' : 'positive'"
                      :icon="subSubtask['progress'] ? 'close' : 'check'"
                      @click="
                        onSubSubtaskClick(
                          index,
                          subIndex,
                          subSubtask['progress']
                        )
                      "
                    />
                    <q-item-section>
                      <span
                        v-if="subtaskEdit != index"
                        :class="subSubtask['progress'] ? 'text-strike' : ''"
                      >
                        {{ subSubtask['title'] }}
                      </span>
                      <q-input
                        v-if="subtaskEdit == index"
                        v-model="subSubtask['title']"
                        dense
                      />
                    </q-item-section>
                    <q-btn
                      icon="delete"
                      color="red"
                      flat
                      round
                      @click="deleteSubSubtask(index, subIndex)"
                    />
                  </q-item>
                </q-list>
                <q-input
                  v-if="subtaskEdit == index"
                  v-model="subSubtaskInput"
                  dense
                  label="Add subSubtask"
                >
                  <template #append>
                    <q-btn
                      round
                      dense
                      flat
                      icon="add"
                      @click="addSubSubtask(subSubtaskInput, index)"
                    />
                  </template>
                </q-input>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>
      </q-card-section>
    </q-card-section>

    <q-card-section v-if="errorMessages.length > 0">
      <p
        v-for="errorMessage in errorMessages"
        :key="errorMessage"
        class="text-negative"
      >
        {{ errorMessage }}
      </p>
    </q-card-section>

    <q-card-actions align="right">
      <save-button v-if="editTask" :error="error" @save-event="onSaveClick" />
      <q-btn
        v-else
        color="positive"
        label="Add"
        :disable="error"
        @click="onOKClick"
      />
      <q-btn color="secondary" label="Cancel" @click="onCancelClick" />
    </q-card-actions>
  </q-card>
</template>

<script>
import Editor from 'src/components/common/form/Editor.vue'

import SaveButton from 'src/components/common/elements/buttons/SaveButton.vue'
import CategorySelect from 'src/components/common/groups/CategorySelect.vue'
import PrioritySelect from '../common/groups/PrioritySelect.vue'

export default {
  components: { Editor, SaveButton, CategorySelect, PrioritySelect },
  props: {
    editTask: {
      type: Object,
      required: false,
      default: null
    },
    copy: {
      type: Object,
      required: false,
      default: null
    }
  },
  emits: ['confirmEvent', 'cancelEvent', 'saveEvent', 'error'],

  data() {
    return {
      form: {
        id: '',
        todoTitle: '',
        progress: false,
        priority: 3,
        continuousState: false,
        category: null,

        toggleNotes: false,
        notes: {
          text: '',
          attachedNotes: []
        },

        toggleLocation: false,
        eventLocation: [{ address: '', description: '' }],

        toggleSubtasks: false,
        subtasks: []
      },

      subtaskInput: '',
      subSubtaskInput: '',
      errorMessages: [],
      subtaskEdit: null
    }
  },
  computed: {
    error() {
      if (this.form.todoTitle === '') {
        this.addErrorMessage('Title must not be empty')
        return true
      } else {
        this.clearErrorMessages()
        return false
      }
    },
    notesList() {
      const notes = this.$store.getters['users/notes']
      let notesArray = []
      if (Object.keys(notes).length) {
        for (const note in notes) {
          if (notes[note]['favorite']) {
            notesArray.unshift({
              title: notes[note]['title'],
              id: notes[note]['id']
            })
          } else {
            notesArray.push({
              title: notes[note]['title'],
              id: notes[note]['id']
            })
          }
        }
      }
      return notesArray
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
      if (this.editTask) {
        this.form.id = this.editTask.id
        this.form.todoTitle = this.editTask.title
        this.form.progress = this.editTask.progress
        this.form.priority = this.editTask.priority ? this.editTask.priority : 3
        this.form.continuousState = this.editTask.continuous
        this.form.category = this.editTask.category

        this.form.toggleNotes = this.editTask.notes ? true : false
        this.form.notes.attachedNotes =
          this.editTask.notes && this.editTask.notes.attachedNotes
            ? this.editTask.notes.attachedNotes
            : []
        this.form.notes.text =
          this.editTask.notes && this.editTask.notes.text
            ? this.editTask.notes.text
            : ''
        this.form.toggleLocation = this.editTask.location ? true : false
        this.form.eventLocation = this.editTask.location
          ? this.editTask.location
          : []
        this.form.toggleSubtasks = this.editTask.subtasks ? true : false
        this.form.subtasks = this.editTask.subtasks
          ? this.editTask.subtasks
          : []
      }
      if (this.copy) {
        this.form.todoTitle = this.copy.title
        this.form.progress = this.copy.progress
        this.form.priority = this.copy.priority ? this.copy.priority : 3
        this.form.continuousState = this.copy.continuous
        this.form.category = this.copy.category

        this.form.toggleNotes = this.copy.notes ? true : false
        this.form.notes.attachedNotes =
          this.copy.notes && this.copy.notes.attachedNotes
            ? this.copy.notes.attachedNotes
            : []
        this.form.notes.text =
          this.copy.notes && this.copy.notes.text ? this.copy.notes.text : ''
        this.form.toggleLocation = this.copy.location ? true : false
        this.form.eventLocation = this.copy.location ? this.copy.location : []
        this.form.toggleSubtasks = this.copy.subtasks ? true : false
        this.form.subtasks = this.copy.subtasks ? this.copy.subtasks : []
      }
    },

    onSubtaskClick(index, progress) {
      this.form.subtasks[index]['progress'] = !progress
    },
    onSubSubtaskClick(index, subIndex, progress) {
      this.form.subtasks[index]['subtasks'][subIndex]['progress'] = !progress
    },
    async onOKClick() {
      this.$emit('confirmEvent', this.form)
    },
    onCancelClick() {
      this.$emit('cancelEvent')
    },
    async onSaveClick() {
      this.$emit('saveEvent', this.form)
    },

    isNoteFavorite(id) {
      const note = this.$store.getters['users/notes'][`id-${id}`]
      if (note) {
        return note['favorite']
      }
      return false
    },
    findNoteCategory(id, type) {
      const note = this.$store.getters['users/notes'][`id-${id}`]
      if (note) {
        const categoryId = note['category']
        if (categoryId) {
          const category =
            this.$store.getters['users/categories'][`id-${categoryId}`]
          if (category) {
            if (type == 'icon') {
              return category['icon']
            } else if (type == 'color') {
              return category['color']
            }
          }
        }
      }
      return ''
    },

    addSubtask(newSubtask) {
      this.form.subtasks.push({ title: newSubtask, progress: false })
      this.subtaskInput = ''
    },
    deleteSubtask(index) {
      this.form.subtasks.splice(index, 1)
    },
    deleteSubSubtask(index, subIndex) {
      this.form.subtasks[index]['subtasks'].splice(subIndex, 1)
    },
    editSubtask(index) {
      if (this.subtaskEdit == index) {
        this.subtaskEdit = null
      } else {
        this.subtaskEdit = index
      }
      this.subSubtaskInput = ''
    },
    addSubSubtask(newSubSubtask, index) {
      if (typeof this.form.subtasks[index]['subtasks'] != 'object') {
        this.form.subtasks[index]['subtasks'] = []
      }
      this.form.subtasks[index]['subtasks'].push({
        title: newSubSubtask,
        progress: false
      })
      this.subSubtaskInput = ''
    },

    addLocation() {
      this.form.eventLocation.push({ address: '', description: '' })
    },
    deleteLocation(index) {
      this.form.eventLocation.splice(index, 1)
    },
    addErrorMessage(message) {
      if (!this.errorMessages.includes(message)) {
        this.errorMessages.push(message)
      }
    },
    clearErrorMessages() {
      this.errorMessages = []
    }
  }
}
</script>

<style></style>

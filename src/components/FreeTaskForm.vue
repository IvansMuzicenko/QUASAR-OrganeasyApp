<template>
  <q-card :class="editTask ? '' : 'q-dialog-plugin'">
    <q-card-section class="no-padding">
      <q-input
        v-model="form.todoTitle"
        bottom-slots
        label="Title"
        :rules="[(val) => val !== '' || 'Title is required']"
        :dense="false"
        class="q-px-md"
      >
      </q-input>
    </q-card-section>

    <q-card-section>
      <q-item v-ripple tag="label" class="no-padding">
        <q-item-section avatar>
          <q-toggle v-model="form.progress" />
        </q-item-section>
        <q-item-section>
          <q-item-label>Progress</q-item-label>
          <q-item-label caption>{{
            form.progress ? 'done' : 'undone'
          }}</q-item-label>
        </q-item-section>
      </q-item>
    </q-card-section>

    <q-card-section>
      <q-select
        v-model="form.priority"
        label="Priority"
        :options="priorityOptions"
        option-value="id"
        option-label="desc"
        emit-value
        map-options
      ></q-select>
    </q-card-section>

    <q-card-section>
      <q-toggle v-model="form.continuousState" label="Continuous action" />
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
          ></q-icon>
        </p>

        <q-select
          v-if="notesList.length"
          v-model="form.notes.attachedNotes"
          outlined
          multiple
          :options="notesList"
          use-chips
          stack-label
          label="Attach notes"
        />
        <q-editor
          v-model="form.notes.text"
          dense
          class="full-width"
          :toolbar="[
            [
              {
                label: $q.lang.editor.align,
                icon: $q.iconSet.editor.align,
                fixedLabel: true,
                list: 'only-icons',
                options: ['left', 'center', 'right', 'justify']
              },
              {
                label: $q.lang.editor.align,
                icon: $q.iconSet.editor.align,
                fixedLabel: true,
                options: ['left', 'center', 'right', 'justify']
              }
            ],
            [
              'bold',
              'italic',
              'strike',
              'underline',
              'subscript',
              'superscript'
            ],
            ['token', 'hr', 'link', 'custom_btn'],
            ['print', 'fullscreen'],
            [
              {
                label: $q.lang.editor.formatting,
                icon: $q.iconSet.editor.formatting,
                list: 'no-icons',
                options: ['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'code']
              },
              {
                label: $q.lang.editor.fontSize,
                icon: $q.iconSet.editor.fontSize,
                fixedLabel: true,
                fixedIcon: true,
                list: 'no-icons',
                options: [
                  'size-1',
                  'size-2',
                  'size-3',
                  'size-4',
                  'size-5',
                  'size-6',
                  'size-7'
                ]
              },
              {
                label: $q.lang.editor.defaultFont,
                icon: $q.iconSet.editor.font,
                fixedIcon: true,
                list: 'no-icons',
                options: [
                  'default_font',
                  'arial',
                  'arial_black',
                  'comic_sans',
                  'courier_new',
                  'impact',
                  'lucida_grande',
                  'times_new_roman',
                  'verdana'
                ]
              },
              'removeFormat'
            ],
            ['quote', 'unordered', 'ordered', 'outdent', 'indent'],

            ['undo', 'redo']
          ]"
          :fonts="{
            arial: 'Arial',
            arial_black: 'Arial Black',
            comic_sans: 'Comic Sans MS',
            courier_new: 'Courier New',
            impact: 'Impact',
            lucida_grande: 'Lucida Grande',
            times_new_roman: 'Times New Roman',
            verdana: 'Verdana'
          }"
        />
      </q-card-section>
    </q-card-section>

    <q-card-section>
      <q-checkbox
        v-if="!form.toggleSubtasks"
        v-model="form.toggleSubtasks"
        label="Add subtasks"
      />
      <q-card-section v-if="form.toggleSubtasks" class="row no-padding">
        <q-card-section class="col no-padding">
          <q-input
            v-model="form.subtaskInput"
            bottom-slots
            label="Subtasks"
            :dense="false"
          >
            <template #append>
              <q-btn
                round
                dense
                flat
                icon="add"
                @click="addSubtask(form.subtaskInput)"
              />
            </template>
          </q-input>

          <q-list v-if="form.subtasks.length" bordered separator>
            <q-item v-for="(subtask, index) in form.subtasks" :key="subtask">
              <q-item-section v-if="editTask && editTask.subtasks" avatar>
                <q-btn
                  dense
                  flat
                  :color="subtask['progress'] ? 'negative' : 'positive'"
                  :icon="subtask['progress'] ? 'close' : 'check'"
                  @click="onSubtaskClick(index, subtask['progress'])"
                ></q-btn>
              </q-item-section>
              <q-item-section
                :class="subtask['progress'] ? 'text-strike' : ''"
                >{{ subtask['title'] }}</q-item-section
              >
              <q-item-section side>
                <q-btn
                  icon="cancel"
                  flat
                  round
                  @click="deleteSubtask(index)"
                ></q-btn
              ></q-item-section>
            </q-item>
          </q-list>
        </q-card-section>

        <q-icon
          class="col-1 cursor-pointer float-right"
          color="red"
          name="close"
          size="md"
          @click="form.toggleSubtasks = !form.toggleSubtasks"
        ></q-icon>
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
      <q-btn
        v-if="editTask"
        icon="save"
        color="positive"
        label="Save"
        :disable="error"
        @click="onEditClick"
      />
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
import { date } from 'quasar'
import { getDatabase, ref, set } from 'firebase/database'

export default {
  props: {
    editTask: {
      type: Object,
      required: false,
      default: null
    }
  },
  emits: ['OKEvent', 'cancelEvent', 'editEvent', 'subtaskEvent'],

  data() {
    return {
      form: {
        id: '',
        todoTitle: '',
        progress: false,
        priority: '3',
        continuousState: false,

        toggleNotes: false,
        notes: {
          text: '',
          attachedNotes: []
        },

        toggleSubtasks: false,
        subtasks: [],
        subtaskInput: ''
      },

      errorMessages: [],
      priorityOptions: [
        {
          id: '1',
          desc: 'High'
        },
        {
          id: '2',
          desc: 'Medium'
        },
        {
          id: '3',
          desc: 'Low'
        }
      ]
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
          notesArray.push(notes[note]['title'])
        }
      }
      return notesArray
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
        this.form.priority = this.editTask.priority
          ? this.editTask.priority
          : '3'
        this.form.continuousState = this.editTask.continuous

        this.form.toggleNotes = this.editTask.notes ? true : false
        this.form.notes.attachedNotes =
          this.editTask.notes && this.editTask.notes.attachedNotes
            ? this.editTask.notes.attachedNotes
            : []
        this.form.notes.text =
          this.editTask.notes && this.editTask.notes.text
            ? this.editTask.notes.text
            : ''

        this.form.toggleSubtasks = this.editTask.subtasks ? true : false
        this.form.subtasks = this.editTask.subtasks
          ? this.editTask.subtasks
          : []
      }
    },

    async onSubtaskClick(index, progress) {
      await this.$emit('subtaskEvent', this.form.id, index, progress)
      this.updateData()
    },
    async onOKClick() {
      this.$emit('OKEvent', this.form)
    },
    onCancelClick() {
      this.$emit('cancelEvent')
    },
    async onEditClick() {
      this.$emit('editEvent', this.form)
    },

    addSubtask(newSubtask) {
      this.form.subtasks.push({ title: newSubtask, progress: false })
      this.form.subtaskInput = ''
    },
    deleteSubtask(index) {
      this.form.subtasks.splice(index, 1)
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

<template>
  <q-card class="q-dialog-plugin">
    <p v-if="!editCategory" class="text-center text-subtitle1 no-margin">
      New category
      <q-btn
        icon="close"
        class="absolute-top-right"
        flat
        dense
        @click="onCancelClick"
      />
    </p>
    <q-card-section class="text-center text-subtitle1">
      Preview:
      <q-icon :name="form.icon" :color="form.color" />
      {{ form.title }}
    </q-card-section>
    <q-card-section>
      <q-input v-model="form.title" label="Title" />
    </q-card-section>
    <q-card-section>
      Color:
      <q-btn :color="form.color" style="width: 3rem">
        <q-menu
          ref="colorPicker"
          anchor="center middle"
          self="top left"
          style="width: 200px"
        >
          <q-btn
            v-for="(color, index) of colors"
            :key="index"
            :color="color"
            :style="color == form.color ? 'border: 1px solid black' : ''"
            style="width: 40px; height: 40px"
            @click="selectColor(color)"
          >
            {{ color == form.color ? 'x' : '' }}
          </q-btn>
        </q-menu>
      </q-btn>
    </q-card-section>
    <q-card-section>
      Icon:
      <q-input v-model="iconSearch" dense label="Icon search">
        <template #append>
          <q-icon name="search" />
        </template>
      </q-input>
      <q-card-section
        class="no-padding overflow-auto"
        style="max-height: 10rem"
      >
        <q-btn
          v-for="(icon, index) of icons"
          :key="index"
          :icon="icon['name']"
          :color="form.color"
          style="width: 40px; height: 40px"
          :outline="icon['name'] == form.icon"
          :flat="icon['name'] != form.icon"
          @click="selectIcon(icon['name'])"
        />
      </q-card-section>
    </q-card-section>
    <q-card-actions align="right">
      <q-btn
        v-if="!editCategory"
        color="positive"
        label="Add"
        @click="onOKClick"
      />
      <save-button v-else @saveEvent="onSaveClick" />
      <q-btn color="secondary" label="Cancel" @click="onCancelClick" />
    </q-card-actions>
  </q-card>
</template>

<script>
import generateId from 'src/idGenerator.js'

import SaveButton from 'src/components/common/elements/buttons/SaveButton.vue'
export default {
  components: { SaveButton },
  props: {
    editCategory: {
      type: Object,
      required: false,
      default: null
    }
  },
  emits: ['OKEvent', 'cancelEvent', 'saveEvent'],
  data() {
    return {
      form: {
        id: '',
        title: '',
        icon: '',
        color: 'dark'
      },
      iconSearch: ''
    }
  },
  computed: {
    icons() {
      const vuexIcons = this.$store.getters['categories/categoryIcons']
      let icons = []
      for (const icon in vuexIcons) {
        icons.push(vuexIcons[icon])
      }
      if (this.iconSearch) {
        return icons.filter((icon) => {
          return this.iconSearch
            .toLowerCase()
            .split(' ')
            .every(
              (v) =>
                icon.name.toLowerCase().includes(v) ||
                icon.tags.find((tag) => {
                  return tag.toLowerCase().includes(v)
                })
            )
        })
      }
      return icons
    },
    colors() {
      return this.$store.getters['categories/categoryColors']
    }
  },
  mounted() {
    if (this.editCategory) {
      this.form.id = this.editCategory.id
      this.form.title = this.editCategory.title
      this.form.icon = this.editCategory.icon
      this.form.color = this.editCategory.color
    }
  },
  methods: {
    selectIcon(iconName) {
      this.form.icon = iconName
    },
    selectColor(color) {
      this.form.color = color
      this.$refs['colorPicker'].hide()
    },
    onOKClick() {
      this.form.id = generateId()
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

<style></style>

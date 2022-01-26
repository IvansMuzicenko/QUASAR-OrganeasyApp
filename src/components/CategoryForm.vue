<template>
  <q-card class="q-dialog-plugin">
    <q-card-section class="text-center text-subtitle1">
      Preview:
      <q-icon :name="form.categoryIcon" :color="form.categoryColor" />
      {{ form.categoryTitle }}
    </q-card-section>
    <q-card-section>
      <q-input v-model="form.categoryTitle" label="Title" />
    </q-card-section>
    <q-card-section>
      Color:
      <q-btn :color="form.categoryColor" style="width: 3rem">
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
            :style="
              color == form.categoryColor ? 'border: 1px solid black' : ''
            "
            style="width: 40px; height: 40px"
            @click="selectColor(color)"
          >
            {{ color == form.categoryColor ? 'x' : '' }}
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
          :color="form.categoryColor"
          style="width: 40px; height: 40px"
          :outline="icon['name'] == form.categoryIcon"
          :flat="icon['name'] != form.categoryIcon"
          @click="selectIcon(icon['name'])"
        />
      </q-card-section>
    </q-card-section>
    <q-card-actions align="right">
      <q-btn color="positive" label="Add" @click="onOKClick" />
      <q-btn color="secondary" label="Cancel" @click="onCancelClick" />
    </q-card-actions>
  </q-card>
</template>

<script>
export default {
  emits: ['OKEvent', 'cancelEvent'],
  data() {
    return {
      form: {
        id: '',
        categoryTitle: '',
        categoryIcon: '',
        categoryColor: 'dark'
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
  methods: {
    selectIcon(iconName) {
      this.form.categoryIcon = iconName
    },
    selectColor(color) {
      this.form.categoryColor = color
      this.$refs['colorPicker'].hide()
    },
    onOKClick() {
      this.form.id = this.form.categoryTitle.replace(' ', '-')
      this.$emit('OKEvent', this.form)
    },
    onCancelClick() {
      this.$emit('cancelEvent')
    }
  }
}
</script>

<style></style>

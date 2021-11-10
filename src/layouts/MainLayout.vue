<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title> My Diary </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
      <q-list>
        <q-item-label header> User </q-item-label>
        <q-item-label header> {{ formattedDate }}</q-item-label>

        <EssentialLink
          v-for="link in essentialLinks"
          :key="link.title"
          v-bind="link"
        />
        <q-btn
          class="q-ma-sm"
          color="primary"
          label="+ add task"
          @click="addTask"
        />
        <q-btn
          class="q-ma-sm"
          color="secondary"
          label="+ add process"
          @click="addProcess"
        />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import EssentialLink from "components/EssentialLink.vue";
import { defineComponent, ref } from "vue";
import { date } from "quasar";
import { useQuasar } from "quasar";
import addProcessForm from "components/addProcessForm.vue";
import addTaskForm from "components/addTaskForm.vue";

const linksList = [
  {
    title: "Main",
    caption: "",
    icon: "view_list",
    link: "/",
  },
  {
    title: "Calendar",
    caption: "",
    icon: "event",
    link: "/calendar",
  },
  {
    title: "Global tasks",
    caption: "",
    icon: "note",
    link: "/global-tasks",
  },
  {
    title: "Help",
    caption: "",
    icon: "help",
    link: "/help",
  },
];

export default defineComponent({
  components: {
    EssentialLink,
  },

  setup() {
    const $q = useQuasar();
    const timeStamp = Date.now();
    const formattedDate = date.formatDate(timeStamp, "dddd, D MMMM YYYY");
    const leftDrawerOpen = ref(false);

    return {
      addTask() {
        $q.dialog({
          component: addTaskForm,
        });
      },
      addProcess() {
        $q.dialog({
          component: addProcessForm,
        });
      },
      essentialLinks: linksList,
      formattedDate,
      leftDrawerOpen,
      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value;
      },
    };
  },
});
</script>

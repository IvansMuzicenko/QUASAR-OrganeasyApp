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
        <q-item-label v-if="email" header> {{ email }}</q-item-label>
        <q-item-label v-else header clickable to="/auth">Sign In </q-item-label>
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
import { date } from "quasar";
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

export default {
  components: {
    EssentialLink,
  },
  computed: {
    email() {
      console.log(this.$store);
      return this.$store.getters["users/email"];
    },
  },

  data() {
    const timeStamp = Date.now();
    const formattedDate = date.formatDate(timeStamp, "dddd, D MMMM YYYY");
    const leftDrawerOpen = false;

    return {
      essentialLinks: linksList,
      formattedDate,

      leftDrawerOpen,
    };
  },
  methods: {
    addTask() {
      this.$q.dialog({
        component: addTaskForm,
      });
    },
    addProcess() {
      this.$q.dialog({
        component: addProcessForm,
      });
    },
    toggleLeftDrawer() {
      leftDrawerOpen.value = !leftDrawerOpen.value;
    },
  },
};
</script>

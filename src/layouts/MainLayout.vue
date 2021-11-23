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
        <q-item-label v-if="email" header>
          {{ email.slice(0, email.indexOf("@")) }}</q-item-label
        >
        <q-btn
          v-else
          class="full-width q-ma-lg"
          color="secondary"
          label="Sign In"
          to="/auth"
        />
        <q-item-label header> {{ formattedDate }}</q-item-label>

        <EssentialLink
          v-for="link in email ? essentialLinks : unauthLinks"
          :key="link.title"
          v-bind="link"
        />
        <q-btn
          v-if="email"
          class="q-ma-sm"
          color="primary"
          label="+ add task"
          @click="addTask"
        />
        <q-btn
          v-if="email"
          class="q-ma-sm"
          color="secondary"
          label="+ add process"
          @click="addProcess"
        />
        <q-btn
          v-if="email"
          class="q-ma-sm"
          color="secondary"
          label="+ add note"
          @click="addNote"
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
import addNoteForm from "components/addNoteForm.vue";

export default {
  components: {
    EssentialLink,
  },
  computed: {
    email() {
      return this.$store.getters["users/email"];
    },
  },

  data() {
    const timeStamp = Date.now();
    const formattedDate = date.formatDate(timeStamp, "dddd, D MMMM YYYY");

    return {
      leftDrawerOpen: false,
      essentialLinks: [
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
      ],
      unauthLinks: [
        {
          title: "Help",
          caption: "",
          icon: "help",
          link: "/help",
        },
      ],
      formattedDate,
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
    addNote() {
      this.$q.dialog({
        component: addNoteForm,
      });
    },
    toggleLeftDrawer() {
      this.leftDrawerOpen = !this.leftDrawerOpen;
    },
  },
};
</script>

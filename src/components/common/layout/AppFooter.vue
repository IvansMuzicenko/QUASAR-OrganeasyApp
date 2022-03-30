<template>
  <q-footer
    v-if="email"
    elevated
    reveal
    class="lt-sm bg-orange-3 text-black text-caption"
  >
    <q-toolbar class="row no-padding">
      <div class="col-12">
        <q-list class="row">
          <q-item
            class="col justify-center no-padding"
            clickable
            exact
            :class="parentPath == 'tasks' ? 'activeLink' : ''"
            to="/"
          >
            <q-item-section class="text-center" style="line-height: 0">
              <q-item-section class="row no-padding">
                <q-icon size="sm" name="view_list" class="col" />
              </q-item-section>
              <q-item-section class="no-margin text-weight-light">
                Diary
              </q-item-section>
            </q-item-section>
          </q-item>

          <q-item
            class="col justify-center no-padding"
            clickable
            :class="parentPath == 'free-tasks' ? 'activeLink' : ''"
            to="/free-tasks"
          >
            <q-item-section class="text-center" style="line-height: 0">
              <q-item-section class="row no-padding">
                <q-icon size="sm" name="alarm_off" class="col" />
              </q-item-section>
              <q-item-section class="no-margin text-weight-light">
                Free tasks
              </q-item-section>
            </q-item-section>
          </q-item>

          <q-item class="col-2 justify-center no-padding" clickable>
            <q-avatar round color="orange" text-color="white" icon="add" />
            <items-creation-menu />
          </q-item>

          <q-item
            class="col justify-center no-padding"
            clickable
            :class="parentPath == 'notes' ? 'activeLink' : ''"
            to="/notes"
          >
            <q-item-section class="text-center" style="line-height: 0">
              <q-item-section class="row no-padding">
                <q-icon size="sm" name="note" class="col" />
              </q-item-section>
              <q-item-section class="no-margin text-weight-light">
                Notes
              </q-item-section>
            </q-item-section>
          </q-item>

          <q-item
            class="col justify-center no-padding"
            clickable
            :class="
              parentPath == 'processes' ||
              parentPath == 'categories' ||
              parentPath == 'settings' ||
              parentPath == 'help'
                ? 'activeLink'
                : ''
            "
          >
            <q-menu
              class="text-center"
              auto-close
              self="top middle"
              anchor="bottom middle"
            >
              <q-list style="min-width: 100px" separator>
                <q-item
                  class="col justify-center no-padding"
                  clickable
                  :class="parentPath == 'processes' ? 'activeLink' : ''"
                  to="/processes"
                >
                  <q-item-section class="text-center" style="line-height: 0">
                    <q-item-section class="row no-padding">
                      <q-icon size="sm" name="update" class="col" />
                    </q-item-section>
                    <q-item-section class="no-margin text-weight-light">
                      Processes
                    </q-item-section>
                  </q-item-section>
                </q-item>
                <q-item
                  class="col justify-center no-padding"
                  clickable
                  :class="parentPath == 'categories' ? 'activeLink' : ''"
                  to="/categories"
                >
                  <q-item-section class="text-center" style="line-height: 0">
                    <q-item-section class="row no-padding">
                      <q-icon size="sm" name="category" class="col" />
                    </q-item-section>
                    <q-item-section class="no-margin text-weight-light">
                      Categories
                    </q-item-section>
                  </q-item-section>
                </q-item>

                <q-item
                  class="col justify-center no-padding"
                  clickable
                  :class="parentPath == 'help' ? 'activeLink' : ''"
                  to="/help"
                >
                  <q-item-section class="text-center" style="line-height: 0">
                    <q-item-section class="row no-padding">
                      <q-icon size="sm" name="help" class="col" />
                    </q-item-section>
                    <q-item-section class="no-margin text-weight-light">
                      Help
                    </q-item-section>
                  </q-item-section>
                </q-item>
                <q-item
                  class="col justify-center no-padding"
                  clickable
                  :class="parentPath == 'settings' ? 'activeLink' : ''"
                  to="/settings"
                >
                  <q-item-section class="text-center" style="line-height: 0">
                    <q-item-section class="row no-padding">
                      <q-icon size="sm" name="settings" class="col" />
                    </q-item-section>
                    <q-item-section class="no-margin text-weight-light">
                      Settings
                    </q-item-section>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-menu>
            <q-item-section class="text-center" style="line-height: 0">
              <q-item-section class="row no-padding">
                <q-icon size="sm" name="more_vert" class="col" />
              </q-item-section>
              <q-item-section class="no-margin text-weight-light">
                More
              </q-item-section>
            </q-item-section>
          </q-item>
        </q-list>
      </div>
    </q-toolbar>
  </q-footer>
</template>

<script>
import ItemsCreationMenu from 'src/components/common/layout/parts/ItemsCreationMenu.vue'

export default {
  components: {
    ItemsCreationMenu
  },
  computed: {
    email() {
      return this.$store.getters['users/email']
    },
    parentPath() {
      return this.$route.meta.parentPath || null
    }
  }
}
</script>

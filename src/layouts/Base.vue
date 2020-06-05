<template>
    <el-scrollbar class="page-scrollbar" 
                  wrap-class="page-scrollbar__wrap">
      <el-container>
        <el-header>
          <nav class="nav">
            <div v-if="isAuthenticated" class="nav-item">
              <router-link  class=""
                            exact-active-class="active"
                            to="/">
                Главная
              </router-link>
            </div>
            <div class="nav-item ml-auto">
              <router-link v-if="!isAuthenticated"
                          class=""
                          to="/login">
                Войти
              </router-link>
              <el-dropdown v-else>
                <a>
                  <i class="el-icon-user"></i>
                  {{ currentUser && currentUser.login }}
                  <i class="el-icon-arrow-down"></i>
                </a>
                <el-dropdown-menu>
                  <el-dropdown-item >
                    <a @click="logOut">Выйти</a>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
          </nav>
        </el-header>
        <el-main>
          <div class="page">
            <slot></slot>
          </div>
        </el-main>
      </el-container>
    </el-scrollbar>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex';

export default {
  name: 'HeaderPartialView',
  computed: {
    ...mapState('auth', {
      'currentUser': (state) => state.currentUser,
    }),
    ...mapGetters('auth', {
      'isAuthenticated': 'isAuthenticated',
    }),
  },
  methods: {
    ...mapActions('auth', ['CheckToken', 'LogOut']),
    async logOut() {
      await this.LogOut();
      location.reload();
    },
    toLogin() {
      this.$router.push('/login');
    },
  },
}
</script>
<style lang="scss">

</style>
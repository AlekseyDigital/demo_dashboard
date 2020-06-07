<template>
  <el-row>
    <el-col :span="8"
            :offset="8">
      <div class="login-form">
        <h1>Вход в систему</h1>
        <el-form :model="form" 
                :rules="rules" 
                ref="formLogin"
                label-position="top">
          <el-form-item label="Логин" 
                      :label-width="formLabelWidth"
                      prop="login">
            <el-input v-model="form.login" autocomplete="off">
              <i slot="prepend" class="el-icon-user"></i>
           </el-input>
          </el-form-item>
          <el-form-item label="Пароль" 
                      :label-width="formLabelWidth"
                      prop="password">
            <el-input v-model="form.password" 
                      autocomplete="off"
                      type="password">
              <i slot="prepend" class="el-icon-edit"></i>
            </el-input>
          </el-form-item>
          <el-button class="login-form__submit"
                  type="primary" 
                  @click="signIn">
            Войти
          </el-button>
        </el-form>
      </div>
    </el-col>
  </el-row>
</template>

<script>
import authService from '@/services/auth.service.js';
import { mapActions } from 'vuex';

import { rulesLoginForm } from '@/helpers/validationRules.js';

export default {
  name: 'LoginView',
  data() {
    return {
      form:{
        login: null,
        password: null,
      },
      formLabelWidth:'120px',
      rules:rulesLoginForm
    }
  },
  methods: {
    ...mapActions('auth',[
      'LogIn'
    ]),
    async signIn() {
      this.$refs['formLogin'].validate(async (valid) => {
          if (valid) {
            try{
              await this.LogIn({ login: this.form.login, password: this.form.password });
              const redirectPath = this.$route.query.redirect || '/';
              this.$router.push({ path: redirectPath });
            }
            catch(ex){
              console.log(ex);
            }
          } else {
            return false;
          }
        });
    }
  }
}
</script>

<style lang="scss" scoped>
  .login-form {
    background: white;
    padding: 20px 20px;
    border-radius: 4px;
    box-shadow:      0 2px 12px 0 rgba(0, 0, 0, 0.1);;
    &__submit{
      width:100%;
    }
  }
</style>
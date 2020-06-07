<template>
  <div class="modal">
    <div class="modal__header">
      <h2>{{modalTitle}}</h2>
      <a class="modal__headerbtn"
          @click="closeModal">
        <i class="el-icon el-icon-close"></i>
      </a>
    </div>
    <div class="modal__body">
      <el-form :model="form"
              :rules="rules"
              ref="form"
              label-position="left">
        <el-form-item label="Название"
                      :label-width="formLabelWidth"
                      prop="name">
          <el-input v-model="form.name"
                    autocomplete="off">
          </el-input>
        </el-form-item>
      </el-form>
    </div>

    <div class="modal__footer">
      <el-button @click="closeModal">Отмена</el-button>
      <el-button type="primary"
                @click="saveChart">
        {{savingBtnText}}
      </el-button>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { rulesDashboardForm } from '@/helpers/validationRules.js';
export default {
  name: 'DashboardSettingsModal',
  props: {
    'dashboard': {
      type: Object,
      default: null,
    },
    'save':{
      type:Function,
      required:true
    }
  },
  data() {
    return {
      form: {},
      formLabelWidth: '150px',
      rules: rulesDashboardForm,
    };
  },
  async created() {
    this.getDashboardForm();
  },
  computed: {
    ...mapState('auth', {
      'currentUser': (state) => state.currentUser,
    }),
    isNew(){
      return this.dashboard === null;
    },
    modalTitle(){
      return this.isNew ? 'Создание панели' : 'Редактирование панели';
    },
    savingBtnText(){
      return this.isNew ? 'Создать' : 'Сохранить';
    },
  },
  watch:{
  },
  methods: {
    /**
     * Возвращает объект формы с атрибутами дашборда
     */
    getDashboardForm(id) {
      let result = null;
      if (this.dashboard) {
        result = {
          ...this.dashboard
        }
      } else {
        result = {
          id:null,
          name: '',
          userId:this.currentUser.id
        };
      }
      this.form = result;
    },
    closeModal() {
      this.$emit('close');
    },
    saveChart() {
      this.$refs['form'].validate(async (valid) => {
        if (valid) {

          this.save({
            ...this.form,
          });
          this.closeModal();
        } else {
          return false;
        }
      });
    },
    
  },
};
</script>
<style lang="scss"></style>

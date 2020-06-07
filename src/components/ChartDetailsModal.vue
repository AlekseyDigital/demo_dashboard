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
              ref="formChart"
              label-position="left">
        <el-form-item label="Название"
                      :label-width="formLabelWidth"
                      prop="name">
          <el-input v-model="form.name"
                    autocomplete="off">
          </el-input>
        </el-form-item>
        <el-form-item label="Тип графика"
                    :label-width="formLabelWidth"
                    prop="type">
          <el-select v-model="form.type"
                      placeholder="Выберите тип графика"
                      :disabled="!isNew">
            <el-option v-for="item of allowedTypes"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="Источник данных"
                      :label-width="formLabelWidth"
                      prop="resourceId">
          <el-select v-model="form.resourceId"
                    placeholder="Выберите источник данных">
            <el-option v-for="(resource) of allowedEndpoints"
                      :key="resource.id"
                      :label="resource.name"
                      :value="resource.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="Показать легенду"
                      :label-width="formLabelWidth">
          <el-switch v-model="form.hasLegend"></el-switch>
        </el-form-item>
        <el-form-item v-show="form.hasLegend"
                      label="Положение легенды"
                      :label-width="formLabelWidth">
          <el-select v-model="form.legendPosition"
                    placeholder="Выберите источник данных">
            <el-option v-for="(legendPosition, key) of allowedLegendPositions"
                      :key="key"
                      :label="legendPosition"
                      :value="key">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-show="isTypeWithCoordinateGrid"
                      label="Показать подписи"
                      :label-width="formLabelWidth">
          <el-switch v-model="form.hasLabels"></el-switch>
        </el-form-item>
        <el-form-item label="Показать подписи данных"
                      :label-width="formLabelWidth">
          <el-switch v-model="form.hasDataLabels"></el-switch>
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
import { rulesChartForm } from '@/helpers/validationRules.js';
import { allowedTypes, allowedEndpoints } from '@/helpers/diagrams.js';
export default {
  name: 'ChartDetailsModal',
  props: {
    'diagram': {
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
      rules: rulesChartForm,
      allowedTypes: allowedTypes,
      allowedEndpoints: allowedEndpoints,
      allowedLegendPositions:{ 'left':'слева', 'top':'сверху', 'bottom':'снизу', 'right':'справа' }
    };
  },
  async created() {
    this.getDiagramForm();
  },
  computed: {
    ...mapState('auth', {
      'currentUser': (state) => state.currentUser,
    }),
    isNew(){
      return this.diagram === null;
    },
    modalTitle(){
      return this.isNew ? 'Создание диаграммы' : 'Редактирование диаграммы';
    },
    savingBtnText(){
      return this.isNew ? 'Создать' : 'Сохранить';
    },
    isTypeWithCoordinateGrid(){
      return this.form.type === allowedTypes.line.id
                            || this.form.type === allowedTypes.area.id
                            || this.form.type === allowedTypes.bar.id;
    }
  },
  watch:{
    isTypeWithCoordinateGrid(value){
      if(value === false)
        this.form.hasLabels = false;
    }
  },
  methods: {
    /**
     * Возвращает объект формы с атрибутами диаграммы
     */
    getDiagramForm(id) {
      let result = null;
      if (this.diagram) {
        result = {
          ...this.diagram
        }
      } else {
        result = {
          id:null,
          name: '',
          type: null,
          resourceId: null,
          hasLegend: true,
          legendPosition: 'left',
          hasLabels:true,
          hasDataLabels:true,
          order: 1,
          userId:this.currentUser.id
        };
      }
      this.form = result;
    },
    closeModal() {
      this.$emit('close');
    },
    saveChart() {
      this.$refs['formChart'].validate(async (valid) => {
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

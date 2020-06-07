<template>
  <div class="dashboard" >
    <!-- v-loading="loading" -->
    <div class="dashboard-managment">
          <el-form :model="form"
                    ref="formDashboards"
                    label-position="left"
                    inline>
            <el-form-item >
              <el-select v-model="form.activeDashboardId"
                            placeholder="Выберите тип панель">
                <el-option v-for="item of dashboards"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                </el-option>
              </el-select>
              <el-tooltip effect="dark" content="Создать новую панель" placement="right-end">
                <el-button plain 
                          @click="toCreateDashboard">
                  <i class="el-icon-plus"></i>
                </el-button>
              </el-tooltip>
            </el-form-item>
            <el-form-item>
            </el-form-item>
          </el-form>
          <div v-if="form.activeDashboardId" 
              class="dashboard-managment__contorls ml-auto">
            <el-button-group>
              <el-tooltip effect="dark" content="Настройки текущей панели" placement="bottom-end">
                <el-button icon="el-icon-setting" circle plain 
                            @click="toEditDashboard">
                </el-button>
              </el-tooltip>
              <el-tooltip effect="dark" content="Удалить текущую панель" placement="bottom-start">
                <el-button icon="el-icon-delete" circle plain
                          @click="deleteDashboard">
                </el-button>
              </el-tooltip>
            </el-button-group>
          </div>
        <!-- <div style=""></div> -->
    </div>
    <div v-if="dashboards.length === 0 && !form.activeDashboardId" class="text-center">
      На данный момент у вас отсутствуют панели.
    </div>
    <div v-else>
      <div v-loading="loading"></div>
      <div v-if="!diagrams.length && !loading" class="text-center">
        На данный момент у вас отсутствуют диаграммы. 
        Воспользуйтесь кнопкой в правом нижнем углу экрана для создания диаграммы
      </div>
      <el-row v-else-if="diagrams.length">
        <VueDraggable
                      class="el-row"
                      v-model="diagrams"
                      draggable=".chart-container"
                      handle=".chart__handle"
                      ghost-class="chart-ghost"
                      @update="onUpdateDiagramSorting">
          <transition-group
                            type="transition"
                            name="flip-list">
            <el-col
                    v-for="item of diagrams"
                    :key="item.id"
                    class="chart-container"
                    :span="12"
                    :xs="24"
                    :sm="24"
                    :md="12"
                    :lg="8"
                    :xl="6">
              <VueChartBlock
                              :id="item.id"
                              :type="item.type"
                              :title="item.name"
                              :datasets="getDatasets(item.resourceId)"
                              :labels="getLabels(item.resourceId)"
                              :has-legend="item.hasLegend"
                              :legend-position="item.legendPosition"
                              :has-labels="item.hasLabels"
                              :has-data-labels="item.hasDataLabels"
                              @delete-chart="deleteDiagram"
                              @edit-chart="toEditDiagram">
              </VueChartBlock>
            </el-col>
          </transition-group>
        </VueDraggable>
      </el-row>
      

      <el-tooltip class="item" effect="dark" content="Создать новую диаграмму" placement="left-end">
        <el-button class="btn-add-chart"
                    icon="el-icon-plus"
                    type="primary"
                    circle
                    @click="toCreateDiagram">
        </el-button>
      </el-tooltip>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex';
import VueDraggable from 'vuedraggable';
import dashboardService from '@/services/dashboard.service.js';
import VueChartBlock from '@/components/charts/ChartBlock.vue';
import { allowedEndpoints } from '@/helpers/diagrams.js';

//import { Loading } from 'element-ui';

import VueFormChartDetails from '@/components/ChartDetailsModal.vue';
import VueDashboardSettingsDetails from '@/components/DashboardSettingsModal.vue';

import { getRequest } from '@/services/request.service.js';

export default {
  name: 'Dashboard',
  components: {
    VueChartBlock,
    VueDraggable,
  },
  data() {
    return {
      diagrams: [],
      diagramsCachedData: {},
      loading: true,
      form:{
        activeDashboardId:null
      },
      dashboards:[],
      loadingDasboards:true
    };
  },
  computed: {
    ...mapState('auth', {
      'currentUser': (state) => state.currentUser,
    }),
  },
  watch:{
    async 'form.activeDashboardId'(newValue, oldValue){
      if(newValue !== oldValue){
        await this.fetchDiagrams();
        this.fetchData();
      }
    }
  },
  async created() {
    await this.fetchDashboards();
    await this.fetchDiagrams();

    this.fetchData();
  },
  methods: {
    async fetchDashboards() {
      
      this.loadingDasboards = true;
      this.dashboards = await dashboardService.getDashboards(this.currentUser.id);
      this.form.activeDashboardId = this.dashboards.length ? this.dashboards[0].id : null;
      this.loadingDasboards = false;
      
    },
    async fetchDiagrams() {
      this.loading = true;
      let { data, total } = await dashboardService.getDiagrams(this.form.activeDashboardId);
      this.diagrams = data;
      this.total = total;
      this.loading = false;
    },
    async fetchData() {
      for (let item of this.diagrams) {
        const resource = allowedEndpoints.find((d) => d.id == item.resourceId);
        if (resource && !this.diagramsCachedData.hasOwnProperty(resource.id)) {
          try{
            let result = (await getRequest(resource.endpoint)).data;
            this.$set(this.diagramsCachedData, resource.id, result);
          }
          catch(err){
            console.error(err);
          }
        }
      }
    },
    async updateCachedData(resourceId){
      const resource = allowedEndpoints.find((d) => d.id == resourceId);
      if(resource){
        try{
          let result = (await getRequest(resource.endpoint)).data;
          if (!this.diagramsCachedData.hasOwnProperty(resource.id)) {
            this.$set(this.diagramsCachedData, resource.id, result);
          }
          else {
            this.diagramsCachedData[resource.id] = result;
          }
        }
        catch(err){
          console.error(err);
        }
      }
    },
    getDatasets(resourceId) {
      const data = this.diagramsCachedData[resourceId];
      return data && data.datasets;
    },
    getLabels(resourceId) {
      const data = this.diagramsCachedData[resourceId];
      return data && data.labels;
    },

    //////////////////////////Dashboard
    async toCreateDashboard(){
      this.$modal.show(VueDashboardSettingsDetails, {
        'dashboard': null,
        'save': this.saveDashboard
      })
    },
    async saveDashboard(dashboard){
      try {   
        let savedDashboard  = null; 
        if (dashboard.id) {
          savedDashboard = await dashboardService.updateDashboard(dashboard);
          const index = this.dashboards.findIndex(d => d.id === savedDashboard.id);
          if(index !== -1)
            this.dashboards.splice(index, 1, savedDashboard)
        }
        else {
          savedDashboard = await dashboardService.addDashboard(dashboard);
          this.dashboards.push(savedDashboard);
          this.form.activeDashboardId = savedDashboard.id;

        }
        this.$message({
          message: `Панель "${savedDashboard.name}" успешно сохранена`,
          type: 'success'
        });
      } catch (err) {
        console.error(err);
        this.$message.error('Не удалось сохранить панель');
      }
    },
    async toEditDashboard(){
      const dashboard = this.dashboards.find(d => d.id === this.form.activeDashboardId);
      if (dashboard) {
        this.$modal.show(VueDashboardSettingsDetails, {
          'dashboard': dashboard,
          'save': this.saveDashboard
        });
      }
    },
    async deleteDashboard(){
      const index = this.dashboards.findIndex(d => d.id === this.form.activeDashboardId);
      if (index !== -1) {
        this.$confirm(
          `Удалить панель "${this.dashboards[index].name}" вместе со всеми диаграммами?`, 'Удаление панели',
          {
            confirmButtonText: 'Удалить',
            cancelButtonText: 'Отмена',
          }).then(async () => {
            try {
              const savedDiagram = await dashboardService.deleteDashboard(this.form.activeDashboardId);
              this.dashboards.splice(index, 1);
              this.form.activeDashboardId =  this.dashboards.length ? this.dashboards[0].id : null;
            } catch (err) { }
          }).catch(() => { });
      }
    },
    async onUpdateDiagramSorting(e) {
      const toIndex = Math.max(e.oldIndex, e.newIndex);
      const fromIndex = Math.min(e.oldIndex, e.newIndex);
      const elementsForUpdate = this.diagrams.slice(fromIndex, toIndex + 1);
      elementsForUpdate.forEach((item, i) => {
        item.order = fromIndex + i + 1;
      });
      await dashboardService.sortDiagrams(elementsForUpdate);
    },

    ////////////////////////Diaagram
    async saveDiagram(diagram) {
      try {   
        let savedDiagram  = null; 
        if (diagram.id) {
          savedDiagram = await dashboardService.updateDiagram(diagram);
          const diagramIndex = this.diagrams.findIndex(d => d.id === savedDiagram.id);
          if(diagramIndex !== -1)
            this.diagrams.splice(diagramIndex, 1, savedDiagram)
        }
        else {
          if(this.diagrams.length){
            const lastItem = this.diagrams[this.diagrams.length - 1];
            diagram.order = (lastItem.order + 1);
          }
          diagram.dashboardId = this.form.activeDashboardId;
          savedDiagram = await dashboardService.addDiagram(diagram);
          this.diagrams.push(savedDiagram);
        }
        if(!this.diagramsCachedData[savedDiagram.resourceId]){
          this.updateCachedData(savedDiagram.resourceId);
        }
        this.$message({
          message: 'Диаграмма успешно сохранена',
          type: 'success'
        });
      } catch (err) {
        console.error(err);
        this.$message.error('Не удалось сохранить диагрмму');
      }
    },
    deleteDiagram(id) {
      const chartIndex = this.diagrams.findIndex((d) => d.id === id);
      if (chartIndex !== -1) {
        this.$confirm(
          `Удалить блок с графиком "${this.diagrams[chartIndex].name}"?`, 'Удаление графика',
          {
            confirmButtonText: 'Удалить',
            cancelButtonText: 'Отмена',
          }).then(async () => {
            try {
              const savedDiagram = await dashboardService.deleteDiagram(id);
              this.diagrams.splice(chartIndex, 1);
            } catch (err) { }
          }).catch(() => { });
      }
    },
    async toCreateDiagram() {
      this.$modal.show(VueFormChartDetails, {
        'diagram': null,
        'save': this.saveDiagram
      })
    },
    async toEditDiagram(id) {
      const diagram = this.diagrams.find((d) => d.id === id);
      if (diagram) {
        this.$modal.show(VueFormChartDetails, {
          'diagram': diagram,
          'save': this.saveDiagram
        });
      }
    },
  },
};
</script>
<style>
  .dashboard-managment{
    padding-left:10px;
    padding-right:10px;
    display:flex;
    flex-wrap: wrap;
  }
</style>

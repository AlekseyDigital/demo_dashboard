<template>
  <div class="home">
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
              @delete-chart="deleteDiagram"
              @edit-chart="toEditDiagram">
            </VueChartBlock>
          </el-col>
        </transition-group>
      </VueDraggable>
    </el-row>
    

    <el-button class="btn-add-chart"
                icon="el-icon-plus"
                type="primary"
                circle
                @click="toCreateDiagram">
    </el-button>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex';
import VueDraggable from 'vuedraggable';
import dashboardService from '@/services/dashboard.service.js';
import VueChartBlock from '@/components/charts/ChartBlock.vue';
import { allowedEndpoints } from '@/helpers/diagrams.js';

import VueFormChartDetails from '@/components/ChartDetailsModal.vue';

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
    };
  },
  computed: {
    ...mapState('auth', {
      'currentUser': (state) => state.currentUser,
    }),
  },
  async created() {
    await this.fetchDiagrams();

    this.fetchData();
  },
  methods: {
    async fetchDiagrams() {
      this.loading = true;
      let { data, total } = await dashboardService.getDiagrams(this.currentUser.id);
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

    async onUpdateDiagramSorting(e) {
      const toIndex = Math.max(e.oldIndex, e.newIndex);
      const fromIndex = Math.min(e.oldIndex, e.newIndex);
      const elementsForUpdate = this.diagrams.slice(fromIndex, toIndex + 1);
      elementsForUpdate.forEach((item, i) => {
        item.order = fromIndex + i + 1;
      });
      await dashboardService.sortDiagrams(elementsForUpdate);
    },
    async saveDiagram(diagram) {
      this.loading = true;
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
      
      this.loading = false;
    },
    deleteDiagram(id) {
      const chartIndex = this.diagrams.findIndex((d) => d.id === id);
      if (chartIndex !== -1) {
        this.$confirm(
          `Удалить блок с графиком "${this.diagrams[chartIndex].name}"?`, '',
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

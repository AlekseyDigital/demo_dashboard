<template>
    <el-card class="box-card">
      <div slot="header" class="chart-controls">
        <div>
          <el-button class="chart__handle chart-controls__btn"
                      type="text" 
                      icon="el-icon-rank">
          </el-button>
        </div>
        <div class="ml-auto">
          <el-button class="chart-controls__btn"
                      type="text" 
                      icon="el-icon-edit-outline"
                      @click="editChart">
          </el-button>
          <el-button class="chart-controls__btn"
                      type="text" 
                      icon="el-icon-delete"
                      @click="deleteChart">
          </el-button>
        </div>
      </div>
      <div class="chart-wrapper">
        <VueChart  
                height="100%"
                :options="chartOptions" 
                :series="chartSeries">
        </VueChart>
      </div>
    </el-card>
</template>

<script>
import debounce from 'lodash/debounce';
const ruLocale = require('apexcharts/dist/locales/ru.json');
import { allowedTypes } from '@/helpers/diagrams.js';

export default {
  name:'ChartBlock',
  props:{
    'id':{
      type:[String,Number],
      required:true,
    },
    'type':{
      type:String,
      default:allowedTypes.line.id,
      validator(value){
        return Object.values(allowedTypes).map(d => d.id).indexOf(value) !== -1;
      }
    },
    'title':{
      type:String,
    },
    'datasets':{
      type:Array,
      default(){
        return [];
      },
    },
    'labels':{
      type:Array,
      default(){
        return [];
      },
    },
    'hasLabels':{
      type:Boolean,
      default:false,
    },
    'hasDataLabels':{
      type:Boolean,
      default:false,
    },
    'hasLegend':{
      type:Boolean,
      default:false,
    },
    'legendPosition':{
      type:String,
      default:'left',
    },
    // 'minimalism':{
    //   type:Boolean,
    //   default:false,
    // },
  },
  data() {
      return {
        chartOptions: {
          chart: {
            type:this.type,
            height: '100%',
            zoom:{
              enabled:false
            },
            locales:[ruLocale],
            defaultLocale:"ru",
          },
          colors:['#61d2c1',	'#5884e4',	'#2578dc',	'#41dccd', '#41dc68', '#8cdc41', '#bedc41', '#ffeb3b'],//'#7957D5', 41abdc
          dataLabels:{
            //enabled:false
          },
          title: {
            align: 'left'
          },
        },
        chartSeries: [],
      }
    },
    computed:{
    },
    created(){
      //Слежение за данными
      this.$watch(() => this.datasets,
                  debounce((newValue, oldValue) => this.updateSeries(), 
                  100), 
                  { deep: true, immediate: true })
      
      //Слежение за опциями
      this.$watch(() =>{
        return {
          labels: this.labels,
          hasLegend:this.hasLegend,
          legendPosition:this.legendPosition,
          title:this.title,
          hasLabels:this.hasLabels,
          hasDataLabels:this.hasDataLabels
        }
      }, debounce((newValue, oldValue) => {
        this.updateChart();
      }, 100), {
        immediate: true
      })
    },
    methods: {
      updateSeries(){
        this.chartSeries = this.getSeries(this.type, this.datasets); 
      },
      getSeries(type, datasets){
        let result = [];
        if(type === allowedTypes.pie.id){
          result = datasets[0] ? datasets[0].data : [];
        }
        else{
          result = datasets.map(d => ({
              name: d.label,
              data: d.data
          }));
        }
        return result;
      },
      updateChart() {
        this.chartOptions = {
          ...this.chartOptions,
          legend:{
              show:this.hasLegend,
              position:this.legendPosition
          },
          labels: this.labels,
          dataLabels:{
            enabled:this.hasDataLabels,
          },
          title:{
            text: this.title,
          },
          xaxis: {
              categories: this.labels,
              labels:{
                show:this.hasLabels
              }
          },
          yaxis: {
              //categories: this.labels,
              labels:{
                show:this.hasLabels
              }
          },
        };
      },
      deleteChart(){
        this.$emit('delete-chart', this.id);
      },
      editChart(){
        this.$emit('edit-chart', this.id);
      }
    }
}
</script>
<style scoped lang="scss">
.chart-wrapper{
  height:250px;
}
  .chart-controls{
    display:flex;
    i{
      font-size:18px;
    }
    &__btn{
      padding:0;
    }
  }
</style>

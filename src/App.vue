<template>
  <div id="app">
    <LayoutBase v-if="initialized">
            <router-view />
    </LayoutBase>
  </div>
</template>
<script>
import LayoutBase from '@/layouts/Base.vue';

export default {
  name: 'App',
  components: {
    LayoutBase,
  },
  data(){
    return {
      initialized:false
    }
  },
  async created() {
    await this.$store.dispatch('auth/CheckToken');
    this.initialized = true;
  }
};
</script>

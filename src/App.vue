<template>
  <div id="app">
    <LayoutBase>
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
  created() {
    this.$store.dispatch('auth/CheckToken');
  }
};
</script>

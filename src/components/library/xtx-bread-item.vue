<template>
  <div class="xtx-bread-item">
    <RouterLink v-if="path" :to="path"><slot></slot></RouterLink>
    <span v-else><slot></slot></span>
  </div>
</template>

<script>
export default {
  name:'XtxBreadItem',
  props:{
    path:{
      type: [String,Object],
      default: ''
    }
  }
};
</script>

<style>
</style>
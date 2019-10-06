<template>
<div class="mx-auto mt-3">
  <div>
  <b-dropdown id="ddown1" text="Mode d'affichage" class="m-md-2">
    <b-dropdown-item v-on:click="simple()">Affichage Simple</b-dropdown-item>
    <b-dropdown-item v-on:click="shame()">Avec Nombre de Voix</b-dropdown-item>
  </b-dropdown>
</div>
  <component :is="compute"></component>
</div>
</template>

<script>

export default {
  data () {
    return {
      mode: "ResultsModeSimple",
      compute: this.comp()
    }
  },
  methods: {
    simple() {
      this.mode = 'ResultsModeSimple';
      this.compute = this.comp();
    },
    shame() {
      this.mode = 'ResultsModeShame';
      this.compute = this.comp();
    },
    comp () {
      return () => import(`./Results/${this.mode}.vue`)
    }
  }
}
</script>

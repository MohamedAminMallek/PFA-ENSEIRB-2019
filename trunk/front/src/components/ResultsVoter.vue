<template>
<div class="mx-auto mt-3">
  <component :is="compute"></component>
</div>
</template>

<script>
import axios from 'axios';
export default {
  data () {
    return {
      param : null,
      mode: "",
      compute: null
    }
  },
  methods: {
    comp () {
      return () => import(`./Results/${this.mode}.vue`)
    },
    async getDisplayMode(pointer,candidatID,privateCode)
    {
      let data = {
        pointer : pointer,
        candidatID : candidatID,
        privateCode : privateCode
      }
      await axios.post(this.$http + 'getDisplayMode',data)
      .then(response => {
        this.mode = response.data.mode
        this.compute = this.comp();
      })

    }
  },
  async created() {
    
    this.param = {
      pointer : this.$route.query.pointer,
      candidatID : this.$route.query.cid,
      privateCode : localStorage.getItem('code')
    }
    await this.getDisplayMode(this.$route.query.pointer,this.$route.query.cid,localStorage.getItem('code'))
    console.log(this.mode)
  }
}
</script>

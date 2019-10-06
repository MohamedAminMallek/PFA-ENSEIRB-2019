<template>
  <div>
    <h4>Vote pour {{$route.query.pointer}}</h4>
    <b-form @submit="onSubmit">
       <b-form-group id="exampleInputGroup1"
                     label="Votre code secret:"
                     v-if='show'
                     label-for="exampleInput1"
                     description="Si vous n'avez pas de code secret pour cette session appuyez sur le boutton 'Pas de code secret'.">
         <b-form-input id="secretCodeInput"
                       type="password"
                       v-model="form.code"
                       :state="codeValid"
                       @change = "checkPrivateCode()"
                       aria-describedby="inputLiveFeedback"
                       required
                       placeholder="Entrez votre code secret ici">
         </b-form-input>
         <b-form-invalid-feedback id="inputLiveFeedback">
           <!-- This will only be shown if the preceeding input has an invalid state -->
           Code secret vide ou invalide veuillez le corriger ou procéder sans code secret.
         </b-form-invalid-feedback>
       </b-form-group>
       <div class="wrapper">
         <b-button v-if='show' type="submit" variant="primary">Valider</b-button>
         </div>
     </b-form>
     <br>
     <h3 v-if='!show'>{{this.message}}</h3>
     <div class="wrapper">
       <b-button v-on:click="tryToVote" v-if='show' variant="danger">Pas de code secret</b-button>
     </div>
     <br v-if='showResults'>
     <div v-if='showResults' class="wrapper">
       <b-button v-on:click="moveToResult" variant="success">Voir les résultats</b-button>
     </div>
     <br>
     <div class="wrapper">
       <b-button v-b-modal.remove v-if='show' variant="warning">Supprimer mes votes</b-button>
     </div>
     <br v-if='!show'>
     <div class="wrapper">
       <b-button v-if='!show' v-on:click="swapShow" variant="danger">Retour au vote</b-button>
     </div>
     <b-modal id="remove" title="Suppression des votes">
       <p class="my-4">Etes-vous sûr ?</p>
     </b-modal>
  </div>
</template>

<script>
import axios from "axios"
var groupName;
var sessionStatus;
var code = undefined;
// some complicated ways to replace cookies
//https://github.com/j-keck/lsleases
//https://stackoverflow.com/questions/11930356/getting-mobile-device-name-from-javascript


export default {
  data () {
    var c = this.secretCodePlaceHolder();
    return {
      form: {
        code: c
      },
      show: true,
      message: '',
      groupID: undefined,
      showResults: false
    }
  },
  methods: {
    onSubmit (evt) {

      var isnum = /^[0-9]+$/.test(this.form.code);
      if(this.form.code.length == 4 && isnum){
        code = this.form.code;
        this.tryToVote();
      }else{
        console.log("Mot de passe Invalide");
      }
    },
    async tryToVote(){
      //<cookies code>
      if(!navigator.cookieEnabled){
        this.failToRegister();
        return;
      }
      var d = new Date();
      var lastSubmit = parseInt(localStorage.getItem('lastSubmit'));
      if(parseInt(localStorage.getItem('nbSubmit')) > 3 && d.getTime() - lastSubmit <= 45000){
        this.failToVoteMany();
        return;
      }
      if(localStorage.getItem('nbSubmit') == undefined || localStorage.getItem('lastSubmit') == undefined || d.getTime() - lastSubmit > 45000){
        localStorage.setItem('nbSubmit', 0);
        localStorage.setItem('lastSubmit', d.getTime());
      }
      //</cookies code>
      var vid = this.voterID();
      const test = await this.sendInfoBack(code, vid);//return true if the voter has successfully voted
      if(!test){
        this.alreadyVoted();
      }else{
        //<cookies code>
          if(!this.showResults){
            var pointers = localStorage.getItem('participated');
            localStorage.setItem('participated', pointers + "&" + this.$route.query.pointer);
            this.showResults = true;
          }
          //</cookies code>
        this.setSecretCode(this.form.code);
        this.succeedToVoteStd();
      }
    },
    async sendInfoBack (privateCode, vid) {
      const cid = this.$route.query.cid;
      const pointer = this.$route.query.pointer;
      const title = this.$route.query.title;

      var res = await axios.post(this.$http+'vote',
          {
              "candidatID": cid, "pointer": pointer, "privateCode": privateCode, "voterID": vid, "title": title
          },
          {
            headers : {'Access-Control-Allow-Origin': '*'}
          }
          )
          .then(response=>{console.log(response.data); sessionStatus = response.data.error; groupName = response.data.group; return response.data.message;})
          console.log(sessionStatus);

      return res
    },
    alreadyVoted(){
      console.log(this.form.code);
      // implementation of 3 unsucessful submits per 45s
      //<cookies code>
      var n = parseInt(localStorage.getItem('nbSubmit'));

      localStorage.setItem('nbSubmit', n+1);
      if(n > 3){
        this.failToVoteMany();
        //</cookies code>
      }else if(sessionStatus == 'inactive'){
        this.failToVoteInactive();
      }else{
        this.failToVoteStd();
      }

    },
    voterID(){
      //<cookies code>
      var id = localStorage.getItem('id')
      if (id == undefined)
      {
        id = this.generateRandomID();
        localStorage.setItem('id',id);
      }
      //</cookies code>
      return id
    },
    generateRandomID(){
      var d = new Date();
      var n = d.getTime();
      return "" + Math.floor(Math.random() * Math.floor(1000)) + n
    },
    setSecretCode(code){
      //<cookies code>
      var c = localStorage.getItem('code');
      var isnum = /^[0-9]+$/.test(code);
      if(c == undefined && isnum && code.length == 4 && c != code){
        c = code;
        localStorage.setItem('code',c)
      }
      //</cookies code>
      return c;
    },
    secretCodePlaceHolder(){
      //<cookies code>
      var c = localStorage.getItem('code');
      if(c == undefined){
        c = '';
      }
      //</cookies code>
      return c;
    },
    async deleteVote(){
      //<cookies code>
      var id = localStorage.getItem('id');
      if(id == undefined){
        return;
      }
      //</cookies code>
      const pointer = this.$route.query.pointer;
      const cid = this.$route.query.cid;
      var res = await axios.post(this.$http+'deleteVote',
          {
              "voterID": id, "pointer" : pointer, "candidatID": cid
          },
          {
            headers : {'Access-Control-Allow-Origin': '*'}
          }
          )
          .then(res=>{
            if(res.data.message != 'no' ){
              this.succeedToDeleteStd();
            }else {
              this.failToVoteInactive();
            }
          })
    },
    failToVoteInactive(){
      alert('La session est inactive, veuillez essayer plus tard');
    },
    failToVoteMany(){
      this.show = false;
      this.message = 'Vous avez déjà essayé de voter plus de trois fois !\nVous pourrez à nouveau voter dans quelques dizaines de secondes!';
    },
    failToVoteStd(){
      this.show = false;
      this.message = "Vous avez déjà voté !";
    },
    succeedToVoteStd(){
      this.show = false;
      this.showResults = true;

      if(groupName == 'DefaultGroup'){
        this.message = "Vous avez voté pour " + this.$route.query.cid + " ! (sans code secret)";
      }else{
        this.message = "Vous avez voté pour " + this.$route.query.cid + " en tant que '" + groupName + "' !";
      }
    },
    succeedToDeleteStd(){
      alert('Vous avez bien supprimé vos votes!');
    },
    failToRegister(){
      this.show = false;
      this.message = "Malheureusement vous ne pouvez pas voter en mode navigation privée.\n Veuillez flasher à nouveau le QR-Code quand vous aurez quitté la navigation privée."
    },
    swapShow(){
      this.show = true;
    },
    moveToResult(){

      var url = '/publicResults/?pointer=' + this.$route.query.pointer + '&cid=' + this.$route.query.cid;//pointeur code cid
      this.$router.push(url);
    },
    checkPrivateCode()
    {
      if(this.form.code != localStorage.getItem('code'))
       localStorage.setItem('code',this.form.code)
      
    }
  },
  computed: {
    codeValid() {
      var isnum = /^[0-9]+$/.test(this.form.code);
      return (this.form.code.length == 4 && isnum) ? true : false;
    }
  },
  mounted(){
    this.$root.$on('bv::modal::hide', async (bvEvent) => {
    if (bvEvent.target.id == "remove" && bvEvent.trigger == "ok"){
      await this.deleteVote();
    }
    })
  },
  created() {
    //<cookies code>
    var pointers = localStorage.getItem('participated');
    /*if(pointers != undefined && pointers.includes(this.$route.query.pointer)){
      this.showResults = true;
    }*/
    console.log("hi from voter"+this.showResults);
    
    //</cookies code>
  }
}
</script>
<style scoped>
  .wrapper {
      text-align: center;
      color: #772763;
  }
</style>

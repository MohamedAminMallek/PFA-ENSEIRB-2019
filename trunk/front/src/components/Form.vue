<template>
  <div class="mx-auto mt-3">
    <b-container v-if="show">
      <b-jumbotron>
        <template slot="header">
          Session {{ sessionID }}
        </template>
        <b-form @submit="onSubmit">
          <b-form-group id="candidateID"
                        label="Adresse e-mail * :"
                        label-for="">
            <b-form-input id="exampleInput1"
                          type="text"
                          v-model="form.candidateID"
                          v-on:change="candidateID = $event"
                          required
                          :state="regex.test(this.form.candidateID)"
                          :maxlength="50"
                          placeholder="tobozo@enseirb-matmeca.fr">
            </b-form-input>

          </b-form-group>

          <b-form-group id="projectTitle"
                        label="Titre du projet * :"
                        label-for="">
            <b-form-input id="exampleInput2"
                          type="text"
                          v-model="form.projectTitle"
                          v-on:change="projectTitle = $event"
                          required
                          :maxlength="100"
                          placeholder="Mon stage au milieu des alpagas">
            </b-form-input>
          </b-form-group>

          <!-- b-form-group id="description"
                        label="Description du projet (200 caractères maximum):"
                        label-for="">
            <b-form-input id="exampleInput3"
                          type="text"
                          :maxlength="200"
                          v-model="form.description"
                          placeholder="">
            </b-form-input>
          </b-form-group-->

          <p><small>* Champ obligatoire</small></p>
          <p><small>Attention, après l'envoie du formulaire, il ne sera plus possible de le modifier</small></p>

          <b-button type="submit"
                    variant="primary"
                    :disabled="form.projectTitle == undefined
                               || form.projectTitle == ''
                               || !regex.test(this.form.candidateID)">
          Enregistrer
          </b-button>

        </b-form>
      </b-jumbotron>
    </b-container>
    <div v-else>
      <h2>Vous avez bien été enregisté !</h2>
      <p>Voici le QR-code que vous devez afficher : (Pour le sauvegarder click droit sur le QR-Code -> enregister l'image sous)</p>
      <h2>Sauvegarder le, vous ne pourrez pas l'obtenir plus tard !</h2>
      <qrcode-vue
                  :value="[value]"
                  :size="size"
                  level="H"
                  :pageSetUp="pageSetUp"
                  :margin="margin">
      </qrcode-vue>
      <div>
        <p>Voici l'URL du QR-Code au cas où <p>
        <p>{{value}}</p>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios"
import QrcodeVue from '../QRCode';
const regex = RegExp('^[a-z0-9.-]+@+[a-z0-9-]+\.+(com|fr)');
var vid;
//const rg = this.$route.query.regexp
export default {
  data () {
    return {
      form: {
        candidateID: '',
        projectTitle: '',
        description: ''
      },
      sessionID: this.$route.query.pointer,
      show : true,
      value: '',
      size: 300,
      pageSetUp: [1,1],
      margin: 10,
      regex : RegExp('^[a-z0-9.-]+@+[a-z0-9-]+\.+(com|fr)')
    }
  },
  components: {
    QrcodeVue
  },
  methods: {
    async onSubmit (evt) {
      //evt.preventDefault();
      //alert(JSON.stringify(this.form));
      //console.log(this.$route.query.regexp);
      vid = this.generateRandomID();
      var test = await this.sendInfoBack();
      if(test){
        this.show = false;
        this.value = this.$http+"vote?cid="+this.form.candidateID+"&pointer="+this.sessionID+"&title="+this.form.projectTitle/*+"&description="+this.form.description*/;
      }else {
        alert("Un problème est survenu veuiller ré-essayer");
      }
    },
    async sendInfoBack() {

      var res = await axios.post(this.$http+'vote',
          {
              "candidatID": this.form.candidateID, "pointer": this.$route.query.pointer, "voterID": vid, "title": this.form.projectTitle
          },
          {
            headers : {'Access-Control-Allow-Origin': '*'}
          }
          )
          .then(response=>{console.log(response.data); return response;})

      if(!res) return false;
      res = await axios.post(this.$http+'deleteVote',
      {
          "voterID": vid, "pointer" : this.$route.query.pointer, "candidatID": this.form.candidateID
        },
        {
          headers : {'Access-Control-Allow-Origin': '*'}
        }
        )
        .then(response=>{return response.data.message != 'no'})
      return res
    },
    generateRandomID(){
      var d = new Date();
      var n = d.getTime();
      return "" + Math.floor(Math.random() * Math.floor(1000)) + n
    },
    transformRegExp(regExp){
      regExp.replace('%40', '@');
      regExp.replace('chap', '^');
      regExp.replace('chap', '^');
    }
  }
}
</script>

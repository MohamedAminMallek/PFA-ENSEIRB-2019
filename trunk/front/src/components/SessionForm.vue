<template>
  <div class="mx-auto mt-3">
    <b-form @submit.prevent>
      <b-form-group id="session-name"
                    label="Nom de la session :"
                    label-for="">
        <b-form-input id="exampleInput1"
                      type="text"
                      v-model="form.sessionName"
                      required
                      placeholder="Session X">
        </b-form-input>
      </b-form-group>
      <b-form-group id="session-pointer"
                    label="Identifiant de la session :"
                    label-for=""
                    description="Identifiant envoyé aux candidats">
        <b-form-input id="pointer"
                      type="text"
                      @change = "checkPointer()"
                      :disabled="(round==undefined)?false:!round.editable"
                      v-model="form.pointer"
                      required
                      placeholder="abc123">
        </b-form-input>
      </b-form-group>
      <b-form-group id="start-date"
                    label="Début session :"
                    label-for=""
                    description="Date et heure du début de la session">
        <b-row>
          <b-col md="6">
            <b-form-input id="start-day"
                          type="date"
                          v-model="form.start.date"
                          @change = "checkStartDate()"
                          required>
            </b-form-input>
            <label style="color : red; padding-left : 3%;visibility: hidden;display : none" id="startDate" >
            {{error1}}
            </label>
          </b-col>
          <b-col>
            <b-form-input id="start-hour"
                          type="time"
                          v-model="form.start.hour"
                          required>
            </b-form-input>
          </b-col>
        </b-row>
      </b-form-group>
      <b-form-group id="end-date"
                    label="Fin session :"
                    label-for=""
                    description="Date et heure de la fin de la session">
        <b-row>
          <b-col md="6">
            <b-form-input id="end-day"
                          type="date"
                          v-model="form.end.date"
                          @change = "checkEndDate()"
                          required>
            </b-form-input>
            <label style="color : red; padding-left : 3%;visibility: hidden;display : none" id="endDate" >
            {{error1}}
            </label>
          </b-col>
          <b-col>
            <b-form-input id="end-hour"
                          type="time"
                          v-model="form.end.hour"
                          required>
            </b-form-input>
          </b-col>
        </b-row>
      </b-form-group>
      <div class="mx-auto mt-3">
      <b-row>
        <b-col>
          <b-button type="submit" v-on:click="$emit('submit', form)" variant="primary">Suivant</b-button>
        </b-col>
        <b-col>
          <b-button variant="danger" to="/">Retour</b-button>
        </b-col>
      </b-row>
    </div>
    </b-form>
  </div>
</template>

<script>
import axios from 'axios';
//import { constants } from 'http2';

export default {
  data () {
    return {
      error1 : 'Ce champ est incorrect. Merci de vérifier votre saisie',
      pointers : [],
      form: {
        start: { date: '', hour: '' },
        end: { date: '', hour: '' },
        sessionName: '',
        pointer: ''
      }
    }
  },
  props: {round : Object},
  methods: {
    checkEndDate()
    {
      if(this.form.end.date!= ''){
        let d1 = new Date()
        let d2 = new Date(this.form.end.date)
        let d3 = new Date(this.form.start.date)
        if(d1.getTime()>d2.getTime() || (this.form.start.date!= undefined && d3.getTime()>d2.getTime()))
        {  
          document.getElementById("endDate").style.visibility= "visible"
          document.getElementById("endDate").style.display = 'block';
        }else{
          document.getElementById("endDate").style.visibility= "hidden"
          document.getElementById("endDate").style.display = 'none';
        }
      }
    },
    checkStartDate()
    {
      if(this.form.start.date!= ''){
        let d1 = new Date()
        let d2 = new Date(this.form.start.date)
        if(d1.getTime()>d2.getTime()){
          document.getElementById("startDate").style.visibility= "visible"
          document.getElementById("startDate").style.display = 'block';
        }else{
          document.getElementById("startDate").style.visibility= "hidden"
          document.getElementById("startDate").style.display = 'none';
        }
      } 
        
    },
    getDay(dateStr) {
      let date = new Date(dateStr);
      let month = date.getUTCMonth() + 1;
      let day = date.getUTCDate();
      return date.getUTCFullYear()
             +(month < 10 ? "-0" : "-") + month
             +(day < 10 ? "-0" : "-") + day;
    },
    getHour(dateStr) {
      let date = new Date(dateStr);
      let hour = date.getUTCHours();
      let minute = date.getUTCMinutes();
      return (hour < 10 ? "0" : "") + hour
             +(minute < 10 ? ":0" : ":") + minute;
    },
    checkPointer()
    {

      let array = Object.values(this.pointers)
      var pos = array.map(e=> e.pointer).indexOf(this.form.pointer)

      if(pos>=0)
      {
        alert("Attention : L'identifiant de la session est déja utilisé !")
        this.form.pointer = ""
      }
    },
    async getPointers()
    {
      let url  = this.$http;
      await axios.get(url + "pointers")
      .then(res=>{this.pointers = res.data})
    }
  },
  watch: {
    round() {
      if (this.round != null) {
        this.form.start.date = this.getDay(this.round.startDate);
        this.form.start.hour = this.getHour(this.round.startDate);
        this.form.end.date = this.getDay(this.round.endDate);
        this.form.end.hour = this.getHour(this.round.endDate);
        this.form.sessionName = this.round.Session.title;
        this.form.pointer = this.round.pointer;
      }
    }
    
  },
  created(){
    this.getPointers()
  }
}
</script>
<template>
<div>
  <b-form>
    <b-form-group id="urlQRCode"
                  label="Url du QR-Code à générer :"
                  label-for="">
              <b-form-input id="example"
                            type="text"
                            v-model="url"
                            required
                            placeholder="http://example.com">
              </b-form-input>
    </b-form-group>

    <b-button type="submit"
              variant="primary"
              v-on:click="value = [url]; show = true;"
              >
              Générer
    </b-button>

  </b-form>

  <qrcode-vue v-if="show"
              :value="value"
              :size="size"
              level="H"
              :pageSetUp="pageSetUp"
              :margin="margin">
  </qrcode-vue>
</div>
</template>
<script>
import QrcodeVue from '../QRCode';

export default {
  data() {
    return {
      value: [],
      size: 300,
      pageSetUp: [1,1],
      margin: 10,
      show : false,
      url : ''
    }
  },
  components: {
    QrcodeVue
  }
}
</script>>

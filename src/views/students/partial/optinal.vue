<template>
  <div class="card">
    <div class="card-body py-3 mb-1">
      <form
        class="needs-validation"
        data-vv-scope="bts-form"
        @submit.prevent="handleProfileSubmit('bts-form')"
      >
        <div class="row">
          <div class="col-md-12 mx-auto">
            <ACheckBox class="mb-3" v-model="smodel.isActive">Aktif</ACheckBox>
          </div>
        </div>
        <div class="row">
          <div class="col-md-12 mx-auto">
            <div class="text-center">
              <label> Yakınlık </label>
              <multiselect v-model="smodel.family" track-by="name" label="name" :multiple="false" :options="optionsFamily" :searchable="true" :allow-empty="false"></multiselect>
              <br>
              <label> Cinsiyet </label>
              <multiselect v-model="smodel.gender" track-by="name" label="name" :multiple="false" :options="optionsGender" :searchable="true" :allow-empty="false"></multiselect>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-md-12">
            <br>
            <label> Adres</label>
            <textarea v-model="smodel.address" class="form-control form-control-alternative" rows="2" placeholder="Adres..."></textarea>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>
<script>
import { required } from "vuelidate/lib/validators";
import Multiselect from 'vue-multiselect'
export default {
  components: {
    Multiselect
  },
  props: {
    smodel: {
      type: Object,
      default: () => ({})
    }
  },
  methods: {
    getSelected(data, type) {

    }
  },
  watch: {
   async smodel(){
      const gender = await this.optionsGender.find(g=>g.code === this.smodel.gender);
      const family  = await this.optionsFamily.find(f=>f.code === this.smodel.family);
      this.smodel.gender = await gender;
      this.smodel.family = await family;
    }
  },
  async created(){
    const gender = await this.optionsGender.find(g=>g.code === this.smodel.gender);
    const family  = await this.optionsFamily.find(f=>f.code === this.smodel.family);
    this.smodel.gender = await gender;
    this.smodel.family = await family;
  },
  data() {
    return {
      optionsGender: [
        { name: "Kadın", code: 0 },
        { name: "Erkek", code: 1 }
      ],
      optionsFamily: [
        { name: "Beraber", code: 1 },
        { name: "Ayrı", code: 0 }
      ]
    };
  }
};
</script>

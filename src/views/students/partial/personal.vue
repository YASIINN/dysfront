<template>
  <ACard type="frame">
    <div class="row">
      <div class="col-md-6">
        <AInput v-model="$v.smodel.name.$model" label="Adı" placeholder="Adı" :class="status($v.smodel.name)"/>
          <div class="error" v-if="!$v.smodel.name.minLength">Adı alanı en az {{$v.smodel.name.$params.minLength.min}} karakter olmalıdır.</div>
      </div>
      <div class="col-md-6">
           <AInput v-model="$v.smodel.surname.$model" label="Soyadı" placeholder="Soyadı" :class="status($v.smodel.surname)"/>
          <div class="error" v-if="!$v.smodel.surname.minLength">Soyadı alanı en az {{$v.smodel.surname.$params.minLength.min}} karakter olmalıdır.</div>
      </div>
    </div>

    <div class="row">
      <div class="col-md-6">
        <AInput v-model="smodel.schoolNo" label="Okul No" placeholder="Okul No" />
      </div>
      <div class="col-md-6">
        <Label>Doğum Tarihi</Label>
        <d-picker :mode="'single'" :minDate="'1980-01-01'" @picker="getPicker"></d-picker>
      </div>
    </div>
    <div class="row">
      <div class="col-md-6">
        <AInput v-model="$v.smodel.email.$model" label="E-Posta" placeholder="Email" :class="status($v.smodel.email)"/>
          <div class="error" v-if="!$v.smodel.email.email">Geçerli bir email girilmelidir.</div>
      </div>
      <div class="col-md-6">
           <AInput v-model="$v.smodel.tc.$model" label="Tc No" placeholder="Tc No" :class="status($v.smodel.tc)"/>
          <div class="error" v-if="!$v.smodel.tc.minLength">Tc Kimlik No {{$v.smodel.tc.$params.minLength.min}} haneden oluşur.</div>
           <div class="error" v-if="!$v.smodel.tc.numeric">Lütfen sadece rakam giriniz.</div>
           <div class="error" v-if="!$v.smodel.tc.tcCheck">Lütfen geçerli bir TC giriniz.</div>
      </div>
    </div>

    <div class="row">
      <div class="col-md-6">
        <Label>Cep Tel</Label>
          <masked-input mask="\0 (111) 111-11-11" class="form-control" placeholder="Cep Tel"
                              v-model="smodel.gsm"
                />
      </div>
      <div class="col-md-6">
          <Label>Ev Tel</Label>
          <masked-input mask="\0 (111) 111-11-11" class="form-control" placeholder="Ev Tel"
                              v-model="smodel.h_phone"
                />
      </div>
    </div>
  </ACard>
</template>
<script>
import { required,  minLength, maxLength, between, helpers, numeric, email } from "vuelidate/lib/validators";
import DPicker from "@/components/activity/DPicker";
import MaskedInput from 'vue-masked-input'
 import appPlugin from "@/Providers/appPlugins";
import { mapGetters } from "vuex";
export default {
  props: {
    smodel: {
      type: Object,
      default: () => ({})
    }
  },
  components: {
    DPicker,  MaskedInput,
  },
   validations: {
    smodel: {
      name: {
        required,
        minLength: minLength(3),
      },
      surname: {
        required,
        minLength: minLength(3),
      },
      email: {
        email
      },
      tc: {
          numeric,
          required,
          minLength: minLength(11),
          maxLength: maxLength(11),
          tcCheck: appPlugin.checktc
      }
    }
  },
  watch: {
    smodel: {
      deep: true,
      handler(){
        this.$emit("vld", this.$v);
      }
    }
  },
  methods: {
    getPicker(birthday) {
      this.smodel.birthday = birthday;
    },
    status(validation) {
    	return {
      	error: validation.$error,
        dirty: validation.$dirty
      }
    },
  },
  data() {
    return {
      submitStatus: null,
    };
  }
};
</script>
<style>
input {
  border: 1px solid silver;
  border-radius: 4px;
  background: white;
  padding: 5px 10px;
}

.dirty {
  border-color: #5A5;
  background: #EFE;
}

.dirty:focus {
  outline-color: #8E8;
}

.error {
  color: red;
  font-size: 12px;
  border-color: #ffffff;
  background: #fff;
}

.error:focus {
  outline-color: #F99;
}

</style>
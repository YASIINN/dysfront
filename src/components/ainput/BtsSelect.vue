<template>
    <div>
  <multiselect v-model="value" track-by="name" label="name" :disabled="disabled" :multiple="multiple" placeholder="Seçiniz" :options="options" :searchable="false" :allow-empty="true">
    <template slot="singleLabel" slot-scope="{ option }"><strong>{{ option.name }}</strong></template>
  </multiselect>
</div>
</template>
<script>
import Multiselect from 'vue-multiselect'

export default {
  name: "BtsSelect",
  components: {
    Multiselect
  },
  props: {
    options: {
      type:Array,
      default: ()=>([{name: 'Seçiniz'}])
    },
    type: {
      type: String,
      default: "",
    },
    disabled: {
      type: Boolean,
      default: false
    },
    susage: {
      type: Boolean,
      default: true,
    },
    defaultOpt:{
      type: [Object, Array],
      default: ()=>({name: "Seçiniz"})
    },
    multiple: {
      type: Boolean,
      default: false,
    }
  },
  watch: {
    value(){
      this.$emit("selected", this.value, this.type, this.susage);
    }
  },
  data () {
    return {
      value: this.multiple ? null : this.defaultOpt || null,
    }
  }
}
</script>
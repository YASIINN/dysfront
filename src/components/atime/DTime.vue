<template>
    <base-input addon-left-icon="ni ni-calendar-grid-58">
    <flat-picker slot-scope="{focus, blur}"
                 @on-open="focus"
                 @on-close="blur"
                 :config="config"
                 class="form-control datepicker"
                 v-model="time">
    </flat-picker>
</base-input>
</template>
<script>
import flatPicker from "vue-flatpickr-component";
import "flatpickr/dist/flatpickr.css";
import BaseInput from "@/components/ainput/BaseInput";
import { Turkish } from 'flatpickr/dist/l10n/tr.js';
import { English } from 'flatpickr/dist/l10n/default.js';
    export default {
      props: {
        config: {
            type: Object,
            default: ({})
        },
        type: {
            type: String,
            default: "",

        },
        local: {
          type: Boolean,
          default: false
        }
      },
        components: {
            BaseInput, flatPicker
        },
      data() {
        return {
            time: "",
            locale: !this.local ? Turkish : English,
        };
      },
      watch: {
         time(){
          this.$emit("picker", this.time, this.type);
        }
      },
    };
</script>
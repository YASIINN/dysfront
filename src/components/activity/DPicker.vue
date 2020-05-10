<template>
    <base-input addon-left-icon="ni ni-calendar-grid-58">
    <flat-picker slot-scope="{focus, blur}"
                 @on-open="focus"
                 @on-close="blur"
                 :config="{mode: mode, minDate: minDate,  dateFormat: 'Y-m-d', locale: locale, defaultDate: 'today'}"
                 class="form-control datepicker"
                 v-model="range">
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
        mode: {
          type: String,
          default: 'range',
        },
        minDate: {
          type: String,
          default: "today",
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
            range: "",
            locale: !this.local ? Turkish : English,
        };
      },
      watch: {
        range(){
          this.$emit("picker", this.range);
        }
      },
    };
</script>
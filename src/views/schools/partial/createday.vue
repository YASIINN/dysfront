<template>
  <div>
    <Loading v-if="loading"></Loading>
    <flex-card column="col-lg-12" :headerTitle="header">
      <div class="card-body">
        <div>
          <div class="row">
            <div class="col-md-10">
              <div class="form-group">
                <div class="input-group input-group-merge">
                  <multiselect
                    v-model="selectedDays"
                    track-by="dayName"
                    @close="onTouch"
                    :allow-empty="false"
                    label="dayName"
                    selectedLabel="Seçili"
                    selectLabel="Seç"
                    :hide-selected="false"
                    :multiple="true"
                    deselectLabel
                    :options="allDays"
                    :searchable="true"
                    :close-on-select="true"
                    :show-labels="true"
                    placeholder="Gün Seçiniz"
                  ></multiselect>
                  <small v-if="isInvalid" style="color: red">Lütfen Gün Seçiniz</small>
                </div>
              </div>
            </div>
            <div class="col-md-2">
              <v-button
                :btnIcon="'fa-plus-circle'"
                :className="'btn-primary'"
                :btnName="$t('add')"
                @onClick="onCreateHandler($event)"
              ></v-button>
            </div>
          </div>
        </div>
      </div>
    </flex-card>
  </div>
</template>

<script>
  import { days } from '@/Providers/appConstants'
  import {
    Swal,
    SearchBox,
    Loading,
    VSelect,
    AlertBox,
    FlexCard,
    Flex,
    VButton,
    VTabs,
    VTabContent,
    Multiselect,
    VTooltipButton,
    Vuetable,
    VuetablePaginationBootstrap,
    VuetablePaginationInfo,
    appPlugin
  } from '@/Providers/defaultImports'
  import loadingMixins from '@/mixins/loading'

  export default {
    mixins: [loadingMixins],
    props: {
      header: {}
    },
    computed: {
      isInvalid () {
        return this.isTouched && this.selectedDays.length < 1
      }
    },
    methods: {
      onCreateHandler () {
        this.selectedDays.forEach((day) => {
          day.sptypeid = this.$route.params.id
        })
        this.onOpenIndıcator()
        this.$store.dispatch('createSchoolDays', { daysList: this.selectedDays }).then((res) => {
          appPlugin.showalert(
            this.$t('succescreatemessage'),
            '',
            'success',
            this.$t('ok')
          )
          this.$emit('onReset', true)
        }).catch((err) => {
          appPlugin.showalert(
            this.$t('errorcreatemessage'),
            '',
            'error',
            this.$t('ok')
          )
        })
        this.onCloseIndıcator()
      },
      onTouch () {
        this.isTouched = true

      }
    },
    data () {
      return {
        allDays: days,
        selectedDays: days,
        isTouched: false
      }
    },
    name: 'createday',
    components: {
      AlertBox,
      Multiselect,
      VSelect,
      VTabs,
      FlexCard,
      Flex,
      VTabContent,
      SearchBox,
      Loading,
      VButton,
      VTooltipButton,
      Vuetable,
      VuetablePaginationBootstrap,
      VuetablePaginationInfo
    }
  }
</script>

<style scoped>

</style>

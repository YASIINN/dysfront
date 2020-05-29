<template>
  <div>
    <Loading v-if="loading"></Loading>
    <flex-card column="col-md-12 col-sm-12 col-lg-12 col-sm-12 col-lg-12" :headerTitle="$t('personelImg')"
               v-if="createPerson">
      <div class="card-body">
        <div class="card-body tex-center d-flex align-items-center flex-column">
          <a
            v-if="personData.file"
            @click="deleteImg"
            aria-pressed="true"
            class="btn btn-danger"
            role="button"
          >{{$t('delimg')}}</a>
          <br/>
          <img :src="personData.fileprew" id="personImgInput" width="200" height="200"/>
          <br/>
          <input
            @change="onChange($event)"
            accept="image/*"
            class="form-control"
            ref="file"
            style="display: none;"
            type="file"
          />
          <a
            @click="$refs.file.click()"
            aria-pressed="true"
            class="btn btn-success"
            role="button"
          >Resim Seç</a>
        </div>
      </div>
    </flex-card>
    <flex-card column="col-md-12 col-sm-12 col-lg-12 col-sm-12 col-lg-12" :headerTitle="$t('personelInformation')"
               v-if="createPerson">
      <div class="card-body">
        <div class="row">
          <div class="col-md-6 col-sm-6 col-lg-6">
            <div class="form-group" :class="{ 'has-danger': $v.personData.personName.$error }">
              <label>{{$t('personNamePlaceHolderMsg')}}</label>
              <div class="input-group input-group-merge">
                <v-input
                  :inputType="'text'"
                  :className="{ 'is-invalid': $v.personData.personName.$error }"
                  @onBlurInput="$v.personData.personName.$touch"
                  v-model.trim="$v.personData.personName.$model"
                  :placeHolder="$t('personNamePlaceHolderMsg')"
                ></v-input>
                <div class="input-group-prepend">
                  <span class="input-group-text">
                    <i
                      class="fas fa-user"
                      :style="{'color':$v.personData.personName.$error?'red':''}"
                    ></i>
                  </span>
                </div>
                <div class="invalid-feedback">
                  <small v-if="!$v.personData.personName.required">{{$t('personNameRequiredMsg')}}</small>
                </div>
              </div>
            </div>
          </div>
          <div class="col-md-6 col-sm-6 col-lg-6">
            <div class="form-group" :class="{ 'has-danger': $v.personData.personLastName.$error }">
              <label>{{$t('personSurNamePlaceHolderMsg')}}</label>
              <div class="input-group input-group-merge">
                <v-input
                  :inputType="'text'"
                  :className="{ 'is-invalid': $v.personData.personLastName.$error }"
                  @onBlurInput="$v.personData.personLastName.$touch"
                  v-model.trim="$v.personData.personLastName.$model"
                  :placeHolder="$t('personSurNamePlaceHolderMsg')"
                ></v-input>

                <div class="input-group-prepend">
                  <span class="input-group-text">
                    <i
                      class="fas fa-user"
                      :style="{'color':$v.personData.personLastName.$error?'red':''}"
                    ></i>
                  </span>
                </div>
                <div class="invalid-feedback">
                  <small
                    v-if="!$v.personData.personLastName.required"
                  >{{$t('personLastNameRequiredMsg')}}</small>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="row">
          <div class="col-md-6 col-sm-6 col-lg-6">
            <div class="form-group" :class="{ 'has-danger': $v.personData.email.$error }">
              <label>{{$t('personEmailPlaceHolderMsg')}}</label>
              <div class="input-group input-group-merge">
                <v-input
                  :inputType="'text'"
                  :className="{ 'is-invalid': $v.personData.email.$error }"
                  @onBlurInput="$v.personData.email.$touch"
                  v-model.trim="$v.personData.email.$model"
                  :placeHolder="$t('personEmailPlaceHolderMsg')"
                ></v-input>
                <div class="input-group-append">
                  <span class="input-group-text">
                    <i
                      class="fas fa-envelope"
                      :style="{'color':$v.personData.email.$error?'red':''}"
                    ></i>
                  </span>
                </div>
                <div class="invalid-feedback">
                  <small v-if="!$v.personData.email.required">{{$t('personEmailRequiredMsg')}}</small>
                  <small v-if="!$v.personData.email.email">{{$t('personCorretEmailMsg')}}</small>
                </div>
              </div>
            </div>
          </div>
          <div class="col-md-6 col-sm-6 col-lg-6">
            <div class="form-group" :class="{ 'has-danger': $v.personData.phone.$error }">
              <label>{{$t('personPhonePlaceHolderMsg')}}</label>
              <div class="input-group input-group-merge">
                <masked-input
                  mask="\0 (111) 111-11-11"
                  @blur="$v.personData.phone.$touch"
                  v-model.trim="$v.personData.phone.$model"
                  :className="{ 'is-invalid': $v.personData.phone.$error }"
                  class="form-control"
                  :placeholder="$t('personPhonePlaceHolderMsg')"
                />
                <div class="input-group-append">
                  <span class="input-group-text">
                    <i class="fas fa-phone" :style="{'color':$v.personData.phone.$error?'red':''}"></i>
                  </span>
                </div>
                <div class="invalid-feedback">
                  <small v-if="!$v.personData.phone.required">{{$t('personPhoneRequiredMsg')}}</small>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="row">
          <div class="col-md-6 col-sm-6 col-lg-6">
            <div class="form-group" :class="{ 'has-danger': $v.personData.email.$error }">
              <label>{{$t('personTCPlaceHolder')}}</label>
              <div class="input-group input-group-merge">
                <v-input
                  :inputType="'text'"
                  :className="{ 'is-invalid': $v.personData.utc.$error }"
                  @onBlurInput="$v.personData.utc.$touch"
                  v-model.trim="$v.personData.utc.$model"
                  :placeHolder="$t('personTCPlaceHolder')"
                ></v-input>
                <div class="input-group-append">
                  <span class="input-group-text">
                    <i
                      class="fas fa-sort-numeric-up"
                      :style="{'color':$v.personData.utc.$error?'red':''}"
                    ></i>
                  </span>
                </div>
                <div class="invalid-feedback">
                  <small v-if="!$v.personData.utc.tcValidators">{{$t('personCorrectTc')}}</small>
                  <br/>
                  <small v-if="!$v.personData.utc.numeric">{{$t('personNumberTc')}}</small>
                  <br/>
                  <small v-if="!$v.personData.utc.required">{{$t('personTcRequiredMsg')}}</small>
                  <br/>
                  <small v-if="!$v.personData.utc.minLength">{{$t('personTCLengthMsg')}}</small>
                  <br/>
                  <small v-if="!$v.personData.utc.maxLength">{{$t('personTCLengthMsg')}}</small>
                </div>
              </div>
            </div>
          </div>
          <div class="col-md-6 col-sm-6 col-lg-6">
            <label>{{$t('personelGenderPlaceHolderMsg')}}</label>
            <div class="custom-control custom-radio mb-3">
              <input
                name="custom-radio-1"
                class="custom-control-input"
                v-model="$v.personData.gender.$model"
                value="1"
                id="custom-radio-1"
                type="radio"
              />
              <label class="custom-control-label" for="custom-radio-1">{{$t('man')}}</label>
            </div>
            <div class="custom-control custom-radio mb-3">
              <input
                name="custom-radio-2"
                class="custom-control-input"
                v-model="$v.personData.gender.$model"
                value="0"
                id="custom-radio-2"
                type="radio"
              />
              <label class="custom-control-label" for="custom-radio-2">{{$t('woman')}}</label>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-md-6 col-sm-6 col-lg-6">
            <div class="form-group">
              <label>{{$t('personOtherPhonePlaceHolderMsg')}}</label>
              <div class="input-group input-group-merge">
                <masked-input
                  mask="\0 (111) 111-11-11"
                  class="form-control"
                  v-model="personData.otherphone"
                  :placeholder="$t('personOtherPhonePlaceHolderMsg')"
                />
                <div class="input-group-append">
                  <span class="input-group-text">
                    <i class="fas fa-phone"></i>
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div class="col-md-6 col-sm-6 col-lg-6">
            <div class="form-group" :class="{ 'has-danger': $v.personData.adress.$error }">
              <label>{{$t('personAdressPlaceHolderMsg')}}</label>
              <div class="input-group input-group-merge">
                <textarea
                  class="form-control"
                  id="exampleFormControlTextarea1"
                  @blur="$v.personData.adress.$touch"
                  v-model.trim="$v.personData.adress.$model"
                  :className="{ 'is-invalid': $v.personData.adress.$error }"
                  rows="3"
                  :placeholder="$t('personAdressPlaceHolderMsg')"
                ></textarea>
                <div class="input-group-append">
                  <span class="input-group-text">
                    <i
                      class="fas fa-map-marker"
                      :style="{'color':$v.personData.adress.$error?'red':''}"
                    ></i>
                  </span>
                </div>
                <div class="invalid-feedback">
                  <small v-if="!$v.personData.adress.required">{{$t('personAdressRequiredMsg')}}</small>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-md-6 col-sm-6 col-lg-6">
            <div class="form-group">
              <label>{{$t('personelTitlePlaceHolderMsg')}}</label>
              <div class="input-group input-group-merge">
                <v-select
                  :className="{'is-invalid':$v.personData.titleid.$error}"
                  v-model.trim="$v.personData.titleid.$model"
                  :propName="'tName'"
                  :bindData="'id'"
                  @onBlur="$v.personData.titleid.$touch"
                  :optionData="$store.getters.getTitles"
                ></v-select>
                <div class="input-group-append">
                  <span class="input-group-text">
                    <i
                      class="fas fa-check"
                      :style="{'color':$v.personData.titleid.$error?'red':''}"
                    ></i>
                  </span>
                </div>
                <div class="invalid-feedback">
                  <small v-if="!$v.personData.titleid.required">{{$t('personTitleRequiredMsg')}}</small>
                </div>
              </div>
            </div>
          </div>
          <div class="col-md-6 col-sm-6 col-lg-6">
            <div class="form-group">
              <label>{{$t('personelProvincePlaceHolderMsg')}}</label>
              <div class="input-group input-group-merge">
                <v-select
                  :className="{'is-invalid':$v.personData.provinceid.$error}"
                  v-model.trim="$v.personData.provinceid.$model"
                  :propName="'pName'"
                  :bindData="'id'"
                  @onBlur="$v.personData.provinceid.$touch"
                  :optionData="$store.getters.getProvince"
                ></v-select>
                <div class="input-group-append">
                  <span class="input-group-text">
                    <i
                      class="fas fa-check"
                      :style="{'color':$v.personData.provinceid.$error?'red':''}"
                    ></i>
                  </span>
                </div>
                <div class="invalid-feedback">
                  <small
                    v-if="!$v.personData.provinceid.required"
                  >{{$t('personProvinceRequiredMsg')}}</small>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-md-6 col-sm-6 col-lg-6">
            <div class="form-group">
              <label>{{$t('personelUnitsPlaceHolderMsg')}}</label>
              <div class="input-group input-group-merge">
                <v-select
                  :className="{'is-invalid':$v.personData.unitsid.$error}"
                  v-model.trim="$v.personData.unitsid.$model"
                  :propName="'uName'"
                  :bindData="'id'"
                  @onBlur="$v.personData.unitsid.$touch"
                  :optionData="$store.getters.getUnits"
                ></v-select>
                <div class="input-group-append">
                  <span class="input-group-text">
                    <i
                      class="fas fa-check"
                      :style="{'color':$v.personData.unitsid.$error?'red':''}"
                    ></i>
                  </span>
                </div>
                <div class="invalid-feedback">
                  <small v-if="!$v.personData.unitsid.required">{{$t('personUnitsRequiredMsg')}}</small>
                </div>
              </div>
            </div>
          </div>
          <div class="col-md-6 col-sm-6 col-lg-6">
            <div class="form-group">
              <label>{{$t('personbirthday')}}</label>
              <div class="input-group input-group-alternative">
                <div class="input-group-prepend">
                  <span class="input-group-text">
                    <i class="fa fa-calendar-day"></i>
                  </span>
                </div>
                <datetime
                  input-class="form-control"
                  :week-start="7"
                  v-model="personData.birthday"
                  :phrases="{ok: 'Seç', cancel: 'Vazgeç'}"
                ></datetime>
              </div>
            </div>
            <label>{{$t('notificationType')}}</label>
            <div class="custom-control custom-checkbox mb-3">
              <input
                class="custom-control-input"
                id="customCheck11"
                v-model="personData.notificationType.sms"
                type="checkbox"
              />
              <label class="custom-control-label" for="customCheck11">{{$t('getsmsnotifications')}}</label>
            </div>
            <div class="custom-control custom-checkbox mb-3">
              <input
                class="custom-control-input"
                id="customCheck22"
                v-model="personData.notificationType.email"
                type="checkbox"
              />
              <label class="custom-control-label" for="customCheck22">{{$t('getmailnotifications')}}</label>
            </div>
          </div>
        </div>

        <flex column="col-md-12 col-sm-12 col-lg-12">
          <div class="form-group">
            <v-button
              :className="'btn btn-success float-right'"
              :btnIcon="'fa-plus-circle'"
              :disabled="$v.personData.$invalid"
              @onClick="personCreteControl"
              :btnName="$t('addperson')"
            ></v-button>
            <br/>
            <br/>
            <br/>
            <br/>
          </div>
        </flex>
      </div>
    </flex-card>
    <flex-card column="col-md-12  col-sm-12 col-lg-12" v-if="user.id">
      <div class="card-header">
        <alert
          class="alert-success"
          iconName="fa fa-check-circle"
          v-if="showAlert"
          @onClose="onCloseAlert($event)"
        >
          <router-link
            tag="a"
            target="_blank"
            :to="'/userdetail/'+this.user.id"
            style="color: white !important;"
          >
            {{personSuccesTxt}}
            Buraya Tıklayarak {{user.uName.toUpperCase() + ' ' + user.uSurname.toUpperCase()}} Personel
            Bilgilerine Ulaşabilirsiniz.
          </router-link>
        </alert>
        <h3
          class="mb-0"
        >{{user.uName.toUpperCase() + ' ' + user.uSurname.toUpperCase()}} ' Görev Bilgilerini Ekle</h3>
        <v-button
          :btnIcon="'fa-plus-circle'"
          :className="'btn-primary float-right'"
          :btnName="'Personel Ekleme Ekranına Dön'"
          @onClick="newPersonAdded"
        ></v-button>
      </div>
      <div class="card-body">
        <flex column="col-md-12 col-sm-12 col-lg-12">
          <v-tabs @onActiveTab="getActiveTabs($event)">
            <v-tab-content title="Okulda Görevli" icon="fa fa-user" tabKey="schools">
              <school-task-create :user="user"></school-task-create>
            </v-tab-content>
            <v-tab-content title="Spor Kulubünde Görevli" icon="fas fa-school" tabKey="sporclub">
              <flex-card column="col-md-12   col-sm-12 col-lg-12">
                <spor-club-task-create :user="user"></spor-club-task-create>
              </flex-card>
            </v-tab-content>
            <v-tab-content title="Faaliyetlerde Görevli" icon="fas fa-school" tabKey="activity">
              <flex-card column="col-md-12  col-sm-12 col-lg-12">
                <activity-task-create :user="user"></activity-task-create>
              </flex-card>
            </v-tab-content>
          </v-tabs>
        </flex>
      </div>
    </flex-card>
    <flex-card column="col-md-12 col-sm-12 col-lg-12" v-if="personData.status.school">
      <div class="card-wrapper">
        <div class="card">
          <div class="card-header">
            <h3 class="mb-0">{{$t('personSchoolInformation')}}</h3>
          </div>
          <div class="card-body">
            <flex column="col-md-12 col-sm-12 col-lg-12">
              <label>{{$t('persontaskschools')}}</label>
              <div class="form-group">
                <multiselect
                  v-model="personSchoolData"
                  track-by="sName"
                  @close="onTouch"
                  @input="onChangeSchool"
                  :allow-empty="false"
                  label="sName"
                  selectedLabel="Seçili"
                  selectLabel="Seç"
                  :hide-selected="false"
                  :multiple="false"
                  deselectLabel
                  :options="$store.getters.getSchools"
                  :searchable="true"
                  :close-on-select="true"
                  :show-labels="true"
                  placeholder="Okul Seçiniz"
                ></multiselect>
                <small v-if="isInvalid" style="color: red">{{$t('personselectschool')}}</small>
              </div>
            </flex>

            <flex-card v-if="personSchoolData.sName" column="col-md-12 col-sm-12 col-lg-12">
              <label
                v-if="personSchoolData.sName"
              >{{personSchoolData.sName}} Görevli Olduğu Sınıflar</label>
              <div class="form-group">
                <multiselect
                  v-model="personClasesData"
                  track-by="cbName"
                  @close="onTouch"
                  :allow-empty="true"
                  label="cbName"
                  selectedLabel="Seçili"
                  selectLabel="Seç"
                  :hide-selected="false"
                  :multiple="true"
                  deselectLabel
                  :options="schoolClasBranchData"
                  :searchable="true"
                  :close-on-select="false"
                  :show-labels="true"
                  placeholder="Sınıf Seçiniz"
                ></multiselect>
                <small v-if="isInvalid" style="color: red">{{$t('pleaseselectclass')}}</small>
              </div>
            </flex-card>

            <flex-card v-if="personSchoolData.sName" column="col-md-12 col-sm-12 col-lg-12">
              <label v-if="personSchoolData.sName">{{personSchoolData.sName}} Görevli Olduğu Dersler</label>
              <div class="form-group">
                <multiselect
                  v-model="personLessonData"
                  track-by="lName"
                  @close="onTouch"
                  :allow-empty="true"
                  label="lName"
                  selectedLabel="Seçili"
                  selectLabel="Seç"
                  :hide-selected="false"
                  :multiple="true"
                  deselectLabel
                  :options="schoolLessonsData"
                  :searchable="true"
                  :close-on-select="false"
                  :show-labels="true"
                  placeholder="Ders Seçiniz"
                ></multiselect>
                <small v-if="isInvalid" style="color: red">{{$t('pleaseselectlesson')}}</small>
              </div>
            </flex-card>

            <div class="row" v-if="personData.schools.length>0">
              <div class="card-header">
                <h3 class="mb-0"></h3>
              </div>
              <table class="table table-striped table-responsive table-bordered">
                <thead>
                <th>Görevli Olduğu Okul</th>
                <th>Görevli Olduğı Sınıflar</th>
                <th>Görevli Olduğu Dersler</th>
                </thead>
                <tbody>
                <tr v-for="item in personData.schools">
                  <td>{{item.sName}}</td>
                  <td>
                    <ul>
                      <li v-for="cls in item.clases">{{cls.cbName}}</li>
                    </ul>
                  </td>
                  <td>
                    <ul>
                      <li v-for="lesson in item.lessons">{{lesson.lName}}</li>
                    </ul>
                  </td>
                </tr>
                </tbody>
              </table>
            </div>
            <flex-card column="col-md-12 col-sm-12 col-lg-12">
              <v-button
                :btnIcon="'fa-plus-circle'"
                :className="'btn-primary'"
                :btnName="$t('addnewschool')"
                @onClick="addNewSchool"
              ></v-button>
            </flex-card>
          </div>
        </div>
      </div>
    </flex-card>

    <flex-card
      v-if="personData.status.sporclub"
      column="col-md-12 col-sm-12 col-lg-12 "
      :headerTitle="$t('personSporClubInformation')"
    >
      <div class="card-body">sa</div>
    </flex-card>
    <flex-card
      v-if="personData.status.activity"
      column="col-md-12 col-sm-12 col-lg-12 "
      :headerTitle="$t('personActivityInformation')"
    >
      <div class="card-body">Test</div>
    </flex-card>
  </div>
</template>

<script>
  import _ from 'underscore'
  import Alert from '@/components/alert'
  import moment from 'moment'
  import {
    required,
    email,
    minLength,
    maxLength,
    numeric
  } from 'vuelidate/lib/validators'
  import { Datetime } from 'vue-datetime'
  import tooltip from '@/components/tooltip'
  import SchoolTaskCreate from './partial/schooltaskcreate'
  import ActivityTaskCreate from './partial/activitytaskcreate'
  import SporClubTaskCreate from './partial/sporclubtaskcreate'
  import defaultImage from '@/assets/img/defaultavatar.png'
  import {
    VTabs,
    FlexCard,
    VTabContent,
    MaskedInput,
    SearchBox,
    Loading,
    Multiselect,
    VSelect,
    Flex,
    VButton,
    VInput,
    VTooltipButton,
    Vuetable,
    VuetablePaginationBootstrap,
    VuetablePaginationInfo,
    appPlugin
  } from '@/Providers/defaultImports'
  import loadingMixins from '@/mixins/loading'
  export default {
    name: 'createpersons',
    mixins:[loadingMixins],
    computed: {
      //,TODO
      isInvalid () {
        return this.isTouched && this.personClasesData === 0
      }
    },
    created () {
      this.onOpenIndıcator()
      this.$store.dispatch('fetchAllTitles')
      this.$store.dispatch('fetchAllProvince')
      this.$store.dispatch('fetchAllUnits')
      this.fetchScoolData()
      this.onCloseIndıcator()
    },
    methods: {
      onChangeType (item, cls, clsIndex) {
        //TODO
        item.clases[clsIndex].type = cls.type
      },
      onCloseAlert (event) {
        this.showAlert = false
      },
      fetchScoolData () {
        this.onOpenIndıcator()
        this.$store.dispatch('fetchAllSchools').then(res => {
        })
        this.$store.dispatch('fetchAllSchoolAllClasesPivot').then(res => {
          if (res.status && res.data) {
            let groupedSchool = _.groupBy(res.data, 'school_id')
            this.groupedSchools = groupedSchool
          }
        })
        this.onCloseIndıcator()
      },

      getActiveTabs (data) {
        switch (data.componentOptions.propsData.tabKey) {
          case 'schools':
            this.fetchScoolData()
            break

          case 'sporclub':
            this.fetchSporClubData()
            break

          case 'activity':
            this.fetchUserActivity()
            break
        }
      },
      fetchSporClubData () {

        this.onOpenIndıcator()
        this.$store.dispatch('fetchAllSporClubs')

        this.onCloseIndıcator()
      },
      fetchUserActivity () {
        this.onOpenIndıcator()
        this.$store.dispatch('fetchUserRelationActivity')
        this.onCloseIndıcator()
      },

      personCreteControl () {
        if (this.personData.status.school && this.personData.schools.length < 1) {
          appPlugin.showalert(
            'Uyarı',
            'Lütfen Görevli Olduğu Okullar İle İlgili Detayları Doldurunuz',
            'warning',
            'Tamam'
          )
        } else if (
          this.personData.status.activity &&
          this.personData.activity.length < 1
        ) {
          appPlugin.showalert(
            'Uyarı',
            'Lütfen Görevli Olduğu Faaliyet İle İlgili Detayları Doldurunuz',
            'warning',
            'Tamam'
          )
        } else if (
          this.personData.status.sporclub &&
          this.personData.sporclub.length < 1
        ) {
          appPlugin.showalert(
            'Uyarı',
            'Lütfen Görevli Olduğu Spor Kulübü İle İlgili Detayları Doldurunuz',
            'warning',
            'Tamam'
          )
        } else {
          this.onCreateHandler()
        }
      },
      resetData () {
        this.createPerson = true
        this.personData = {
          notificationType: {
            sms: false,
            email: false
          },
          schools: [],
          lessons: [],
          clases: [],
          activity: [],
          sporclub: [],
          personName: '',
          personLastName: '',
          phone: '',
          otherphone: '',
          email: '',
          adress: '',
          isActive: true,
          gender: '',
          file: '',
          fileprew: this.defaultPreview,
          titleid: '',
          provinceid: '',
          unitsid: '',
          status: {
            school: false,
            sporclub: false,
            activity: false
          },
          proximity: '',
          phoneNotification: '',
          smsNotification: '',
          utc: ''
        }
      },
      onCreateHandler () {
        if (this.$v.personData.$invalid) {
          appPlugin.showalert(
            'Uyarı',
            'Lütfen Personel Bilgilerini Doldurunuz',
            'error',
            'Tamam'
          )
        } else {
          let data
          let query
          let orquery
          this.onOpenIndıcator()
          if (this.personData.file != '') {
            let formData = new FormData()
            let birthDay = this.personData.birthday
            if (birthDay != '') {
              this.personData.birthday = moment(this.personData.birthday).format(
                'YYYY-MM-DD'
              )
            } else {
            }
            formData.append('file', this.personData.file)
            this.$store
              .dispatch('createFiles', formData)
              .then(res => {
                if (res.status) {
                  if (res.status == 200) {
                    data = {
                      name: this.personData.personName,
                      surname: this.personData.personLastName,
                      phone: this.personData.phone,
                      otherphone: this.personData.otherphone,
                      email: this.personData.email,
                      tc: this.personData.utc,
                      adress: this.personData.adress,
                      active: 1,
                      gender: this.personData.gender,
                      status: this.personData.status,
                      emailnotification: this.personData.notificationType.email,
                      smsnotification: this.personData.notificationType.sms,
                      file: res.data.id,
                      proximities: 1,
                      birthday: this.personData.birthday,
                      title: this.personData.titleid,
                      province: this.personData.provinceid,
                      unit: this.personData.unitsid
                    }
                    this.$store
                      .dispatch('createUsers', data)
                      .then(res => {
                        if (res.status) {
                          if (res.status == 200) {
                            let user = res.data

                            this.$store
                              .dispatch('createUserUTypes', {
                                user_id: res.data.id,
                                users_types_id: 1
                              })
                              .then(res => {
                                if (res.status) {
                                  this.$store
                                    .dispatch('createPersonPassword', {
                                      userid: user.id
                                    })
                                    .then(res => {
                                      if (res.status) {
                                        if (res.status == 200) {
                                          this.user = user
                                          this.onCloseIndıcator()
                                          this.personData = {
                                            notificationType: {
                                              sms: false,
                                              email: false
                                            },
                                            schools: this.personData.schools,
                                            lessons: this.personData.lessons,
                                            clases: this.personData.clases,
                                            activity: this.personData.activity,
                                            sporclub: this.personData.sporclub,
                                            personName: '',
                                            personLastName: '',
                                            phone: '',
                                            otherphone: '',
                                            email: '',
                                            adress: '',
                                            isActive: true,
                                            gender: '',
                                            file: '',
                                            fileprew: this.defaultPreview,
                                            titleid: '',
                                            provinceid: '',
                                            unitsid: '',
                                            status: {
                                              school: false,
                                              sporclub: false,
                                              activity: false
                                            },
                                            birthday: '',
                                            proximity: '',
                                            phoneNotification: '',
                                            smsNotification: '',
                                            utc: ''
                                          }
                                          //
                                          this.showAlert = true
                                          this.createPerson = false
                                          this.personSuccesTxt =
                                            'Personel Başarıyla Eklendi '
                                          appPlugin.showalert(
                                            'Personel Başarıyle Eklendi',
                                            '',
                                            'success',
                                            'Tamam'
                                          )
                                        } else {
                                          this.onCloseIndıcator()
                                          appPlugin.showalert(
                                            'Personel Parolası Oluşturulurken  Hata Gerçekleşti ',
                                            '',
                                            'error',
                                            'Tamam'
                                          )
                                        }
                                      } else {
                                        this.onCloseIndıcator()
                                        appPlugin.showalert(
                                          'Personel Parolası Oluşturulurken  Hata Gerçekleşti ',
                                          '',
                                          'error',
                                          'Tamam'
                                        )
                                      }
                                    })
                                } else {
                                  this.onCloseIndıcator()
                                  appPlugin.showalert(
                                    'Personel Eklenirken Hata Gerçekleşti ',
                                    '',
                                    'error',
                                    'Tamam'
                                  )
                                }
                              })
                              .catch(err => {
                                this.onCloseIndıcator()
                                appPlugin.showalert(
                                  'Personel Eklenirken Hata Gerçekleşti ',
                                  '',
                                  'error',
                                  'Tamam'
                                )
                              })
                          } else if (res.status == 204) {
                            this.onCloseIndıcator()
                            appPlugin.showalert(
                              'Uyarı',
                              'Email Adresi,Telefon Numarası Veya TC Numarası Daha Önce Kullanıldı',
                              'warning',
                              'Tamam'
                            )
                          }
                        } else {
                          this.onCloseIndıcator()
                          appPlugin.showalert(
                            'Personel Eklenirken Hata Gerçekleşti ',
                            '',
                            'error',
                            'Tamam'
                          )
                        }
                      })
                      .catch(err => {
                        this.onCloseIndıcator()
                        appPlugin.showalert(
                          'Personel Eklenirken Hata Gerçekleşti ',
                          '',
                          'error',
                          'Tamam'
                        )
                      })
                  } else {
                    appPlugin.showalert(
                      'Personel Resim Ekleme İşlemi Başarısız',
                      '',
                      'error',
                      'Tamam'
                    )
                    this.onCloseIndıcator()
                  }
                } else {
                  this.onCloseIndıcator()
                  appPlugin.showalert(
                    'Personel Resim Ekleme İşlemi Başarısız',
                    '',
                    'error',
                    'Tamam'
                  )
                }
              })
              .catch(err => {
                this.onCloseIndıcator()
                appPlugin.showalert(
                  'Personel Resim Ekleme İşlemi Başarısız',
                  '',
                  'error',
                  'Tamam'
                )
              })
          } else {
            let birthDay = this.personData.birthday
            if (birthDay != '') {
              this.personData.birthday = moment(this.personData.birthday).format(
                'YYYY-MM-DD'
              )
            } else {
            }
            data = {
              name: this.personData.personName,
              surname: this.personData.personLastName,
              phone: this.personData.phone,
              otherphone: this.personData.otherphone,
              email: this.personData.email,
              tc: this.personData.utc,
              adress: this.personData.adress,
              active: 1,
              birthday: this.personData.birthday,
              gender: this.personData.gender,
              status: this.personData.status,
              emailnotification: this.personData.notificationType.email,
              smsnotification: this.personData.notificationType.sms,
              file: 1,
              proximities: 1,
              title: this.personData.titleid,
              province: this.personData.provinceid,
              unit: this.personData.unitsid,
              birthday: this.personData.birthday
            }
            query = appPlugin.urlParse(
              'uTC=' +
              this.personData.utc +
              '& uEmail=' +
              this.personData.email +
              '& uPhone=' +
              this.personData.phone
            )
            orquery = appPlugin.urlParse(
              'uTC=' +
              this.personData.utc +
              '& uEmail=' +
              this.personData.email +
              '& uPhone=' +
              this.personData.phone
            )
            this.$store
              .dispatch('createUsers', data)
              .then(res => {
                if (res.status) {
                  if (res.status == 200) {
                    let user = res.data

                    this.$store
                      .dispatch('createUserUTypes', {
                        user_id: res.data.id,
                        users_types_id: 1
                      })
                      .then(res => {
                        if (res.status) {
                          this.$store
                            .dispatch('createPersonPassword', { userid: user.id })
                            .then(res => {
                              if (res.status) {
                                if (res.status == 200) {
                                  this.user = user
                                  this.onCloseIndıcator()
                                  this.personData = {
                                    notificationType: {
                                      sms: false,
                                      email: false
                                    },
                                    schools: this.personData.schools,
                                    lessons: this.personData.lessons,
                                    clases: this.personData.clases,
                                    activity: this.personData.activity,
                                    sporclub: this.personData.sporclub,
                                    personName: '',
                                    personLastName: '',
                                    phone: '',
                                    otherphone: '',
                                    email: '',
                                    adress: '',
                                    isActive: true,
                                    gender: '',
                                    file: '',
                                    fileprew: this.defaultPreview,
                                    titleid: '',
                                    provinceid: '',
                                    unitsid: '',
                                    status: {
                                      school: false,
                                      sporclub: false,
                                      activity: false
                                    },
                                    proximity: '',
                                    phoneNotification: '',
                                    smsNotification: '',
                                    utc: ''
                                  }
                                  this.showAlert = true
                                  this.createPerson = false
                                  this.personSuccesTxt =
                                    'Personel Başarıyla Eklendi '
                                  appPlugin.showalert(
                                    'Personel Başarıyle Eklendi',
                                    '',
                                    'success',
                                    'Tamam'
                                  )
                                  appPlugin.showalert(
                                    'Personel Başarıyle Eklendi',
                                    '',
                                    'success',
                                    'Tamam'
                                  )
                                } else {
                                  this.onCloseIndıcator()
                                  appPlugin.showalert(
                                    'Personel Parolası Oluşturulurken  Hata Gerçekleşti ',
                                    '',
                                    'error',
                                    'Tamam'
                                  )
                                }
                              } else {
                                this.onCloseIndıcator()
                                appPlugin.showalert(
                                  'Personel Parolası Oluşturulurken  Hata Gerçekleşti ',
                                  '',
                                  'error',
                                  'Tamam'
                                )
                              }
                            })
                        } else {
                          this.onCloseIndıcator()
                          appPlugin.showalert(
                            'Personel Eklenirken Hata Gerçekleşti ',
                            '',
                            'error',
                            'Tamam'
                          )
                        }
                      })
                      .catch(err => {
                        this.onCloseIndıcator()
                        appPlugin.showalert(
                          'Personel Eklenirken Hata Gerçekleşti ',
                          '',
                          'error',
                          'Tamam'
                        )
                      })
                  } else if (res.status == 204) {
                    this.onCloseIndıcator()
                    appPlugin.showalert(
                      'Uyarı',
                      'Email Adresi,Telefon Numarası Veya TC Numarası Daha Önce Kullanıldı',
                      'warning',
                      'Tamam'
                    )
                  }
                } else {
                  this.onCloseIndıcator()
                  appPlugin.showalert(
                    'Personel Eklenirken Hata Gerçekleşti ',
                    '',
                    'error',
                    'Tamam'
                  )
                }
              })
              .catch(err => {
                this.onCloseIndıcator()
                appPlugin.showalert(
                  'Personel Eklenirken Hata Gerçekleşti ',
                  '',
                  'error',
                  'Tamam'
                )
              })
          }
        }
      },
      deleteImg () {
        this.personData.file = ''
        this.personData.fileprew = this.defaultPreview
        document.getElementById('personImgInput').value = null
      },
      addFile () {
        var formData = new FormData()
        formData.append('file', this.personData.file)
        this.$store.dispatch('createFiles', formData).then(res => {
        })
      },
      changePersonStatus (type, data) {
        //TODO
        switch (type) {
          case 'school':
            this.onOpenIndıcator()
            this.$store.dispatch('fetchAllSchools').then(res => {
            })
            this.$store.dispatch('fetchAllSchoolAllClasesPivot').then(res => {
              if (res.status && res.data) {
                let groupedSchool = _.groupBy(res.data, 'school_id')
                this.groupedSchools = groupedSchool
              }
            })
            this.onCloseIndıcator()
            break

          case 'sporclub':
            break

          case 'activity':
            break
        }
      },
      onTouch () {
        //TODO
        this.isTouched = true
      },
      newPersonAdded () {
        this.createPerson = true
        this.showAlert = false
        this.user = {}
      },
      onChange (e) {
        let result = true

        result = appPlugin.ImageValidator(e.target.files)
        if (result === false) {
          document.getElementById('personImgInput').value = null
          appPlugin.showalert(
            'Uyarı',
            'Yalnızca resim Dosyayı Seçilmelidir',
            'warning',
            'Tamam'
          )
        } else {
          const file = e.target.files[0]
          this.personData.file = file
          appPlugin.readFileToBase64(file).then(res => {
            res.date = new Date().toLocaleDateString()
            res.time =
              new Date().getHours() +
              '.' +
              new Date().getMinutes() +
              '.' +
              new Date().getSeconds()
            res.decode64 = res.base64
            res.base64 = 'data:image/png;base64,' + res.base64
            this.personData.fileprew = res.base64
          })
        }
      }
    },
    validations: {
      personData: {
        personName: {
          required
        },
        personLastName: {
          required
        },
        phone: {
          required
        },
        email: {
          required,
          email
        },
        adress: {
          required
        },
        unitsid: {
          required
        },
        titleid: {
          required
        },
        gender: {
          required
        },
        provinceid: {
          required
        },
        utc: {
          numeric,
          required,
          minLength: minLength(11),
          maxLength: maxLength(11),
          tcValidators: appPlugin.checktc
        }
      }
    },
    data () {
      return {
        sporclubtaskstatus: 0,
        tableHeader: [
          {
            name: 'Görevli Olduğu Okullar ',
            display: 'sName'
          },
          {
            name: 'Görevli Olduğu Sınıflar ',
            display: 'sName'
          },
          {
            name: 'Görevli Olduğu Dersler ',
            display: 'sName'
          }
        ],
        personSuccesTxt: '',
        showAlert: false,
        user: {},
        isTouched: false,
        createPerson: true,
        groupedSchools: {},
        defaultPreview: defaultImage,
        personData: {
          notificationType: {
            sms: false,
            email: false
          },
          schools: [],
          lessons: [],
          clases: [],
          activity: [],
          sporclub: [],
          birthday: '',
          personName: '',
          personLastName: '',
          phone: '',
          otherphone: '',
          email: '',
          adress: '',
          isActive: true,
          gender: '',
          file: '',
          fileprew: defaultImage,
          titleid: '',
          provinceid: '',
          unitsid: '',
          status: {
            school: false,
            sporclub: false,
            activity: false
          },
          proximity: '',
          phoneNotification: '',
          smsNotification: '',
          utc: ''
        }
      }
    },
    components: {
      Flex,
      FlexCard,
      VSelect,
      VTabs,
      VTabContent,
      MaskedInput,
      SearchBox,
      Loading,
      VInput,
      VButton,
      VTooltipButton,
      Multiselect,
      datetime: Datetime,
      Vuetable,
      VuetablePaginationBootstrap,
      VuetablePaginationInfo,
      Alert,
      tooltip,
      ActivityTaskCreate,
      SchoolTaskCreate,
      SporClubTaskCreate
    }
  }
</script>

<style scoped>
  .center {
    display: block;
    margin-left: auto;
    margin-right: auto;
    width: 50%;
  }
</style>

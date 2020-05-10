<template>
  <div>
    <Loading v-if="loading"></Loading>
    <flex column="col-md-12 col-sm-12 col-lg-12">
      <panel-content collapseHref="collapse2" :collapseTitle="$t('personelImgEdit')">
        <panel-item collapseID="collapse2">
          <div class="card-body tex-center d-flex align-items-center flex-column">
            <a
              v-if="personData.file"
              @click="deleteImg"
              aria-pressed="true"
              class="btn btn-danger"
              role="button"
            >{{$t('deleteImg')}}</a>
            <br />
            <br />
            <img :src="personData.fileprew" id="personImgInput" width="200" height="200" />

            <br />
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
            >{{$t('pickImg')}}</a>
          </div>
          <v-button
            :className="'btn btn-warning float-right mb-3'"
            :btnIcon="'fa-plus-circle'"
            :disabled="$v.personData.$invalid"
            @onClick="updateImg"
            :btnName="$t('updateImg')"
          ></v-button>
        </panel-item>
      </panel-content>
    </flex>
    <flex-card column="col-md-12 col-sm-12 col-lg-12">
      <panel-content collapseHref="collapse3" :collapseTitle="$t('personelInformation')">
        <panel-item collapseID="collapse3">
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
                      <small
                        v-if="!$v.personData.personName.required"
                      >{{$t('personNameRequiredMsg')}}</small>
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-md-6 col-sm-6 col-lg-6">
                <div
                  class="form-group"
                  :class="{ 'has-danger': $v.personData.personLastName.$error }"
                >
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
                        <i
                          class="fas fa-phone"
                          :style="{'color':$v.personData.phone.$error?'red':''}"
                        ></i>
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
                      <br />
                      <small v-if="!$v.personData.utc.numeric">{{$t('personNumberTc')}}</small>
                      <br />
                      <small v-if="!$v.personData.utc.required">{{$t('personTcRequiredMsg')}}</small>
                      <br />
                      <small v-if="!$v.personData.utc.minLength">{{$t('personTCLengthMsg')}}</small>
                      <br />
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
                    value="0"
                    id="custom-radio-1"
                    type="radio"
                  />
                  <label class="custom-control-label" for="custom-radio-1">Erkek</label>
                </div>
                <div class="custom-control custom-radio mb-3">
                  <input
                    name="custom-radio-2"
                    class="custom-control-input"
                    v-model="$v.personData.gender.$model"
                    value="1"
                    id="custom-radio-2"
                    type="radio"
                  />
                  <label class="custom-control-label" for="custom-radio-2">Kadın</label>
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
                  <div class="form-group">
                    <label>{{$t('personBirthDay')}}</label>
                    <div class="input-group input-group-alternative">
                      <div class="input-group-prepend">
                        <span class="input-group-text">
                          <i class="fa fa-calendar-day"></i>
                        </span>
                      </div>
                      <!--2019-01-16-->
                      <datetime
                        input-class="form-control"
                        :week-start="7"
                        v-model="personData.birthday"
                        :phrases="{ok: 'Seç', cancel: 'Vazgeç'}"
                      ></datetime>
                    </div>
                  </div>
                  <label>{{$t('notificationtype')}}</label>
                  <div class="custom-control custom-checkbox mb-3">
                    <input
                      class="custom-control-input"
                      id="customCheck11"
                      v-model="personData.notificationType.sms"
                      type="checkbox"
                    />
                    <label
                      class="custom-control-label"
                      for="customCheck11"
                    >{{$t('smsnotification')}}</label>
                  </div>
                  <div class="custom-control custom-checkbox mb-3">
                    <input
                      class="custom-control-input"
                      id="customCheck22"
                      v-model="personData.notificationType.email"
                      type="checkbox"
                    />
                    <label
                      class="custom-control-label"
                      for="customCheck22"
                    >{{$t('emailnotification')}}</label>
                  </div>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-md-6 col-sm-6 col-lg-6">
                <div class="form-group">
                  <label>{{$t('personactive')}}</label>
                  <div class="custom-control custom-checkbox mb-3">
                    <input
                      class="custom-control-input"
                      id="customCheck113"
                      v-model="personData.isActive"
                      type="checkbox"
                    />
                    <label class="custom-control-label" for="customCheck113">{{$t('isActive')}}</label>
                  </div>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-md-12 col-sm-12 col-lg-12">
                <div class="form-group">
                  <v-button
                    :className="'btn btn-success float-right'"
                    :btnIcon="'fa-plus-circle'"
                    :disabled="$v.personData.$invalid"
                    @onClick="updatePerson"
                    :btnName="$t('updatePerson')"
                  ></v-button>
                  <br />
                  <br />
                  <br />
                  <br />
                </div>
              </div>
            </div>
          </div>
        </panel-item>
      </panel-content>
    </flex-card>
    <flex column="col-md-12 col-sm-12 col-lg-12">
      <panel-content
        collapseHref="collapse1"
        :collapseTitle="$t('editpersontaskinfo')"
        @onClick="getPanelStatus($event)"
      >
        <panel-item collapseID="collapse1">
          <v-tabs @onActiveTab="getParentActive($event)">
            <v-tab-content :title="$t('persontaskschools')" tabKey="uSchoolKey" icon="fa fa-user">
              <v-tabs @onActiveTab="getActiveTabs($event)" v-if="showSchoolTask">
                <school-tab
                  :showDelete="true"
                  :user="user"
                  :title="$t('persontaskschools')"
                  tabKey="school"
                  icon="fa fa-user"
                  :loadSchoolTask="loadSchoolTask"
                  :onreset="sreset"
                ></school-tab>
                <school-lesson-tab
                  :showDelete="true"
                  :onreset="slreset"
                  :user="user"
                  :title="$t('persontasklesson')"
                  tabKey="lesson"
                  icon="fa fa-edit"
                  :loadSchoolTask="loadSchoolTask"
                ></school-lesson-tab>
                <school-clases-tab
                  :showDelete="true"
                  :user="user"
                  :title="$t('persontaskclas')"
                  tabKey="schoolclas"
                  icon="fa fa-school"
                  :loadSchoolTask="loadSchoolTask"
                  :onreset="slcreset"
                ></school-clases-tab>
                <school-branches-tab
                  :showDelete="true"
                  :user="user"
                  :title="$t('persontaskbranches')"
                  tabKey="schoolclasbranch"
                  icon="fa fa-user"
                  :loadSchoolTask="loadSchoolTask"
                  :onreset="slcbreset"
                ></school-branches-tab>
              </v-tabs>
              <flex-card column="col-md-12 col-sm-12 col-lg-12" v-if="!showSchoolTask">
                <div class="card-body">
                  <tooltip
                    title="Öğretmen Olarak Ata"
                    @onClick="schoolTaskStatus=0"
                    class="btn-outline-success"
                    text="Öğretmen Olarak Ata"
                  ></tooltip>
                  <tooltip
                    title="Görevli Ata "
                    @onClick="schoolTaskStatus=1"
                    class="float-right btn-outline-warning"
                    text="Görevli Olarak Ata"
                  ></tooltip>
                  <flex column="col-md-12">
                    <flex-card column="col-md-12 col-sm-12 col-lg-12">
                      <div class="card-body">
                        <flex column="col-md-12">
                          <label>Görevli Olduğu Okullar</label>
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
                            <small v-if="isInvalid" style="color: red">Lütfen Okul Seçiniz</small>
                          </div>
                        </flex>
                        <flex column="col-md-12 col-sm-12 col-lg-12" v-if="schoolTaskStatus==0">
                          <label>
                            {{personSchoolData.sName}} Görevli Olduğu
                            Sınıflar
                          </label>
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
                            <small v-if="isInvalid" style="color: red">Lütfen Sınıf Seçiniz</small>
                          </div>
                        </flex>
                        <flex column="col-md-12 col-lg-12 col-sm-12" v-if="schoolTaskStatus==0">
                          <label>
                            {{personSchoolData.sName}} Görevli Olduğu
                            Dersler
                          </label>
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
                            <small v-if="isInvalid" style="color: red">Lütfen Ders Seçiniz</small>
                          </div>
                        </flex>
                        <v-button
                          v-if="schoolTaskStatus==0"
                          :className="'btn btn-primary  btn-sm float-left'"
                          :btnIcon="'fa-plus-circle'"
                          @onClick="addMainTeacher"
                          btnName="Sınıf Öğretmeni Olarak Atama Yap"
                        ></v-button>
                        <v-button
                          :className="'btn btn-success float-right'"
                          :btnIcon="'fa-plus-circle'"
                          @onClick="addNewSchoolTask"
                          :btnName="$t('add')"
                        ></v-button>
                      </div>
                      <ul v-if="editMainTeacher">
                        <li v-for="(item,i) in personClasesData ">
                          {{item.cbName}}
                          <div class="form-check form-check-inline ml-4">
                            <input
                              class="form-check-input"
                              @change="onChangeType(item,i)"
                              v-model="item.type"
                              :value="item.type"
                              type="checkbox"
                              :id="item.clases_id"
                            />
                            <label class="form-check-label" :for="item.clases_id">
                              Sınıf Öğretmeni Olarak
                              İşaretle
                            </label>
                          </div>
                        </li>
                      </ul>
                    </flex-card>
                  </flex>
                </div>
              </flex-card>
              <span
                class="badge badge-pill badge-success ml-5"
                style="cursor:pointer !important"
                @click="createNewSchoolTask"
                v-if="showSchoolTask"
              >{{$t('addschooltask')}}</span>

              <span
                v-if="!showSchoolTask"
                class="badge badge-pill badge-warning ml-5"
                style="cursor:pointer !important"
                @click="onCancelNewSchoolTask"
              >{{$t('cancel')}}</span>
              <br />
              <br />
            </v-tab-content>
            <v-tab-content
              title="Görevli Olduğu Faaliyetler"
              tabKey="uActivityKey"
              icon="fa fa-user"
            >
              <v-tabs @onActiveTab="getActiveTabActivity($event)" v-if="showActivityTask">
                <user-activity-tab
                  :showDelete="true"
                  :onreset="areset"
                  :user="user"
                  title="Görevli Olduğu Faaliyetler"
                  tabKey="activity"
                  icon="fa fa-user"
                  :loadActivityTask="loadActivityTask"
                ></user-activity-tab>
                <user-activity-week-tab
                  :showDelete="true"
                  :onreset="aweekreset"
                  :user="user"
                  title="Görevli Olduğu Haftalar"
                  tabKey="activityweek"
                  icon="fa fa-user"
                  :loadActivityTask="loadActivityTask"
                ></user-activity-week-tab>

                <!--TODO refresh olaylarına bak hepsinde-->
                <user-activity-week-lesson
                  :showDelete="true"
                  :onreset="alessonreset"
                  ref="vuetableawl"
                  :user="user"
                  title="Görevli Olduğu Dersler"
                  tabKey="alessons"
                  icon="fa fa-user"
                  :loadActivityTask="loadActivityTask"
                ></user-activity-week-lesson>
                <user-activity-week-clases
                  :showDelete="true"
                  :onreset="aclasesreset"
                  :user="user"
                  title="Görevli Olduğu Sınıflar"
                  tabKey="aclases"
                  icon="fa fa-user"
                  :loadActivityTask="loadActivityTask"
                ></user-activity-week-clases>
              </v-tabs>

              <flex-card column="col-md-12 col-sm-12 col-lg-12" v-if="!showActivityTask">
                <activity-task-create :user="user[0]"></activity-task-create>
              </flex-card>
              <span
                class="badge badge-pill badge-success ml-5"
                style="cursor:pointer !important"
                @click="createNewActivityTask"
                v-if="showActivityTask"
              >Faaliyet Görevi Ekle</span>
              <span
                v-if="!showActivityTask"
                class="badge badge-pill badge-warning ml-5"
                style="cursor:pointer !important"
                @click="onCancelNewActivityTask"
              >Vazgeç</span>
              <br />
              <br />
            </v-tab-content>
            <v-tab-content
              title="Görevli Olduğu Spor Kulüpleri"
              tabKey="uSporKey"
              icon="fa fa-user"
            >
              <v-tabs @onActiveTab="getSporClubActiveTab($event)" v-if="showSporClubTask">
                <spor-club-tab
                  :showDelete="true"
                  :user="user"
                  :onreset="sporclubreset"
                  title="Görevli Olduğu Spor Kulüpleri"
                  tabKey="sporclub"
                  icon="fa fa-user"
                ></spor-club-tab>
                <spor-club-team-tab
                  :showDelete="true"
                  :user="user"
                  :onreset="sporclubteambranchreset"
                  title="Görevli Olduğu Takımlar ve Şubeler"
                  tabKey="sporclubteambranch"
                  icon="fa fa-user"
                ></spor-club-team-tab>
              </v-tabs>
              <flex-card column="col-md-12 col-sm-12 col-lg-12" v-if="!showSporClubTask">
                <spor-club-task-create :user="user[0]"></spor-club-task-create>
              </flex-card>
              <span
                class="badge badge-pill badge-success ml-5"
                style="cursor:pointer !important"
                @click="createNewSporClubTask"
                v-if="showSporClubTask"
              >Spor Kulübü Görevi Ekle</span>
              <span
                v-if="!showSporClubTask"
                class="badge badge-pill badge-warning ml-5"
                style="cursor:pointer !important"
                @click="onCancelNewSporClubTask"
              >Vazgeç</span>
              <br />
              <br />
            </v-tab-content>
          </v-tabs>
        </panel-item>
      </panel-content>
    </flex>
  </div>
</template>
<script>
import ActivityTaskCreate from "./partial/activitytaskcreate";
import Alert from "@/components/alert";
import PanelContent from "@/components/panelcontainer";
import PanelItem from "@/components/panelitem";
import defaultImage from "@/assets/img/defaultavatar.png";
import tooltip from "@/components/tooltip";
import {
  VTabs,
  VTabContent,
  MaskedInput,
  SearchBox,
  Loading,
  FlexCard,
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
} from "@/Providers/defaultImports";

import {
  required,
  email,
  minLength,
  maxLength,
  numeric
} from "vuelidate/lib/validators";
import { Datetime } from "vue-datetime";
import SchoolTab from "./partial/schooltasktable";
import SchoolLessonTab from "./partial/schoollesontasktable";
import SchoolClasesTab from "./partial/schoolclasestasktable";
import SchoolBranchesTab from "./partial/schoolbranchtasktable";
import UserActivityTab from "./partial/useractivitytask";
import UserActivityWeekTab from "./partial/useractivityweektask";
import UserActivityWeekLesson from "./partial/useractivitylessontask";
import UserActivityWeekClases from "./partial/useractivityclasestask";
import SporClubTab from "./partial/sporclubtasktable";
import SporClubTeamTab from "./partial/sporclubteambranchtasktable";
import SporClubTaskCreate from "./partial/sporclubtaskcreate";

export default {
  created() {
    this.loading = true;
    if (isNaN(+this.$route.params.id) == false) {
      this.$store.dispatch("fetchAllTitles");
      this.$store.dispatch("fetchAllProvince");
      this.$store.dispatch("fetchAllUnits");
      this.$store.dispatch("fetchUserRelationActivity");
      this.getPerson();
    } else {
      this.loading = false;
      appPlugin.showalert(this.$t("invalidparam"), "", "error", this.$t("ok"));
      this.$router.replace("/createpersons");
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
  methods: {
    onChangeType(item, changeIndex) {
      this.personClasesData[changeIndex].type = item.type;
    },
    getParentActive(data) {
      switch (data.componentOptions.propsData.tabKey) {
        case "sporclub":
          this.sporclubreset = true;
          this.sporclubteambranchreset = false;
          return;
        case "sporclubteambranch":
          this.sporclubreset = false;
          this.sporclubteambranchreset = true;
          return;
      }
    },
    getSporClubActiveTab(data) {
      switch (data.componentOptions.propsData.tabKey) {
        case "sporclub":
          this.sporclubreset = true;
          this.sporclubteambranchreset = false;
          return;
        case "sporclubteambranch":
          this.sporclubreset = false;
          this.sporclubteambranchreset = true;
          return;
      }
    },
    getActiveTabActivity(data) {
      switch (data.componentOptions.propsData.tabKey) {
        case "activity":
          this.areset = true;
          this.aweekreset = false;
          this.aclasesreset = false;
          this.alessonreset = false;
          return;
        case "activityweek":
          this.areset = false;
          this.aweekreset = true;
          this.aclasesreset = false;
          this.alessonreset = false;
          return;
        case "alessons":
          this.areset = false;
          this.aweekreset = false;
          this.aclasesreset = false;
          this.alessonreset = true;
          return;
        case "aclases":
          this.areset = false;
          this.aweekreset = false;
          this.aclasesreset = true;
          this.alessonreset = false;
          return;
      }
    },
    addMainTeacher() {
      if (this.schoolTaskStatus == 0) {
        if (
          this.personClasesData.length < 1 ||
          this.personLessonData.length < 1
        ) {
          appPlugin.showalert(
            this.$t("warning"),
            this.$t("personselectschoolclaseslesson"),
            "warning",
            this.$t("ok")
          );
        } else {
          this.editMainTeacher = true;
          this.personClasesData.forEach(item => {
            item.type = false;
          });
          console.log("sınıf liste", this.personClasesData);
          /*  this.personData.schools.push(this.personSchoolData)
              this.personSchoolData.clases = this.personClasesData
              this.personSchoolData.lessons = this.personLessonData
              this.loading = true
              this.addSchoolUserData(this.$route.params.id)*/
        }
      }
    },
    addNewSchoolTask() {
      if (this.schoolTaskStatus == 0) {
        if (
          this.personClasesData.length < 1 ||
          this.personLessonData.length < 1
        ) {
          appPlugin.showalert(
            this.$t("warning"),
            this.$t("personselectschoolclaseslesson"),
            "warning",
            this.$t("ok")
          );
        } else {
          this.personData.schools.push(this.personSchoolData);
          this.personSchoolData.clases = this.personClasesData;
          this.personSchoolData.lessons = this.personLessonData;
          this.loading = true;
          this.addSchoolUserData(this.$route.params.id);
        }
      } else {
        if (this.personSchoolData && this.personSchoolData.id) {
          this.personData.schools.push(this.personSchoolData);
          this.addSchoolUserData(this.$route.params.id);
        } else {
          appPlugin.showalert(
            this.$t("warning"),
            this.$t("personselectschool"),
            "info",
            this.$t("ok")
          );
        }
      }
    },
    addUserSchoolClasesBranchesData(userId) {
      this.loading = true;
      this.personData.schools.forEach(item => {
        var data = [];
        item.clases.forEach(clases => {
          let type;
          if (clases.type) {
            type = clases.type;
          } else {
            type = 0;
          }
          data.push({
            userid: userId,
            classid: clases.clases_id,
            schoolid: item.id,
            branchid: clases.branches_id,
            type: type
          });
        });
        this.$store
          .dispatch("createUserSchoolClasesBranches", {
            userscblist: data
          })
          .then(res => {
            if (res.status) {
              if (res.status == 200) {
                appPlugin.showalert(
                  this.$t("persontasksuccess"),
                  "",
                  "success",
                  this.$t("ok")
                );
                this.editMainTeacher = false;
                this.showSchoolTask = !this.showSchoolTask;
                this.personData.schools = [];
                this.personSchoolData = [];
                this.personClasesData = [];
                this.personLessonData = [];
                this.loading = false;
              }
            } else {
              appPlugin.showalert(
                this.$t("persontaskerror1"),
                "",
                "error",
                this.$t("ok")
              );
              this.loading = false;
            }
          })
          .catch(err => {
            this.loading = false;
            appPlugin.showalert(
              this.$t("persontaskerror1"),
              "",
              "error",
              this.$t("ok")
            );
            //user okul ders hata
          });
      });
    },
    addUserSchoolClasesData(userId) {
      this.loading = true;
      this.addUserSchoolClasesBranchesData(userId);
      this.personData.schools.forEach(item => {
        var data = [];
        item.clases.forEach(clases => {
          data.push({
            userid: userId,
            classid: clases.clases_id,
            schoolid: item.id
          });
        });
        this.$store
          .dispatch("createUserSchoolClases", {
            usersclist: data
          })
          .then(res => {
            if (res.status) {
              if (res.status == 200) {
                this.loading = false;
              }
            } else {
              this.loading = false;
              appPlugin.showalert(
                this.$t("persontaskerror2"),
                "",
                "error",
                this.$t("ok")
              );
            }
          })
          .catch(err => {
            this.loading = false;
            appPlugin.showalert(
              this.$t("persontaskerror2"),
              "",
              "error",
              this.$t("ok")
            );
          });
      });
    },
    addUserSchoolLessonData(userId) {
      this.loading = true;
      this.addUserSchoolClasesData(userId);
      this.personData.schools.forEach(item => {
        var data = [];
        item.lessons.forEach(lesson => {
          data.push({
            userid: userId,
            lessonid: lesson.id,
            schoolid: item.id
          });
        });
        this.$store
          .dispatch("createUserSchoolLesson", {
            usersllist: data
          })
          .then(res => {
            if (res.status) {
              if (res.status == 200) {
                this.loading = false;
              } else {
                this.loading = false;
              }
            } else {
              this.loading = false;
            }
            console.log("userokulders", res.status);
          })
          .catch(err => {
            this.loading = false;
            appPlugin.showalert(
              this.$t("persontaskerror3"),
              "",
              "error",
              this.$t("ok")
            );
            //user okul ders hata
          });
      });
    },
    addLessonUserData(userId) {
      this.loading = true;
      let data = [];
      let lessonsData = [];
      this.personData.schools.forEach(item => {
        lessonsData = lessonsData.concat(item.lessons);
      });
      lessonsData.forEach(item => {
        data.push({
          userid: userId,
          lessonid: item.id
        });
      });
      this.$store
        .dispatch("createUserLessons", { userslessonslist: data })
        .then(res => {
          if (res.status) {
            if (res.status == 200) {
              this.loading = false;
              this.addUserSchoolLessonData(userId);
            }
          } else {
            this.loading = false;
            appPlugin.showalert(
              this.$t("persontaskerror4"),
              "",
              "error",
              this.$t("ok")
            );
          }
        })
        .catch(err => {
          this.loading = false;
          appPlugin.showalert(
            this.$t("persontaskerror4"),
            "",
            "error",
            this.$t("ok")
          );
        });
    },
    addSchoolUserData(userID) {
      let data = [
        {
          schoolid: this.personData.schools[0].id,
          userid: userID
        }
      ];
      /*   if (this.user[0].uStatus.school == true) {*/
      this.$store
        .dispatch("createUserSchool", {
          userschoollist: data
        })
        .then(res => {
          if (res.status) {
            if (res.status == 200) {
              this.loading = false;
              if (this.schoolTaskStatus == 0) {
                this.addLessonUserData(userID);
              } else {
                this.showSchoolTask = !this.showSchoolTask;
                this.personData.schools = [];
                this.personSchoolData = [];
                this.personClasesData = [];
                this.personLessonData = [];
              }
              appPlugin.showalert(
                this.$t("persontaskschoolsuccess"),
                "",
                "success",
                this.$t("ok")
              );
            }
          } else {
            this.loading = false;
            appPlugin.showalert(
              this.$t("persontaskerror5"),
              "",
              "error",
              this.$t("ok")
            );
          }
        })
        .catch(err => {
          this.loading = false;
          appPlugin.showalert(
            this.$t("persontaskerror5"),
            "",
            "error",
            this.$t("ok")
          );
        });
    },
    onTouch() {
      this.isTouched = true;
    },
    getPanelStatus(e) {
      if (e == true) {
        this.loadActivityTask = false;
        this.loadSchoolTask = false;
      } else if (e == false || e == null) {
        this.loadSchoolTask = true;
        this.loadActivityTask = true;
      }
    },
    onCancelNewActivityTask() {
      this.showActivityTask = true;
      this.createActivityTask = false;
    },
    onCancelNewSporClubTask() {
      this.showSporClubTask = true;
      this.createSporClubTask = false;
    },
    onCancelNewSchoolTask() {
      this.showSchoolTask = true;
      this.createSchoolTask = false;
    },
    createNewSporClubTask() {
      this.loading = true;
      this.$store.dispatch("fetchAllSporClubs");
      this.loading = false;
      this.showSporClubTask = false;
      this.createSporClubTask = true;

      /* this.createActivityTask = true
         this.fetchScoolData()*/
    },
    createNewActivityTask() {
      this.showActivityTask = false;
      this.createActivityTask = true;
    },
    createNewSchoolTask() {
      this.showSchoolTask = false;
      this.createSchoolTask = true;
      this.fetchScoolData();
    },
    onChangeSchool(data) {
      if (this.schoolTaskStatus == 0) {
        this.loading = true;
        this.personClasesData = [];
        this.personLessonData = [];
        this.$store
          .dispatch("fetchSchoolClasesBranchesPivotAll", {
            urlparse: appPlugin.urlParse("school_id=" + data.id)
          })
          .then(res => {
            if (res.data && res.status) {
              res.data.forEach(item => {
                item.cbName = item.cName + " " + item.bName;
              });
              this.schoolClasBranchData = res.data;
            }
            this.loading = false;
          })
          .catch(err => {
            this.loading = false;
          });
        this.$store
          .dispatch("fetchAllSchoolLessonsPivot", {
            urlparse: appPlugin.urlParse("school_id=" + data.id)
          })
          .then(res => {
            this.schoolLessonsData = res.data;
          })
          .catch(err => {
            this.loading = false;
          });

        if (this.personData.schools.length > 0) {
          let finded = this.personData.schools.filter(item => {
            return item.id == data.id;
          });
          if (finded.length > 0) {
            this.personClasesData = finded[0].clases;
            this.personLessonData = finded[0].lessons;
          }
        }
      }
    },
    getActiveTabs(data) {
      switch (data.componentOptions.propsData.tabKey) {
        case "lesson":
          this.slreset = true;
          this.sreset = false;
          this.slcreset = false;
          this.slcbreset = false;
          return;
        case "school":
          this.slreset = false;
          this.sreset = true;
          this.slcreset = false;
          this.slcbreset = false;
          return;
        case "schoolclas":
          this.slreset = false;
          this.sreset = false;
          this.slcreset = true;
          this.slcbreset = false;
          return;
        case "schoolclasbranch":
          this.slreset = false;
          this.sreset = false;
          this.slcreset = false;
          this.slcbreset = true;
          return;
        default:
          return;
      }
      this.activeTab = data.componentOptions.propsData.tabKey;
    },
    deleteImg() {
      if (this.personData.file != 1) {
        this.$store
          .dispatch("updatePersonImage", {
            id: this.user[0].id,
            fileid: 1
          })
          .then(res => {
            if (res.status) {
              if (res.status == 200) {
                this.$store
                  .dispatch("deleteFiles", { id: this.personData.file })
                  .then(res => {
                    if (res.status) {
                      if (res.status == 200) {
                        appPlugin.showalert(
                          this.$t("deleteRecordMsg"),
                          "",
                          "success",
                          this.$t("ok")
                        );
                        this.personData.newfile = "";
                        this.personData.fileprew = this.defaultPreview;
                        this.personData.file = 1;
                        document.getElementById("personImgInput").value = null;
                      }
                    } else {
                      appPlugin.showalert(
                        this.$t("deleteImgError"),
                        "",
                        "error",
                        this.$t("ok")
                      );
                    }
                  })
                  .catch(err => {
                    appPlugin.showalert(
                      this.$t("deleteImgError"),
                      "",
                      "error",
                      this.$t("ok")
                    );
                  });
              }
            } else {
              appPlugin.showalert(
                this.$t("deleteImgError"),
                "",
                "error",
                this.$t("ok")
              );
            }
          })
          .catch(err => {
            appPlugin.showalert(
              this.$t("deleteImgError"),
              "",
              "error",
              this.$t("ok")
            );
          });
      } else {
        appPlugin.showalert(
          this.$t("warning"),
          this.$t("defaultPImageDelete"),
          "info",
          this.$t("ok")
        );
      }
    },
    onChange(e) {
      let result = true;
      result = appPlugin.ImageValidator(e.target.files);
      if (result === false) {
        document.getElementById("personImgInput").value = null;
        appPlugin.showalert(
          this.$t("warning"),
          "Yalnızca resim Dosyayı Seçilmelidir",
          "warning",
          this.$t("ok")
        );
      } else {
        const file = e.target.files[0];
        this.personData.newfile = file;
        appPlugin.readFileToBase64(file).then(res => {
          res.date = new Date().toLocaleDateString();
          res.time =
            new Date().getHours() +
            "." +
            new Date().getMinutes() +
            "." +
            new Date().getSeconds();
          res.decode64 = res.base64;
          res.base64 = "data:image/png;base64," + res.base64;
          this.personData.fileprew = res.base64;
        });
      }
    },
    updatePerson() {
      this.loading = true;
      let data = {
        id: this.personData.id,
        name: this.personData.personName,
        surname: this.personData.personLastName,
        phone: this.personData.phone,
        email: this.personData.email,
        tc: this.personData.utc,
        gender: this.personData.gender,
        adress: this.personData.adress,
        active: this.personData.isActive,
        otherphone: this.personData.otherphone,
        birthday: this.personData.birthday,
        unit: this.personData.unitsid,
        title: this.personData.titleid,
        province: this.personData.provinceid,
        emailnotification: this.personData.notificationType.email,
        smsnotification: this.personData.notificationType.sms,
        /*       status: this.user[0].uStatus,*/
        file: this.personData.file,
        proximities: this.personData.proximities
      };
      this.$store
        .dispatch("updatePerson", data)
        .then(res => {
          /*
              *
              *   this.personData.id = this.user[0].id
                  this.personData.personName = this.user[0].uName
                  this.personData.personLastName = this.user[0].uSurname
                  this.personData.email = this.user[0].uEmail
                  this.personData.phone = this.user[0].uPhone
                  this.personData.utc = this.user[0].uTC
                  this.personData.gender = this.user[0].uGender
                  this.personData.adress = this.user[0].uAdress
                  this.personData.titleid = this.user[0].title.id
                  this.personData.provinceid = this.user[0].province.id
                  this.personData.unitsid = this.user[0].uunits_id
                  this.personData.notificationType.sms = this.user[0].uSmsNotification
                  this.personData.notificationType.email = this.user[0].uEmailNotification
                  this.personData.age = this.user[0].age
                  this.personData.otherphone = this.user[0].uPhoneOther
                  this.personData.birthday = this.user[0].uBirthDay
                  this.personData.isActive = this.user[0].uİsActive
                  this.personData.proximities = this.user[0].uproximities_id
              *
              * */

          if (res.status) {
            if (res.status == 200) {
              appPlugin.showalert(
                this.$t("updateSuccesMsg"),
                "",
                "success",
                this.$t("ok")
              );
              this.loading = false;
            } else if (res.status == 204) {
              this.loading = false;
              appPlugin.showalert(
                this.$t("warning"),
                this.$t("personeditrecordcontrolerror"),
                "warning",
                this.$t("ok")
              );
            }
          } else {
            this.loading = false;
            appPlugin.showalert(
              this.$t("updateErrorMsg"),
              "",
              "error",
              this.$t("ok")
            );
          }
        })
        .catch(err => {
          this.loading = false;
          appPlugin.showalert(
            this.$t("updateErrorMsg"),
            "",
            "error",
            this.$t("ok")
          );
        });
    },
    updateImg() {
      let formData = new FormData();

      if (this.personData.newfile != "") {
        if (this.personData.file == "1") {
          formData.append("file", this.personData.newfile);
          this.$store
            .dispatch("createFiles", formData)
            .then(res => {
              if (res.status) {
                if (res.status == 200) {
                  this.$store
                    .dispatch("updatePersonImage", {
                      id: this.user[0].id,
                      fileid: res.data.id
                    })
                    .then(response => {
                      if (response.status) {
                        if (response.status == 200) {
                          appPlugin.showalert(
                            this.$t("updateSuccesMsg"),
                            "",
                            "success",
                            this.$t("ok")
                          );
                        }
                      } else {
                        appPlugin.showalert(
                          this.$t("updateErrorMsg"),
                          "",
                          "error",
                          this.$t("ok")
                        );
                      }
                    })
                    .catch(err => {
                      appPlugin.showalert(
                        this.$t("updateErrorMsg"),
                        "",
                        "error",
                        this.$t("ok")
                      );
                    });
                }
              } else {
                appPlugin.showalert(
                  this.$t("updateErrorMsg"),
                  "",
                  "error",
                  this.$t("ok")
                );
              }
            })
            .catch(err => {
              appPlugin.showalert(
                this.$t("updateErrorMsg"),
                "",
                "error",
                this.$t("ok")
              );
            });
          //updatePersonImage
        } else {
          formData.append("file", this.personData.newfile);
          formData.append("id", this.personData.file);
        }

        //default resme yeni resim ekleme

        this.$store.dispatch("updateFiles", formData).then(res => {
          if (res.status) {
            if (res.status == 200) {
              this.personData.newfile = "";
              this.personData.file = res.data.id;
              this.personData.fileprew = res.data.path;
              appPlugin.showalert(
                this.$t("updateSuccesMsg"),
                "",
                "success",
                this.$t("ok")
              );
            }
          } else {
            appPlugin.showalert(
              this.$t("updateErrorMsg"),
              "",
              "error",
              this.$t("ok")
            );
          }
        });
      } else {
        appPlugin.showalert(
          this.$t("warning"),

          this.$t("defaultPImage"),
          "info",
          this.$t("ok")
        );
      }
    },
    fetchScoolData() {
      this.loading = true;
      this.$store.dispatch("fetchAllSchools").then(res => {});
      this.$store.dispatch("fetchAllSchoolAllClasesPivot").then(res => {
        if (res.status && res.data) {
        }
      });
      this.loading = false;
    },
    getPerson() {
      this.$store
        .dispatch("showUser", { id: this.$route.params.id })
        .then(res => {
          if (res.status) {
            if (res.status === 200) {
              this.user = this.$store.getters.getUsers;
              if (this.user[0].file.path == "") {
                /*TODO 1 Olacak*/
                this.personData.file = 25;
              } else {
                this.personData.file = this.user[0].file.id;
                this.personData.fileprew = this.user[0].file.path;
              }
              this.personData.id = this.user[0].id;
              this.personData.personName = this.user[0].uName;
              this.personData.personLastName = this.user[0].uSurname;
              this.personData.email = this.user[0].uEmail;
              this.personData.phone = this.user[0].uPhone;
              this.personData.utc = this.user[0].uTC;
              this.personData.gender = this.user[0].uGender;
              this.personData.adress = this.user[0].uAdress;
              this.personData.titleid = this.user[0].title.id;
              this.personData.provinceid = this.user[0].province.id;
              this.personData.unitsid = this.user[0].uunits_id;
              this.personData.notificationType.sms = this.user[0].uSmsNotification;
              this.personData.notificationType.email = this.user[0].uEmailNotification;
              this.personData.age = this.user[0].age;
              this.personData.otherphone = this.user[0].uPhoneOther;
              this.personData.birthday = this.user[0].uBirthDay;
              this.personData.isActive = this.user[0].uİsActive;
              this.personData.proximities = this.user[0].uproximities_id;
              this.loading = false;
            } else {
              this.$router.push("/persons");
              this.loading = false;
            }
          } else {
            this.loading = false;
          }
        })
        .catch(err => {
          this.loading = false;
        });
    }
  },
  data() {
    return {
      sporclubreset: false,
      showSporClubTask: true,
      sporclubteambranchreset: false,
      editMainTeacher: false,
      sreset: false,
      slreset: false,
      slcreset: false,
      slcbreset: false,
      areset: false,
      aweekreset: false,
      aclasesreset: false,
      alessonreset: false,
      groupedData: {},
      personActivityData: [],
      loadActivityTask: false,
      showActivityTask: true,
      schoolTaskStatus: "0", // 0 öğretmen 1 görevli
      personLessonData: [],
      isTouched: false,
      schoolClasBranchData: [],
      schoolLessonsData: [],
      personClasesData: [],
      loadSchoolTask: false,
      showSchoolTask: true,
      createSporClubTask: false,
      createActivityTask: false,
      createSchoolTask: false,
      currentData: [],
      personSchoolData: {},
      txt: "",
      activeTab: 0,
      activityTaskStatus: 0,
      user: [],
      loading: false,
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
        birthday: "",
        personName: "",
        personLastName: "",
        phone: "",
        otherphone: "",
        email: "",
        adress: "",
        isActive: true,
        gender: "",
        file: 1,
        newfile: "",
        fileprew: defaultImage,
        titleid: "",
        provinceid: "",
        unitsid: "",
        status: {
          school: false,
          sporclub: false,
          activity: false
        },
        proximity: "",
        phoneNotification: "",
        smsNotification: "",
        utc: ""
      }
    };
  },
  computed: {
    isInvalid() {
      return this.isTouched && this.personClasesData === 0;
    }
  },
  components: {
    UserActivityWeekClases,
    UserActivityWeekLesson,
    UserActivityWeekTab,
    UserActivityTab,
    SchoolBranchesTab,
    SchoolClasesTab,
    SporClubTab,
    SporClubTeamTab,
    SchoolLessonTab,
    SchoolTab,
    Flex,
    FlexCard,
    tooltip,
    PanelContent,
    PanelItem,
    VSelect,
    VTabs,
    VTabContent,
    MaskedInput,
    SporClubTaskCreate,
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
    ActivityTaskCreate
  }
};
</script>

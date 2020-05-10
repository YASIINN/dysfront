<template>
  <div>
    <div>
      <flex-card column="col-lg-12" headerTitle="Ajanda">
        <div class="card-body">
        </div>

      </flex-card>
      <flex column="col-lg-12">
        <div class="card">
          <div class="card-header border-0">
            <div class="row">
              <div class="col-12">
                <!--
                   @select="handleSelect"
                              @clickDate="handleDateClick"
                -->
                <FullCalendar :plugins="calenderPlugins"
                              :button-text="{
        today:'Bugün',
        prev:'Önceki Ay',
        next:'Sonraki Ay'
      }"
                              @event-selected="handleSelect"
                              :selectable="false"

                              :weekends="true"
                              :header="{
              left:'',
              center:'title',
              right:'prev today next'
              }"
                              locales="tr" locale="tr"/>
              </div>

            </div>
          </div>
        </div>
      </flex>
    </div>
  </div>
</template>

<script>
  import FullCalendar from '@fullcalendar/vue'
  import DayGridPlugin from '@fullcalendar/daygrid'
  import interactionPlugin from '@fullcalendar/interaction'
  import {
    FlexCard,
    Flex,
  } from '@/Providers/defaultImports'

  export default {
    name: 'index',
    methods: {},
    data () {
      return {
        calenderPlugins: [DayGridPlugin, interactionPlugin]
      }
    },
    components: {
      FullCalendar,
      Flex,
      FlexCard,
    }
  }
</script>

<style scoped>
  @import '~@fullcalendar/core/main.css';
  @import '~@fullcalendar/daygrid/main.css';
</style>

import ACard from '@/components/acard/Card.vue'
import AInput from '@/components/ainput/BaseInput.vue'
import ABtsSelect from '@/components/ainput/BtsSelect.vue'
import ABasicTable from '@/components/atable/BasicTable.vue'
import ARelationTable from '@/components/atable/RelationTable.vue'
import ATabs from '@/components/atabs/Tabs.vue'
import ATabPane from '@/components/atabs/Tab.vue'
import ACheckBox from '@/components/acheckbox/CheckBox.vue'
import ABSwitch from '@/components/acheckbox/BSwitch.vue'
const GlobalComponents = {
  install (Vue) {
    Vue.component(ACard.name, ACard)
    Vue.component(AInput.name, AInput)
    Vue.component(ABtsSelect.name, ABtsSelect)
    Vue.component(ABasicTable.name, ABasicTable)
    Vue.component(ARelationTable.name, ARelationTable)
    Vue.component(ATabs.name, ATabs)
    Vue.component(ATabPane.name, ATabPane)
    Vue.component(ACheckBox.name, ACheckBox)
    Vue.component(ABSwitch.name, ABSwitch)
  }
}

export default GlobalComponents

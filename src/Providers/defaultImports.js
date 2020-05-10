import SearchBox from '@/components/searchBox'
import Loading from '@/components/loading'
import VInput from '@/components/input'
import VButton from '@/components/button'
import VTooltipButton from '@/components/tooltipButton'
import Flex from '@/components/layout'
import FlexCard from '@/components/flexwithcard'
import Swal from 'sweetalert2'
import appPlugin from '@/Providers/appPlugins'
import { required } from 'vuelidate/lib/validators'
import Vuetable from 'vuetable-2/src/components/Vuetable'
import VuetablePaginationBootstrap from '@/components/datatable/VuetablePaginationBootstrap'
import VuetablePaginationInfo from '@/components/datatable/VuetablePaginationInfo'
import VInputContainer from '@/components/inputgroup'
import VSelect from '@/components/select'
import Vue from 'vue'
import AlertBox from '@/components/alert'
import Multiselect from 'vue-multiselect'
import VTabs from '@/components/tabbars'
import VTabContent from '@/components/tabbarcontent'
import MaskedInput from 'vue-masked-input'
import PanelContent from '@/components/panelcontainer'
import PanelItem from '@/components/panelitem'
import defaultImage from '@/assets/img/defaultavatar.png'
export {
  defaultImage,
  PanelItem,
  PanelContent,
  Multiselect,
  VTabs,
  VTabContent,
  AlertBox,
  Vuetable,
  SearchBox,
  Loading,
  VInput,
  VButton,
  VTooltipButton,
  Flex,
  FlexCard,
  Swal,
  appPlugin,
  required,
  VuetablePaginationBootstrap,
  VuetablePaginationInfo,
  VInputContainer,
  VSelect,
  Vue,
  MaskedInput
};


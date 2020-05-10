<template>
<div>
    <employees-list :assign="true"></employees-list>
</div>
</template>
<script>
  import EmployeesList from "@/views/employees/list";
  export default {
   components: {
     EmployeesList
   },
  }
</script>

<style scoped></style>
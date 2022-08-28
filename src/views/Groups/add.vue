<template>
  <div class="app-container">
    <el-form ref="form" :model="form" :rules="rules" label-width="130px">
      <el-form-item label="Group Name" style="width: 712px;" prop="groupName">
        <el-input v-model="form.groupName" />
      </el-form-item>
      <el-form-item label="Group Members" prop="memberList">
        <el-transfer
          v-model="form.memberList"
          filterable
          :filter-method="filterMethod"
          filter-placeholder="Search Name"
          :titles="['Student List', 'Member List']"
          :data="data"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">Create</el-button>
        <el-button>Cancel</el-button>
      </el-form-item>
    </el-form>
  </div>

</template>

<script>
import { createGroup, fetchMemberList } from '@/api/group'

export default {
  name: 'Add',
  data() {
    return {
      data: [],
      filterMethod(query, item) {
        return item.search.indexOf(query) > -1
      },
      form: {
        groupName: '',
        memberList: []
      },
      rules: {
        groupName: [
          { required: true, message: 'Please enter the group name', trigger: 'blur' },
          { min: 3, max: 50, message: 'The group name is too short/too long', trigger: 'blur' }
        ],
        memberList: { required: true, message: 'The group needs at least one member', trigger: 'blur' }
      }
    }
  },
  created() {
    this.fetchList()
  },
  methods: {
    fetchList() {
      fetchMemberList().then(response => {
        this.data = response.data.memberList
      })
    },
    onSubmit() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          createGroup(this.form).then(() => {
            this.$router.push('/Groups/list')
            this.$notify({
              title: 'Success',
              message: 'Created Successfully',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    }
  }
}
</script>

<style scoped>

</style>

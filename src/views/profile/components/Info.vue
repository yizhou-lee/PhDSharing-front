<template>
  <el-form ref="dataForm" :rules="rules" :model="user">
    <el-form-item label="Name" prop="name">
      <el-input v-model="user.trueName" />
    </el-form-item>
    <el-form-item label="Sex" prop="sex"><br>
      <el-radio-group v-model="user.sex">
        <el-radio label="male" />
        <el-radio label="female" />
      </el-radio-group>
    </el-form-item>
    <el-form-item label="Email" prop="email">
      <el-input v-model="user.email" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submit">Update</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { fetchUserInfo } from '@/api/user'

export default {
  data() {
    return {
      user: {},
      rules: {
        name: [
          { required: true, message: 'You need to enter your true name', trigger: 'blur' },
          { min: 1, max: 50, message: 'Name is too long', trigger: 'blur' }
        ],
        sex: [],
        email: []
      }
    }
  },
  created() {
    this.getInfo()
  },
  methods: {
    getInfo() {
      const userId = this.$store.getters.id
      fetchUserInfo(userId).then(response => {
        this.user = response.data.user
      })
      console.log(this.user)
    },
    submit() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.$message({
            message: 'User information has been updated successfully',
            type: 'success',
            duration: 5 * 1000
          })
        }
      })
    }
  }
}
</script>

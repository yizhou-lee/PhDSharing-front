<template>
  <el-form>
    <el-form-item label="Old Password">
      <el-input />
    </el-form-item><el-form-item label="New Password">
      <el-input />
    </el-form-item>
    <el-form-item label="Confirm New Password">
      <el-input />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submit">Update</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  props: {
    user: {
      type: Object,
      default: () => {
        return {
          name: '',
          email: '',
          password: ''
        }
      }
    }
  },
  methods: {
    submit() {
      this.$message({
        message: 'User information has been updated successfully',
        type: 'success',
        duration: 5 * 1000
      })
    }
  }
}
</script>

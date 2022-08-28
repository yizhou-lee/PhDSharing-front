<template>
  <div class="app-container">
    <el-form ref="form" :model="form" :rules="rules" label-width="80px">
      <el-form-item label="Title" prop="title">
        <el-input v-model="form.title"></el-input>
      </el-form-item>
      <el-form-item label="Content" prop="content">
        <mavon-editor language="en" v-model="form.content"></mavon-editor>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">Confirm</el-button>
        <el-button @click="$router.back()">Cancel</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { addDiscussion, getDetail } from '@/api/group'

export default {
  name: 'discussionEdit',
  data() {
    return {
      form: {
        id: '',
        groupId: '',
        title: '',
        userId: '',
        addedDate: '',
        content: ''
      },
      rules: {
        title: [
          { required: true, message: 'Please enter the title', trigger: 'blur' },
          { min: 3, max : 50, message: 'Title is too short/too long', trigger: 'blur'}
        ],
        content: [
          { required: true, message: 'Please enter the content', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    const discussionId = this.$route.params.discussionId;
    if(discussionId) {
      getDetail(discussionId).then(response => {
        this.form.id = response.data.item.id;
        this.form.groupId = response.data.item.groupId;
        this.form.title = response.data.item.title;
        this.form.userId = response.data.item.userId;
        this.form.addedDate = response.data.item.addedDate;
        this.form.content = response.data.item.content;
      })
    }
  },
  methods: {
    onSubmit() {
      this.$refs['form'].validate((valid) => {
        if(valid) {
          this.form.groupId = this.$route.params.id;
          addDiscussion(this.form).then(() => {
            const discussionId = this.$route.params.discussionId;
            if(discussionId) {
              this.$notify({
                title: 'Success',
                message: 'Modified Successfully',
                type: 'success',
                duration: 2000
              })
            } else {
              this.$notify({
                title: 'Success',
                message: 'Created Successfully',
                type: 'success',
                duration: 2000
              })
            }
            this.$router.back();
          })
        }
      })
    }
  }
}
</script>

<style scoped>

</style>

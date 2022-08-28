<template>
 <div class="tab-main" style="margin-right: 20px">
   <el-card class="box-card">
     <div slot="header" class="clearfix">
       <span style="font-size: 20px;">{{ discussion.title }}</span>
       <router-link :to="{path: 'Edit'}" append>
         <el-button style="float: right; padding: 3px 0" type="text" v-if="ownDiscussion">Edit</el-button>
       </router-link>
       <div>
         <span style="font-size: 13px;">asked by {{ uploader }}</span>
       </div>
     </div>
     <div class="text item; markdown-body" v-html="discussion.content"></div>

   </el-card>
   <el-button style="margin-top: 15px; margin-bottom: 20px" type="primary" @click="showComment = true">Answer this question</el-button>
   <el-tabs v-model="activeName">
     <el-tab-pane label="Answers" name="first">
       <el-form ref="form" :model="form" :rules="rules" style="padding: 5px" v-if="showComment">
         <el-form-item prop="content">
           <mavon-editor language="en" v-model="form.content"></mavon-editor>
         </el-form-item>
         <el-form-item>
           <el-button @click="cancelSubmit">Cancel</el-button>
           <el-button type="primary" @click="onSubmit">Post answer</el-button>
         </el-form-item>
       </el-form>
       <div class="block" style="margin-left: -40px">
         <el-timeline>
           <el-timeline-item :timestamp="comment.addedDate" placement="top" v-for="comment in comments">
             <el-card class="box-answer">
               <div slot="header" class="clearfix">
                 <span style="font-weight: bolder">{{ comment.username }}</span>

                 <el-dropdown style="float: right; padding: 3px 0" v-if="comment.username === $store.getters.name || $store.getters.roles[0] !== 'student'">
                   <span class="el-dropdown-link">
                      <i class="el-icon-arrow-down el-icon-more" style="font-size: 15px"></i>
                   </span>
                   <el-dropdown-menu slot="dropdown">
                     <el-dropdown-item v-if="comment.username === $store.getters.name" @click.native="editComment(comment)">edit</el-dropdown-item>
                     <el-dropdown-item @click.native="deleteComment(comment.id)">delete</el-dropdown-item>
                   </el-dropdown-menu>
                 </el-dropdown>
               </div>
               <div class="text item; markdown-body" v-html="comment.mdcontent"></div>
             </el-card>
           </el-timeline-item>
         </el-timeline>
       </div>
     </el-tab-pane>
   </el-tabs>


 </div>
</template>

<script>
import { addComment, addDiscussion, deleteComment, getComments, getDetail } from '@/api/group'
import "github-markdown-css"
import MarkdownIt from 'markdown-it'

export default {
  name: 'discussionDetail',
  data() {
    return {
      discussion: {
        id: '',
        groupId: '',
        title: '',
        userId: '',
        addedDate: '',
        content: ''
      },
      uploader: '',
      activeName: 'first',
      form: {
        id: '',
        discussionId: '',
        username: '',
        addedDate: '',
        content: ''
      },
      rules: {
        content: [
          { required: true, message: 'Please enter the content', trigger: 'blur' }
        ]
      },
      showComment: false,
      comments: [],
      ownDiscussion: false,
      ownComment: false,
    }
  },
  created() {
    this.fetchDetail();
    this.fetchComments();
  },
  methods: {
    fetchDetail() {
      const discussionId = this.$route.params.discussionId;
      getDetail(discussionId).then(response => {
        this.discussion = response.data.item
        this.uploader = response.data.uploader
        const MarkdownIt = require("markdown-it")
        const md = new MarkdownIt()
        const result = md.render(response.data.item.content)
        this.discussion.content = result
        this.ownDiscussion = (this.uploader === this.$store.getters.name)
      })
    },
    cancelSubmit() {
      this.showComment = false;
      this.resetForm();
    },
    onSubmit() {
      this.$refs['form'].validate((valid) => {
        if(valid) {
          this.form.discussionId = this.$route.params.discussionId;
          addComment(this.form).then(() => {
            this.$notify({
              title: 'Success',
              message: 'Answered Successfully',
              type: 'success',
              duration: 2000
            })
            this.showComment = false
            this.fetchComments()
            this.resetForm()
          })
        }
      })
    },
    fetchComments() {
      const discussionId = this.$route.params.discussionId;
      getComments(discussionId).then(response => {
        this.comments = response.data.comments
        const MarkdownIt = require("markdown-it")
        const md = new MarkdownIt()
        for (let i = 0; i < this.comments.length; i++) {
          this.comments[i].mdcontent = md.render(response.data.comments[i].content)
        }
      })
    },
    editComment(comment) {
      this.showComment = true;
      this.form = comment;
    },
    resetForm() {
      this.form = {
        form: {
          id: '',
          discussionId: '',
          username: '',
          addedDate: '',
          content: ''
        }
      }
    },
    deleteComment(id) {
      deleteComment(id).then(() => {
        this.$notify({
          title: 'Success',
          message: 'Delete Successfully',
          type: 'success',
          duration: 2000
        })
        this.fetchComments()
      })
    }
  }
}
</script>

<style scoped>
  .text {
    font-size: 14px;
  }

  .item {
    margin-bottom: 18px;
  }

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }
  .clearfix:after {
    clear: both
  }
  .box-card {
    margin-left: 0px;
    width: 100%;
  }
  .box-answer {
    margin-left: 0px;
  }
  .el-dropdown-link {
    cursor: pointer;
    color: #409EFF;
  }
  .el-icon-arrow-down {
    font-size: 12px;
  }
</style>

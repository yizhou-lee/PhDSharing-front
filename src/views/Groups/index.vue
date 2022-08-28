<template>
  <div class="app-container">
    <el-tabs tab-position="left" v-model="activeName" @tab-click="handleClick" ref="tabs">
      <el-tab-pane label="People" name="people">
        <router-view></router-view>
      </el-tab-pane>
      <el-tab-pane label="Discussions" name="discussion">
        <router-view></router-view>
      </el-tab-pane>
      <el-tab-pane label="Files" name="file">
        <router-view></router-view>
      </el-tab-pane>
      <el-tab-pane label="DiscussionEdit" name="discussionEdit">
        <router-view></router-view>
      </el-tab-pane>
      <el-tab-pane label="DiscussionDetail" name="discussionDetail">
        <router-view></router-view>
      </el-tab-pane>
      <el-tab-pane label="DiscussionAdd" name="discussionAdd">
        <router-view></router-view>
      </el-tab-pane>
      <el-tab-pane label="PersonInfo" name="personInfo">
        <router-view></router-view>
      </el-tab-pane>

    </el-tabs>
  </div>
</template>

<script>
import { getFileInfo, getPeople, getFile, deleteFile, updateName, getDiscussion, deleteDiscussion } from '@/api/group'
import Pagination from '@/components/Pagination'
import { parseTime } from '@/utils'
import { deleteDocument, fetchList } from '@/api/article'
import waves from '@/directive/waves'
import router from '@/router' // secondary package based on el-pagination

export default {
  name: 'index',
  data() {
    return {
      activeName: 'people',
    }
  },
  created: function() {
    if(this.$route.name === 'peopleInfo' || this.$route.name === 'people') {
      this.activeName = 'people'
    } else if(this.$route.name === 'file') {
      this.activeName = 'file'
    } else {
      this.activeName = 'discussion'
    }
    this.hideTabs()
  },
  methods: {
    handleClick(tab) {
      const groupId = this.$route.params.id;
      this.activeName = tab.name;
      this.$router.push('/Groups/index/'+groupId+"/"+tab.name);
    },
    hideTabs() {
      this.$nextTick(function() {
        this.$refs.tabs.$children[0].$refs.tabs[3].style.display = 'none'
        this.$refs.tabs.$children[0].$refs.tabs[4].style.display = 'none'
        this.$refs.tabs.$children[0].$refs.tabs[5].style.display = 'none'
        this.$refs.tabs.$children[0].$refs.tabs[6].style.display = 'none'
      })
    }
  }
}
</script>

<style>
.el-tabs--left .el-tabs__item.is-left {
  text-align: left;
}
.el-tabs__item {
  padding-right: 40px;
  font-size: 15px;
}
.text {
  font-size: 14px;
}

.item {
  margin-bottom: 18px;
}

.el-card {
  margin-top: 10px;
  margin-left: 50px;
}

.box-card {
  width: 70%;
}

.tab-main {
  margin-top: 10px;
  margin-left: 30px;
}

</style>

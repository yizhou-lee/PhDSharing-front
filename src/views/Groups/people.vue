<template>
  <div class="tab-main">
    <el-row>
      <el-col :span="12">
        <div class="grid-content bg-purple">
          <el-card class="box-card">
            <div slot="header" class="clearfix" style="font-size: larger; font-weight: bolder">
              <span>Students</span>
            </div>
            <div v-for="student in studentData" class="text item">
              <el-link style="font-size: 18px" @click="enterInfo(student.id)">{{student.username}}</el-link>
            </div>
          </el-card>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="grid-content bg-purple-light">
          <el-card class="box-card">
            <div slot="header" class="clearfix" style="font-size: larger; font-weight: bolder">
              <span>Supervisors</span>
            </div>
            <div v-for="supervisor in supervisorData" class="text item">
              <el-link style="font-size: 18px" @click="enterInfo(supervisor.id)">{{supervisor.username}}</el-link>
            </div>
          </el-card>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { getPeople } from '@/api/group'

export default {
  name: 'people',
  data() {
    return {
      studentData: [],
      supervisorData: [],
    }
  },
  created() {
    this.fetchPeople()
  },
  methods: {
    fetchPeople() {
      const groupId = this.$route.params.id;
      getPeople(groupId).then(response => {
        this.studentData = response.data.groupMember
        this.supervisorData = response.data.supervisor
      })
    },
    enterInfo(personId) {
      const groupId = this.$route.params.id;
      this.$router.push('/Groups/index/'+groupId+"/people/"+personId);
    }
  }
}
</script>

<style scoped>

</style>

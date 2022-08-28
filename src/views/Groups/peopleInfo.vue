<template>
  <div class="tab-main">
    <el-row :gutter="20">

      <el-col :span="6" :xs="24">
        <el-card style="margin-bottom:20px;margin-left: 0px">
          <div slot="header" class="clearfix">
            <span>About me</span>
          </div>

          <div class="user-profile">
            <div class="box-center">
              <pan-thumb :image="this.$store.getters.avatar" :height="'100px'" :width="'100px'" :hoverable="false">
                <div>Hello</div>
                {{ user.role }}
              </pan-thumb>
            </div>
            <div class="box-center">
              <div class="user-name text-center">{{ user.username }}</div>
              <div class="user-role text-center text-muted">{{ user.role }}</div>
            </div>
          </div>
        </el-card>
      </el-col>

      <el-col :span="18" :xs="24">
        <el-card style="margin-left: 0px">
          <el-tabs v-model="activeTab">
            <el-tab-pane label="Info" name="info">
              <el-form>
                <el-form-item label="Name">
                  <el-input v-model.trim="user.trueName" :disabled="true"/>
                </el-form-item>
                <el-form-item label="Sex"><br/>
                  <el-radio-group v-model="user.sex">
                    <el-radio disabled label="male"></el-radio>
                    <el-radio disabled label="female"></el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item label="Email">
                  <el-input v-model.trim="user.email" :disabled="true"/>
                </el-form-item>
              </el-form>
            </el-tab-pane>
          </el-tabs>
        </el-card>
      </el-col>

    </el-row>
  </div>
</template>

<script>
import PanThumb from '@/components/PanThumb'
import { getPersonInfo } from '@/api/group'

export default {
  components: { PanThumb },
  name: 'peopleInfo',
  data() {
    return {
      user: {},
      activeTab: 'info',
    }
  },
  created() {
    this.fetchInfo()
  },
  methods: {
    fetchInfo() {
      const userId = this.$route.params.personId;
      getPersonInfo(userId).then(response => {
        this.user = response.data.person
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.box-center {
  margin: 0 auto;
  display: table;
}

.text-muted {
  color: #777;
}

.user-profile {
  .user-name {
    font-weight: bold;
  }

  .box-center {
    padding-top: 10px;
  }

  .user-role {
    padding-top: 10px;
    font-weight: 400;
    font-size: 14px;
  }

  .box-social {
    padding-top: 30px;

    .el-table {
      border-top: 1px solid #dfe6ec;
    }
  }

  .user-follow {
    padding-top: 20px;
  }
}

.user-bio {
  margin-top: 20px;
  color: #606266;

  span {
    padding-left: 4px;
  }

  .user-bio-section {
    font-size: 14px;
    padding: 15px 0;

    .user-bio-section-header {
      border-bottom: 1px solid #dfe6ec;
      padding-bottom: 10px;
      margin-bottom: 10px;
      font-weight: bold;
    }
  }
}
</style>

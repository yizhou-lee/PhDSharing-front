<template>
  <div class="app-container">
    <el-row :gutter="20">

      <el-col :span="6" :xs="24">
        <el-card style="margin-bottom:20px;">
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
        <el-card>
          <el-tabs v-model="activeTab">
            <el-tab-pane label="Info" name="info">
              <el-form ref="infoForm" :rules="infoRules" :model="user">
                <el-form-item label="Name" prop="trueName">
                  <el-input v-model="user.trueName" />
                </el-form-item>
                <el-form-item label="Sex"><br>
                  <el-radio-group v-model="user.sex">
                    <el-radio label="male" />
                    <el-radio label="female" />
                  </el-radio-group>
                </el-form-item>
                <el-form-item label="Email" prop="email">
                  <el-input v-model="user.email" />
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="infoSubmit">Update</el-button>
                  <el-button @click="resetForm">Reset</el-button>
                </el-form-item>
              </el-form>
            </el-tab-pane>
            <el-tab-pane label="Account" name="account">
              <el-form ref="accountForm" :rules="accountRules" :model="account">
                <el-form-item label="New Password" prop="newPassword">
                  <el-input v-model="account.newPassword" placeholder="Please enter the new password" type="password" />
                </el-form-item>
                <el-form-item label="Confirm New Password" prop="rePassword">
                  <el-input v-model="account.rePassword" placeholder="Please confirm the new password" type="password" />
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="accountSubmit">Update</el-button>
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
import { fetchUserInfo, logout, updatePassword, updateUserInfo } from '@/api/user'
import { removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'

export default {
  name: 'Profile',
  components: { PanThumb },
  data() {
    const confirmPassword = (rule, value, cb) => {
      if (this.account.newPassword !== value) {
        cb(new Error('The password confirmation does not match'))
      } else {
        return cb()
      }
    }
    return {
      user: {
        trueName: '',
        email: ''
      },
      activeTab: 'info',
      account: {
        newPassword: '',
        rePassword: ''
      },
      infoRules: {
        trueName: [
          { min: 1, max: 50, message: 'Name is too long', trigger: 'blur' }
        ],
        email: [{ type: 'email', message: 'Please enter the correct email', trigger: 'blur' }]
      },
      accountRules: {
        newPassword: [
          { required: true, message: 'Password should not be null', trigger: 'change' },
          { min: 6, message: 'Your password should have at least 6 characters', trigger: 'blur' },
          { max: 20, message: 'Your password should not exceed 20 characters', trigger: 'blur' }
        ],
        rePassword: { validator: confirmPassword, trigger: 'blur' }
      }
    }
  },
  created() {
    this.getUser()
  },
  methods: {
    getUser() {
      const userId = this.$store.getters.id
      fetchUserInfo(userId).then(response => {
        this.user = response.data.user
      })
    },
    infoSubmit() {
      this.$refs['infoForm'].validate((valid) => {
        if (valid) {
          updateUserInfo(this.user).then(() => {
            this.$message({
              message: 'User information has been updated successfully',
              type: 'success',
              duration: 5 * 1000
            })
          })
        }
      })
    },
    accountSubmit() {
      this.$refs['accountForm'].validate((valid) => {
        if (valid) {
          updatePassword(this.account.newPassword).then(() => {
            this.$message({
              message: 'The password has been updated, please log in again.',
              type: 'success',
              duration: 5 * 1000
            })
            this.logout()
          })
        }
      })
    },
    async logout() {
      await this.$store.dispatch('user/logout')
      // this.$router.push(`/login?redirect=${this.$route.fullPath}`)
      this.$router.push(`/login`)
    },
    resetForm() {
      this.getUser()
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

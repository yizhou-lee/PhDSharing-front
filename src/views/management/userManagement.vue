<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.title" placeholder="Username" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        Search
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-plus" @click="handleCreate">
        Add
      </el-button>
    </div>
    <el-table
      :key="tableKey"
      :data="list"
      fit
      style="width: 100%;"
    >
      <el-table-column label="Username" width="150px">
        <template slot-scope="{row}">
          <span>{{ row.username }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Ture Name" width="150px">
        <template slot-scope="{row}">
          <span>{{ row.trueName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Password" width="150px">
        <template slot-scope="{row}">
          <span>{{ row.password }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Sex" width="150px">
        <template slot-scope="{row}">
          <span>{{ row.sex }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Email" width="250px">
        <template slot-scope="{row}">
          <span>{{ row.email }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Role" width="150px">
        <template slot-scope="{row}">
          <span>{{ row.role }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Actions" align="center" min-width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            Info
          </el-button>
          <el-button size="mini" type="danger" @click="handleDelete(row,$index)">
            Delete
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="handlePageList" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="userRules" :model="temp" label-position="left" label-width="100px" style="width: 400px; margin-left:50px;">
        <el-form-item label="Username" prop="username">
          <el-input v-model="temp.username" />
        </el-form-item>
        <el-form-item label="True Name" prop="trueName">
          <el-input v-model="temp.trueName" />
        </el-form-item>
        <el-form-item label="password" prop="password">
          <el-input v-model="temp.password" />
        </el-form-item>
        <el-form-item label="Sex">
          <el-radio-group v-model="temp.sex">
            <el-radio label="male" />
            <el-radio label="female" />
          </el-radio-group>
        </el-form-item>
        <el-form-item label="Email" prop="email">
          <el-input v-model="temp.email" />
        </el-form-item>
        <el-form-item label="Role" prop="role">
          <el-radio-group v-model="temp.role">
            <el-radio label="admin" />
            <el-radio label="supervisor" />
            <el-radio label="student" />
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          Cancel
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
          Confirm
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import waves from '@/directive/waves'
import { createUser, deleteUser, fetchList, updateUser } from '@/api/user'
import { createDocument, deleteDocument, getPdf, updateDocument } from '@/api/article'

export default {
  name: 'UserManagement',
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      tableKey: 0,
      allList: null,
      list: null,
      total: 0,
      listQuery: {
        page: 1,
        limit: 10,
        title: ''
      },
      temp: {
        id: undefined,
        username: '',
        avatar: '',
        email: '',
        password: '',
        trueName: '',
        sex: '',
        role: ''
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: 'Info',
        create: 'Create'
      },
      dialogPvVisible: false,
      userRules: {
        username: [
          { required: true, message: 'Username is required', trigger: 'blur' },
          { min: 2, max: 50, message: 'Username is too short/long', trigger: 'blur' }
        ],
        trueName: [
          { min: 2, max: 50, message: 'True Name is too short/long', trigger: 'blur' }
        ],
        password: [
          { required: true, message: 'Password should not be null', trigger: 'blur' },
          { min: 6, message: 'Your password should have at least 6 characters', trigger: 'blur' },
          { max: 20, message: 'Your password should not exceed 20 characters', trigger: 'blur' }
        ],
        email: [
          { type: 'email', message: 'Please enter the correct email', trigger: 'blur' }
        ],
        role: [{ required: true, message: 'You must select a role', trigger: 'blur' }]
      }
    }
  },
  computed: {
    getPageList() {
      return this.allList.slice((this.listQuery.page - 1) * this.listQuery.limit, (this.listQuery.page - 1) * this.listQuery.limit + this.listQuery.limit)
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      fetchList(this.listQuery.title).then(response => {
        this.allList = response.data.items
        this.total = response.data.total
        this.list = this.getPageList
      })
    },
    handlePageList() {
      this.list = this.getPageList
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleModifyStatus(row, status) {
      this.$message({
        message: 'Operation Success',
        type: 'success'
      })
      row.status = status
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        username: '',
        avatar: '',
        email: '',
        password: '',
        trueName: '',
        sex: '',
        role: ''
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.temp.avatar = this.$store.getters.avatar
          createUser(this.temp).then(response => {
            this.getList()
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: 'Created Successfully',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          updateUser(tempData).then(() => {
            const index = this.list.findIndex(v => v.id === this.temp.id)
            this.list.splice(index, 1, this.temp)
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: 'Update Successfully',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleDelete(row, index) {
      this.$confirm('Are you sure you want to delete this user?').then(() => {
        this.temp = Object.assign({}, row)
        const tempData = Object.assign({}, this.temp)
        deleteUser(tempData).then(() => {
          this.$notify({
            title: 'Success',
            message: 'Delete Successfully',
            type: 'success',
            duration: 2000
          })
          this.list.splice(index, 1)
          this.total = this.total - 1
          this.getList()
        })
      })
    }
  }
}
</script>

<style scoped>

</style>

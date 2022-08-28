<template>
  <div class="app-container">
    <div class="filter-container">
      <router-link to="/Groups/add" class="link-type">
        <el-button v-if="$store.getters.roles[0] !== 'student'" class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-plus">
          Add Group
        </el-button>
      </router-link>
    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      fit
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column label="Group" min-width="80px">
        <template slot-scope="{row}">
          <span>{{ row.groupName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Creator" min-width="80px">
        <template slot-scope="{row}">
          <span>{{ row.creator }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Actions" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button type="primary" size="mini" @click="handleEnter(row.id)">
            Enter
          </el-button>
          <el-button v-if="$store.getters.roles[0] !== 'student'" size="mini" type="danger" @click="handleDelete(row,$index)">
            Delete
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { deleteDocument, fetchList } from '@/api/article'
import { deleteGroup, fetchGroupList } from '@/api/group'

export default {
  name: 'List',
  data() {
    return {
      tableKey: 0,
      list: null,
      listLoading: false,
      creator: '',
      temp: {
        id: undefined,
        groupName: ''
      }
    }
  },
  watch: {
    $route() {
      this.getList()
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      fetchGroupList().then(response => {
        this.list = response.data
      })
    },
    handleEnter(id) {
      this.$router.push('/Groups/index/' + id)
    },
    handleDelete(row, index) {
      this.$confirm('Are you sure you want to delete this group?').then(() => {
        this.temp = Object.assign({}, row)
        const tempData = Object.assign({}, this.temp)
        deleteGroup(tempData).then(() => {
          this.$notify({
            title: 'Success',
            message: 'Delete Successfully',
            type: 'success',
            duration: 2000
          })
          this.list.splice(index, 1)
        })
      })
    }
  }
}
</script>

<style scoped>

</style>

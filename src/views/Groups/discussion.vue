<template>
  <div class="tab-main">
    <div class="filter-container">
      <el-input v-model="listQuery.title" placeholder="Title" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        Search
      </el-button>
      <router-link :to="{path: 'add'}" append>
        <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-plus">
          Discussion
        </el-button>
      </router-link>
    </div>

    <el-table
      :key="tableKey"
      :data="discussionShowList"
      fit
      style="width: 100%;"
    >
      <el-table-column label="Title" min-width="150px">
        <template slot-scope="{row}">
          <span>{{ row.title }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Added Date" width="200px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.addedDate.substring(0, 10) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Actions" width="150" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button type="primary" size="mini" @click="handleEnter(row.id)">
            Enter
          </el-button>
          <el-button v-if="row.userId === $store.getters.id || $store.getters.roles[0] !== 'student'" size="mini" type="danger" @click="deleteDiscussion(row,$index)">
            Delete
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="handlePageList" />

  </div>
</template>

<script>
import { deleteDiscussion, getDiscussion } from '@/api/group'
import Pagination from '@/components/Pagination'
import waves from '@/directive/waves'

export default {
  name: 'Discussion',
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      tempDiscussion: {
        id: undefined,
        groupId: undefined,
        title: '',
        userId: undefined,
        addedDate: '',
        content: ''
      },
      tableKey: 0,
      discussionList: null,
      discussionShowList: null,
      total: 0,
      listQuery: {
        page: 1,
        limit: 10,
        title: ''
      }
    }
  },
  computed: {
    getDiscussionList() {
      return this.discussionList.slice((this.listQuery.page - 1) * this.listQuery.limit, (this.listQuery.page - 1) * this.listQuery.limit + this.listQuery.limit)
    }
  },
  created() {
    this.fetchDiscussion()
  },
  methods: {
    fetchDiscussion() {
      const groupId = this.$route.params.id
      getDiscussion(groupId, this.listQuery.title).then(response => {
        this.discussionList = response.data.items
        this.total = response.data.total
        this.discussionShowList = this.getDiscussionList
      })
    },
    handlePageList() {
      this.discussionShowList = this.getDiscussionList
    },
    handleFilter() {
      this.listQuery.page = 1
      this.fetchDiscussion()
    },
    handleEnter(discussionId) {
      const groupId = this.$route.params.id
      this.$router.push('/Groups/index/' + groupId + '/discussionDetail/' + discussionId)
    },
    deleteDiscussion(row, index) {
      this.$confirm('Are you sure you want to delete this discussion?').then(() => {
        this.tempDiscussion = Object.assign({}, row)
        const tempData = Object.assign({}, this.tempDiscussion)
        deleteDiscussion(tempData).then(() => {
          this.$notify({
            title: 'Success',
            message: 'Delete Successfully',
            type: 'success',
            duration: 2000
          })
          this.discussionShowList.splice(index, 1)
          this.total = this.total - 1
          this.fetchDiscussion()
        })
      })
    }
  }
}
</script>

<style scoped>

</style>

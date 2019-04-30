<template>
  <div class="app-container">
    <!--查询条件及操作按钮部分-->
    <div class="filter-container">
      <el-input  style="width: 200px;" class="filter-item" :placeholder="tableColumn.projectName" v-model="listQuery.projectName">
      </el-input>
       <el-input  style="width: 200px;" class="filter-item" :placeholder="tableColumn.productName" v-model="listQuery.productName">
      </el-input>
      <el-select clearable class="filter-item" style="width: 130px" v-model="listQuery.achievementType" :placeholder="tableColumn.achievementTypeName">
        <el-option v-for="item in  achievementType" :key="item.id" :label="item.name" :value="item.id">
        </el-option>
      </el-select>
       <el-button v-if="buttons.search.show" class="filter-item" type="primary" v-waves icon="el-icon-search" @click="getList">{{buttons.search.chname}}</el-button>
       <el-button v-if="buttons.delete.show" class="filter-item" type="primary" v-waves icon="el-icon-delete" @click="deleteByIds">{{buttons.delete.chname}}</el-button>
       <el-button v-if="buttons.add.show" class="filter-item" type="primary" v-waves icon="el-icon-plus" @click="addDialogFormVisible = true">{{buttons.add.chname}}</el-button>
       <el-button v-if="buttons.edit.show" class="filter-item" style="margin-left: 10px;" v-waves @click="updateDialogFormVisible=true" type="primary" icon="el-icon-edit">{{buttons.edit.chname}}</el-button>
    </div>
  <!--显示列表-->
    <el-table :key='tableKey' :data="tableList" :v-loading="listLoading" border fit highlight-current-row
      style="width: 100%;min-height:1000px;" @selection-change="selectChange" ref="multipleTable">
      <el-table-column align="center" type="selection" width="55">
      </el-table-column>
      <el-table-column width="150px" align="center" :label="tableColumn.projectName">
        <template slot-scope="scope">
          <span>{{scope.row.projectName }}</span>
        </template>
      </el-table-column>
      <el-table-column width="150px" align="center" :label="tableColumn.productName">
        <template slot-scope="scope">
          <span >{{scope.row.productName}}</span>
        </template>
      </el-table-column>
      <el-table-column width="110px" align="center" :label="tableColumn.achievementTypeName">
        <template slot-scope="scope">
          <span>{{scope.row.achievementTypeName}}</span>
        </template>
      </el-table-column>
      <el-table-column width="110px" align="center" :label="tableColumn.standardLibName">
        <template slot-scope="scope">
          <span>{{scope.row.name}}</span>
        </template>
      </el-table-column>
      <el-table-column width="150px" align="center" :label="tableColumn.createTime">
        <template slot-scope="scope">
          <span>{{scope.row.createTime | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
        </template>
      </el-table-column>
      <el-table-column width="80px"  align="center" :label="tableColumn.createName">
        <template slot-scope="scope">
          <span>{{scope.row.createrId}}</span>
        </template>
      </el-table-column>
      <el-table-column width="150px" :label="tableColumn.lastUpdateTime">
        <template slot-scope="scope">
          <span>{{scope.row.lastUpdateTime | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
        </template>
      </el-table-column>
       <el-table-column width="80px" :label="tableColumn.modifierName">
        <template slot-scope="scope">
          <span>{{scope.row.modifierId}}</span>
        </template>
      </el-table-column>
      </el-table>
     <!--分页组件-->
    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.pageNum" :page-sizes="[10,20,30, 50]" :page-size="listQuery.size" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>
    <!--新增页面-->
    <el-dialog title="新增" :visible.sync="addDialogFormVisible">
      <el-form :rules="rules" ref="addDataForm" :model="tableItem" label-position="left" label-width="100px" style='width: 400px; margin-left:50px;'>
        <el-form-item :label="tableColumn.projectName" prop="projectId">
          <el-select class="filter-item" v-model="tableItem.projectId" placeholder="选择项目">
            <el-option v-for="item in  projects" :key="item.id" :label="item.name" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="tableColumn.productName" prop="productId">
          <el-select class="filter-item" v-model="tableItem.productId" placeholder="选择产品">
            <el-option v-for="item in  products" :key="item.id" :label="item.name" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="tableColumn.achievementTypeName" prop="achievementTypeId">
          <el-select class="filter-item" v-model="tableItem.achievementTypeId" placeholder="选择业绩类型">
            <el-option v-for="item in  achievementType" :key="item.id" :label="item.name" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <div v-for="item in tableItem.standardItems" :key="item.id">
          <el-form-item :label="tableColumn.standardLibName" prop="standardItems">
            <el-input v-model="item.name" prop="name" style="width: 200px;"></el-input>
            <el-input v-model="item.dynamicName" v-show="false"></el-input>
            <el-input v-model="item.projectProductIndex" v-show="false"></el-input>
          </el-form-item>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addDialogFormVisible = false">{{buttons.cancel.chname}}</el-button>
        <el-button  type="primary" @click="saveData">{{buttons.save.chname}}</el-button>
      </div>
    </el-dialog>

   <!--修改页面-->
    <el-dialog title="更新" :visible.sync="updateDialogFormVisible">
      <el-form :rules="rules" ref="updateDataForm" :model="tableItem" label-position="left" label-width="100px" style='width: 400px; margin-left:50px;'>
        <el-form-item :label="tableColumn.projectName" prop="projectId">
          <el-select class="filter-item" v-model="tableItem.projectId" placeholder="选择项目">
            <el-option v-for="item in  projects" :key="item.id" :label="item.name" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="tableColumn.productName" prop="productId">
          <el-select class="filter-item" v-model="tableItem.productId" placeholder="选择产品">
            <el-option v-for="item in  products" :key="item.id" :label="item.name" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="tableColumn.achievementTypeName" prop="achievementTypeId">
          <el-select class="filter-item" v-model="tableItem.achievementTypeId" placeholder="选择业绩类型">
            <el-option v-for="item in  achievementType" :key="item.id" :label="item.name" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <div v-for="item in tableItem.standardItems" :key="item.id">
          <el-form-item :label="tableColumn.standardLibName" prop="standardItems">
            <el-input v-model="item.name" prop="name" style="width: 200px;"></el-input>
            <el-input v-model="item.dynamicName" v-show="false"></el-input>
            <el-input v-model="item.projectProductIndex" v-show="false"></el-input>
          </el-form-item>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="updateDialogFormVisible = false">{{buttons.cancel.chname}}</el-button>
        <el-button  type="primary" @click="updateData">{{buttons.update.chname}}</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { getListPage, add } from '@/api/achievement/standardLib'
import waves from '@/directive/waves' // 水波纹指令
import { parseTime } from '@/utils'

export default {
  name: 'standardLibTable',
  directives: {
    waves
  },
  data() {
    return {
      tableKey: 0,
      tableList: null,
      total: null,
      listLoading: true,
      listQuery: {
        pageNum: 1,
        size: 10,
        projectName: null,
        productName: null,
        achievementTypeId: null
      },
      achievementType: [{ id: 1, name: '每日每通' }, { id: 2, name: '每日每坐席' }, { id: 3, name: '每日每员工' }],
      projects: [{
        id: 146612333601361921,
        name: '中信电销',
        code: 'PJ201809101'
      }],
      products: [{
        id: 146612333601362945,
        name: '新快线',
        code: 'PD201809101'
      }],
      tableColumn: {
        projectName: '项目名称',
        productName: '产品名称',
        achievementTypeName: '业绩类型',
        standardLibName: '标准属性名称',
        createTime: '创建时间',
        createName: '创建人',
        lastUpdateTime: '修改时间',
        modifierName: '修改人'
      },
      addDialogFormVisible: false,
      updateDialogFormVisible: false,
      tableItem: {
        id: null,
        projectId: null,
        productId: null,
        achievementTypeId: null,
        standardItems: [{
          id: '146612333601362945',
          name: '通次',
          dynamicName: 'dynamic1',
          projectProductIndex: 1
        }]
      },
      multipleSelection: [],
      rules: {
        projectId: [{ required: true, message: '请选择项目', trigger: 'change' }],
        productId: [{ required: true, message: '请选择产品', trigger: 'change' }],
        achievementTypeId: [{ required: true, message: '请选择业绩类型', trigger: 'change' }],
        name: [{ required: true, message: '填写名称', trigger: 'change' }]

      },
      buttons: {
        add: { show: true, chname: '添加' },
        search: { show: true, chname: '搜索' },
        delete: { show: true, chname: '删除' },
        edit: { show: true, chname: '修改' },
        export: { show: true, chname: '导出' },
        cancel: { show: true, chname: '取消' },
        save: { show: true, chname: '保存' },
        update: { show: true, chname: '更新' }
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
  // 获取标准库列表
    getList() {
      this.listLoading = true

      getListPage(this.listQuery).then(response => {
        console.log(response.data.data)
        this.tableList = response.data.data
        this.total = response.data.total

        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1000)
      })
    },
    // 分页函数
    handleSizeChange(val) {
      this.listQuery.size = val
      this.getList()
    },

    handleCurrentChange(val) {
      this.listQuery.pageNum = val
      this.getList()
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        if (j === 'timestamp') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
    },
    // 保存表单
    saveData() {
      this.$refs['addDataForm'].validate((valid) => {
        if (valid) {
          const jsonData = Object.assign({}, this.tableItem)
          add(jsonData).then(response => {
            if (response.data.code === 200) {
              this.addDialogFormVisible = false
            }
            this.$notify({
              title: response.data.msg,
              message: response.data.msg,
              type: response.data.status,
              duration: 2000
            })
          })
        }
      })
    },
    // 更新数据
    updateData() {
      this.$refs['updateDataForm'].validate((valid) => {
        if (valid) {
          const jsonData = Object.assign({}, this.tableItem)
          add(jsonData).then(response => {
            if (response.data.code === 200) {
              this.updateDialogFormVisible = false
            }
            this.$notify({
              title: response.data.msg,
              message: response.data.msg,
              type: response.data.status,
              duration: 2000
            })
          })
        }
      })
    },
    // 根据id删除
    deleteByIds() {
      this.speedupCheckbox()
      add(this.getIds()).then(response => {
        if (response.data.code === 200) {
          this.$refs.multipleTable.clearSelection()
          this.getList()
        }
        this.$notify({
          title: response.data.msg,
          message: response.data.msg,
          type: response.data.status,
          duration: 2000
        })
      })
    },
    // 行选择
    selectChange(selected) {
      console.log(selected)
      this.multipleSelection = selected
    },
    // 获取勾选id
    getIds() {
      var arr = this.multipleSelection
      const multis = []
      for (var i = 0; i < arr.length; i++) {
        multis.push(arr[i].id)
        console.log(multis)
      }
      return multis
    },
    // 检查勾选
    speedupCheckbox() {
      if (this.multipleSelection.length === 0) {
        this.$message({
          showClose: true,
          message: '请至少勾选一项，再进行操作',
          type: 'warning'
        })
      }
    },
    // 勾选编辑
    editIitem() {
      const ids = this.getIds()
      if (ids.length !== 1) {
        this.$message({
          showClose: true,
          message: '请勾选一项，再进行操作',
          type: 'warning'
        })
      }
    }
  }
}
</script>

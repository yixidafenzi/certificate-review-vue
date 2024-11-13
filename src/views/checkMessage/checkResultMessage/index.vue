<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input v-model="queryParams.name" placeholder="请输入姓名" clearable @keyup.enter.native="handleQuery" />
        </el-form-item>
        <el-form-item label="签发日期">
          <el-date-picker v-model="daterangeIssueDate" style="width: 240px" value-format="yyyy-MM-dd" type="daterange"
            range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
        </el-form-item>
        <el-form-item label="申请类型" prop="dataTypeArr">
          <el-select v-model="queryParams.dataTypeArr" multiple collapse-tags placeholder="请选择申请类型" clearable>
            <el-option v-for="dict in dict.type.data_type" :key="dict.value" :label="dict.label" :value="dict.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="审核状态" prop="checkTypeArr">
          <el-select v-model="queryParams.checkTypeArr" multiple collapse-tags placeholder="请选择审核状态" clearable>
            <el-option v-for="dict in dict.type.check_type" :key="dict.value" :label="dict.label" :value="dict.value" />
          </el-select>
        </el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <!-- <el-col :span="1.5">
        上传文件按钮
        <el-upload ref="uploadExcel" :action=upExcel.uploadUrl :before-upload="beforeUploadExcel"
          :on-success="handleUploadSuccess" :on-error="handleUploadError" :headers="upExcel.headers"
          accept=".xlsx,.xls">
          <el-button type="primary" size="small">导入 Excel</el-button>
        </el-upload>
      </el-col> -->
      <!-- 下载模版 -->
      <!-- <el-button type="success" size="small" @click="downloadTemplate">
        下载模板
      </el-button> -->
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="checkResultMessageList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="姓名" align="center" prop="name" />
      <el-table-column label="性别" align="center" prop="gender">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.gender" :value="scope.row.gender" />
        </template>
      </el-table-column>
      <el-table-column label="出生年月" align="center" prop="dateOfBirth" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.dateOfBirth, "{y}-{m}-{d}") }}</span>
        </template>
      </el-table-column>
      <el-table-column label="证件类型" align="center" prop="certificateType">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.certificate_type" :value="scope.row.certificateType" />
        </template>
      </el-table-column>
      <el-table-column label="证件号码" align="center" prop="idNumber" />
      <el-table-column label="审核状态" align="center" prop="checkType">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.check_type" :value="scope.row.checkType" />
        </template>
      </el-table-column>
      <el-table-column label="申请类型" align="center" prop="dataType">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.data_type" :value="scope.row.dataType" />
        </template>
      </el-table-column>
      <el-table-column label="签发日期" align="center" prop="issueDate" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.issueDate, "{y}-{m}-{d}") }}</span>
        </template>
      </el-table-column>
      <el-table-column label="申领时间" align="center" prop="applyTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.applyTime, "{y}-{m}-{d}") }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)"
            v-hasPermi="['checkMessage:checkResultMessage:edit']">查看详情</el-button>
          <el-button size="mini" type="text" icon="el-icon-share"
            @click="handleShowUpdate(scope.row)">证书历史沿革</el-button>
          <el-button size="mini" type="text" icon="el-icon-download"
            @click="handleDownload(scope.row)">图片和附件下载</el-button>
          <el-button size="mini" type="text" icon="el-icon-upload2" @click="certificateUrlSubmitForm(scope.row)"
            :style="{ display: scope.row.checkType == 3 ? '' : 'none' }">证书发放</el-button>
          <!-- <el-button size="mini" type="text" icon="el-icon-upload2" @click="certificateUrlAdd(scope.row)"
            :style="{ display: scope.row.checkType == 3 ? '' : 'none' }">证书发放</el-button> -->
          <el-button size="mini" type="text" icon="el-icon-download" @click="handleDownloadCredential(scope.row)"
            :style="{ display: scope.row.checkType == 4 ? '' : 'none' }">下载证书</el-button>
          <!--          <el-button-->
          <!--            size="mini"-->
          <!--            type="text"-->
          <!--            icon="el-icon-edit"-->
          <!--            @click="handleAdd(scope.row)"-->
          <!--            :style="{ display: scope.row.checkType===2?'':'none' }"-->
          <!--          >查看退回原因</el-button>-->
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleAdd5(scope.row)" :style="{
            display:
              scope.row.checkType === 5 || scope.row.checkType === 2
                ? ''
                : 'none',
          }">查看退回原因</el-button>
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleWithdrawalDuringIssuance(scope.row)"
            :style="{ display: scope.row.checkType === 3 ? '' : 'none' }">撤回</el-button>
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleIssuedWithdrawal(scope.row)"
            :style="{ display: scope.row.checkType === 4 ? '' : 'none' }">撤回</el-button>
          <!-- <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['checkMessage:applicationMessage:remove']"
          >删除</el-button> -->
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
      @pagination="getList" />
    <!-- 证书历史沿革弹窗 -->
    <el-dialog :title="title" :visible.sync="zsopen" :close-on-click-modal="closeonclickmodal" width="400px">
      <div class="block">
        <el-timeline>
          <!-- <el-timeline-item v-for="(activity, index) in activities" :key="index" :timestamp="activity.timestamp"
            :color="activity.color || 'green'" placement="top">
            <div class="activity-content">
              <p class="activity-title">{{ activity.title }}</p>
              < class="activity-department">{{ activity.department }}</

              <p class="activity-dates">{{ activity.validity }}</p>
              <p class="activity-dates">{{ activity.realValidity }}</p>
            </div>
          </el-timeline-item> -->

          <el-timeline-item v-for="(activity, index) in activities" :key="index"
            v-if="activity.createTime || activity.updateTime" :timestamp="activity.createTime || activity.updateTime"
            :color="activity.color || 'green'" placement="top">
            <div class="activity-content">
              <p class="activity-title">{{ activity.title }}</p>
              <p class="activity-department">{{ activity.createBy }}</p>
              <p class="activity-dates" v-if="activity.title !== '注销'">
                {{ activity.issueDate || `发证日期：${activity.updateTime}` }}
              </p>
              <p class="activity-dates">{{ activity.effectiveTime }}</p>
            </div>
          </el-timeline-item>
        </el-timeline>
      </div>
    </el-dialog>

    <!-- 变更申请人信息详情对话框(执业单位变更) -->
    <el-dialog :title="title" :visible.sync="bgopen1" width="600px">
      <el-form ref="bgform" :model="bgform" label-width="140px">
        <el-form-item label="姓名" prop="name">
          <el-input v-model="bgform.name" placeholder="请输入姓名" :disabled="true" style="width: 350px" />
        </el-form-item>
        <el-row>
          <el-form-item label="性别" prop="gender">
            <el-input v-model="bgform.gender" :disabled="true" style="width: 350px" />
          </el-form-item>
        </el-row>
        <el-form-item label="出生日期" prop="dateOfBirth">
          <el-date-picker v-model="bgform.dateOfBirth" type="date" value-format="yyyy-MM-dd" placeholder="请选择出生日期"
            :disabled="true" style="width: 350px" />
        </el-form-item>

        <el-form-item label="证件名称" prop="certificateType">
          <el-input v-model="bgform.certificateType" placeholder="请输入证件名称" :disabled="true" style="width: 350px" />
        </el-form-item>
        <el-form-item label="证件号码" prop="idNumber">
          <el-input v-model="bgform.idNumber" placeholder="请输入证件号码" :disabled="true" style="width: 350px" />
        </el-form-item>
        <el-form-item label="注册证书编号" prop="certificateNumber">
          <el-input v-model="bgform.certificateNumber" placeholder="请输入注册证书编号" :disabled="true" style="width: 350px" />
        </el-form-item>
        <el-row>
          <el-form-item label="注册有效期届满时间" prop="validUntil">
            <el-date-picker v-model="bgform.validUntil" type="date" value-format="yyyy-MM-dd" :disabled="true"
              style="width: 350px" />
          </el-form-item>
        </el-row>
        <el-form-item label="变更注册事项" prop="changeRegistrationItems">
          <el-checkbox-group v-model="bgform.changeRegistrationItems" :disabled="true">
            <el-checkbox label="执业单位变更"></el-checkbox>
            <el-checkbox label="单位名称变更"></el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="现聘用单位名称" prop="companyName">
          <el-input v-model="bgform.companyName" placeholder="请输入现聘用单位名称" :disabled="true" style="width: 350px" />
        </el-form-item>
        <el-form-item label="现聘用单位统一社会信用代码" prop="currentCompanyCode">
          <el-input v-model="bgform.currentCompanyCode" placeholder="请输入现聘用单位统一社会信用代码" :disabled="true"
            style="width: 350px" />
        </el-form-item>
        <el-form-item label="现聘用单位通讯地址" prop="currentCompanyAddress">
          <el-input v-model="bgform.currentCompanyAddress" placeholder="请输入现聘用单位通讯地址" :disabled="true"
            style="width: 350px" />
        </el-form-item>
        <el-form-item label="现聘用单位工商登记地址" prop="currentCompanyRegistrationAddress">
          <el-input v-model="bgform.currentCompanyRegistrationAddress" placeholder="请输入现聘用单位工商登记地址" :disabled="true"
            style="width: 350px" />
        </el-form-item>
        <el-form-item label="经办人手机号码" prop="transactorPhone">
          <el-input v-model="bgform.transactorPhone" placeholder="请输入经办人手机号码" :disabled="true" style="width: 350px" />
        </el-form-item>

        <el-form-item label="申请人手机号码" prop="applicantPhone">
          <el-input v-model="bgform.applicantPhone" placeholder="请输入申请人手机号码" :disabled="true" style="width: 350px" />
        </el-form-item>

        <el-form-item label="现注册地" prop="nowRegistrationPlace">
          <el-input v-model="bgform.registrationPlace" placeholder="请输入注册地" :disabled="true" style="width: 350px" />
        </el-form-item>

      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="succeedSubmitFrom(2)" :style="{
          display: clickRow && (clickRow.checkType === 1 || clickRow.checkType === 5) ? '' : 'none',
        }">审核通过</el-button>
        <el-button type="primary" @click="handleAdd(2)" :style="{
          display: clickRow && (clickRow.checkType === 1 || clickRow.checkType === 5) ? '' : 'none',
        }">审核不通过</el-button>
        <el-button @click="cancel">取 消</el-button>
        <!-- <el-button type="primary" @click="succeedSubmitFrom(2)">审核通过</el-button>
        <el-button type="primary" @click="handleAdd(2)">审核不通过</el-button>
        <el-button @click="cancel">取 消</el-button> -->
      </div>
    </el-dialog>

    <!-- 变更申请人信息详情对话框(单位名称变更) -->
    <el-dialog :title="title" :visible.sync="bgopen2" width="600px">
      <el-form ref="bgform" :model="bgform" label-width="140px">
        <el-form-item label="姓名" prop="name">
          <el-input v-model="bgform.name" placeholder="请输入姓名" :disabled="true" style="width: 350px" />
        </el-form-item>
        <el-row>
          <el-form-item label="性别" prop="gender">
            <el-input v-model="bgform.gender" :disabled="true" style="width: 350px" />
          </el-form-item>
        </el-row>
        <el-form-item label="出生日期" prop="dateOfBirth">
          <el-date-picker v-model="bgform.dateOfBirth" type="date" value-format="yyyy-MM-dd" placeholder="请选择出生日期"
            :disabled="true" style="width: 350px" />
        </el-form-item>

        <el-form-item label="证件名称" prop="certificateType">
          <el-input v-model="bgform.certificateType" placeholder="请输入证件名称" :disabled="true" style="width: 350px" />
        </el-form-item>
        <el-form-item label="证件号码" prop="idNumber">
          <el-input v-model="bgform.idNumber" placeholder="请输入证件号码" :disabled="true" style="width: 350px" />
        </el-form-item>
        <el-form-item label="注册证书编号" prop="certificateNumber">
          <el-input v-model="bgform.certificateNumber" placeholder="请输入注册证书编号" :disabled="true" style="width: 350px" />
        </el-form-item>
        <el-row>
          <el-form-item label="注册有效期届满时间" prop="validUntil">
            <el-date-picker v-model="bgform.validUntil" type="date" value-format="yyyy-MM-dd" :disabled="true"
              style="width: 350px" />
          </el-form-item>
        </el-row>
        <el-form-item label="变更注册事项" prop="changeRegistrationItems">
          <el-checkbox-group v-model="bgform.changeRegistrationItems" :disabled="true">
            <el-checkbox label="执业单位变更"></el-checkbox>
            <el-checkbox label="单位名称变更"></el-checkbox>
          </el-checkbox-group>
        </el-form-item>

        <el-form-item label="经办人手机号码" prop="transactorPhone">
          <el-input v-model="bgform.transactorPhone" placeholder="请输入经办人手机号码" :disabled="true" style="width: 350px" />
        </el-form-item>

        <el-form-item label="现单位名称" prop="companyName">
          <el-input v-model="bgform.companyName" placeholder="请输入现单位名称" :disabled="true" style="width: 350px" />
        </el-form-item>

        <el-form-item label="申请人手机号码" prop="applicantPhone">
          <el-input v-model="bgform.applicantPhone" placeholder="请输入申请人手机号码" :disabled="true" style="width: 350px" />
        </el-form-item>

        <el-form-item label="现注册地" prop="nowRegistrationPlace">
          <el-input v-model="bgform.registrationPlace" placeholder="请输入注册地" :disabled="true" style="width: 350px" />
        </el-form-item>

      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="succeedSubmitFrom(2)" :style="{
          display: clickRow && (clickRow.checkType === 1 || clickRow.checkType === 5) ? '' : 'none',
        }">审核通过</el-button>
        <el-button type="primary" @click="handleAdd(2)" :style="{
          display: clickRow && (clickRow.checkType === 1 || clickRow.checkType === 5) ? '' : 'none',
        }">审核不通过</el-button>
        <el-button @click="cancel">取 消</el-button>
        <!-- <el-button type="primary" @click="succeedSubmitFrom(2)">审核通过</el-button>
        <el-button type="primary" @click="handleAdd(2)">审核不通过</el-button>
        <el-button @click="cancel">取 消</el-button> -->
      </div>
    </el-dialog>


    <!-- 延续申请人信息详情对话框 -->
    <el-dialog :title="title" :visible.sync="yxopen" :close-on-click-modal="closeonclickmodal" width="600px">
      <el-form ref="yxform" :model="yxform" :rules="rules" label-width="140px">
        <el-row :gutter="20">
          <el-form-item label="姓名" prop="name">
            <el-input v-model="yxform.name" :disabled="true" style="width:350px" />
          </el-form-item>
        </el-row>

        <el-row :gutter="20">
          <el-form-item label="性别" prop="gender">
            <el-input v-model="yxform.gender" :disabled="true" style="width: 350px" />
          </el-form-item>
        </el-row>

        <el-row :gutter="20">
          <el-form-item label="出生日期" prop="dateOfBirth">
            <el-date-picker v-model="yxform.dateOfBirth" type="date" value-format="yyyy-MM-dd" :disabled="true"
              style="width: 350px" />
          </el-form-item>
        </el-row>

        <el-row :gutter="20">
          <el-form-item label="证件名称" prop="certificateType">
            <el-input v-model="yxform.certificateType" :disabled="true" style="width: 350px" />
          </el-form-item>
        </el-row>

        <el-row :gutter="20">
          <el-form-item label="证件号码" prop="idNumber">
            <el-input v-model="yxform.idNumber" :disabled="true" style="width:350px" />
          </el-form-item>
        </el-row>

        <el-row :gutter="20">
          <el-form-item label="资格证书编号" prop="credentialsNumber">
            <el-input v-model="yxform.credentialsNumber" :disabled="true" style="width:350px" />
          </el-form-item>
        </el-row>


        <el-row :gutter="20">
          <el-form-item label="注册证书编号" prop="registerNumber">
            <el-input v-model="yxform.registerNumber" :disabled="true" style="width:350px" />
          </el-form-item>
        </el-row>

        <el-row :gutter="20">
          <el-form-item label="注册有效期届满时间" prop="validUntil">
            <el-date-picker v-model="yxform.validUntil" type="date" value-format="yyyy-MM-dd" :disabled="true"
              style="width: 350px" />
          </el-form-item>
        </el-row>

        <el-row :gutter="20">
          <el-form-item label="单位名称" prop="companyName">
            <el-input v-model="yxform.companyName" :disabled="true" style="width:350px" />
          </el-form-item>
        </el-row>

        <el-row :gutter="20">
          <el-form-item label="统一社会信用代码" prop="uscc">
            <el-input v-model="yxform.uscc" :disabled="true" style="width:350px" />
          </el-form-item>
        </el-row>

        <el-row :gutter="20">
          <el-form-item label="通讯地址" prop="address">
            <el-input v-model="yxform.address" :disabled="true" style="width:350px" />
          </el-form-item>
        </el-row>

        <el-row :gutter="20">
          <el-form-item label="工商登记地" prop="registrationPlace">
            <el-input v-model="yxform.registrationPlace" :disabled="true" style="width:350px" />
          </el-form-item>
        </el-row>

        <el-row :gutter="20">
          <el-form-item label="经办人手机号码" prop="transactorPhone">
            <el-input v-model="yxform.transactorPhone" :disabled="true" style="width:350px" />
          </el-form-item>
        </el-row>

        <el-row :gutter="20">
          <el-form-item label="申请人手机号码" prop="applicantPhone">
            <el-input v-model="yxform.applicantPhone" :disabled="true" style="width:350px" />
          </el-form-item>
        </el-row>

        <el-row :gutter="20">
          <el-form-item label="注册地" prop="registrationPlace">
            <el-input v-model="yxform.registrationPlace" :disabled="true" style="width:350px" />
          </el-form-item>
        </el-row>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="succeedSubmitFrom(3)" :style="{
          display: clickRow && (clickRow.checkType === 1 || clickRow.checkType === 5) ? '' : 'none',
        }">审核通过</el-button>
        <el-button type="primary" @click="handleAdd(3)" :style="{
          display: clickRow && (clickRow.checkType === 1 || clickRow.checkType === 5) ? '' : 'none',
        }">审核不通过</el-button>
        <el-button @click="cancel">取 消</el-button>
        <!-- <el-button type="primary" @click="succeedSubmitFrom(3)">审核通过</el-button>
        <el-button type="primary" @click="handleAdd(3)">审核不通过</el-button>
        <el-button @click="cancel">取消</el-button> -->
      </div>
    </el-dialog>

    <!-- 查看申请人信息详情对话框 -->
    <el-dialog :title="title" :visible.sync="open" :close-on-click-modal="closeonclickmodal" width="800px">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="姓名" prop="name">
              <el-input v-model="form.name" placeholder="请输入姓名" :disabled="true" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="性别" prop="gender">
              <el-radio-group v-model="form.gender">
                <el-radio disabled v-for="dict in dict.type.gender" :key="dict.value" :label="parseInt(dict.value)">{{
                  dict.label }}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="出生年月" prop="dateOfBirth">
              <el-date-picker clearable disabled v-model="form.dateOfBirth" type="date" value-format="yyyy-MM-dd"
                placeholder="请选择出生年月">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="证件类型" prop="certificateType">
              <el-radio-group v-model="form.certificateType">
                <el-radio disabled v-for="dict in dict.type.certificate_type" :key="dict.value"
                  :label="parseInt(dict.value)">{{ dict.label }}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="证件号码" prop="idNumber">
              <el-input v-model="form.idNumber" placeholder="请输入证件号码" :disabled="true" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="毕业院校" prop="graduationSchool">
              <el-input v-model="form.graduationSchool" placeholder="请输入毕业院校" :disabled="true" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="毕业时间" prop="graduationDate">
              <el-date-picker clearable disabled v-model="form.graduationDate" type="date" value-format="yyyy-MM-dd"
                placeholder="请选择毕业时间">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="专业" prop="profession">
              <el-input v-model="form.profession" placeholder="请输入专业" :disabled="true" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="学历" prop="education">
              <el-input v-model="form.education" placeholder="请输入学历" :disabled="true" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="学位" prop="qualification">
              <el-input v-model="form.qualification" placeholder="请输入学位" :disabled="true" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="二造职业资格证书编号" prop="credentialsNumber">
              <el-input v-model="form.credentialsNumber" placeholder="请输入二造职业资格证书编号" :disabled="true" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="批准日期" prop="issueDate">
              <el-date-picker clearable disabled v-model="form.issueDate" type="date" value-format="yyyy-MM-dd"
                placeholder="请选择批准日期">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="单位名称" prop="companyName">
              <el-input v-model="form.companyName" placeholder="请输入单位名称" :disabled="true" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="统一社会信用代码" prop="uscc">
              <el-input v-model="form.uscc" placeholder="请输入统一社会信用代码" :disabled="true" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="通讯地址" prop="mailingAddress">
              <el-input v-model="form.mailingAddress" placeholder="请输入通讯地址" :disabled="true" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="工商登记地" prop="icbcSite">
              <el-input v-model="form.icbcSite" placeholder="请输入工商登记地" :disabled="true" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="经办人手机号码" prop="transactorPhone">
              <el-input v-model="form.transactorPhone" placeholder="请输入经办人手机号码" :disabled="true" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="申请人手机号码" prop="applicantPhone">
              <el-input v-model="form.applicantPhone" placeholder="请输入申请人手机号码" :disabled="true" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="注册地" prop="registrationPlace">
              <el-input v-model="form.registrationPlace" placeholder="请输入注册地" :disabled="true" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="">
              <el-button size="mini" type="text" icon="el-icon-edit" @click="handleDownload(form)">图片和附件下载</el-button>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="证件照（近期白底免冠）" prop="pictureUrl">
              <el-upload ref="upload" :limit="1" accept=".jpg" :action="upload.url" :headers="upload.headers"
                :file-list="upload.fileList" list-type="picture" :multiple="false"
                :disabled="this.upload.fileList.length === 0 ? false : true" :auto-upload="false">
                <!-- <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
                <el-button style="margin-left: 10px;" size="small" type="success" :loading="upload.isUploading" @click="submitUpload">上传到服务器</el-button>
                <div slot="tip" class="el-upload__tip">只能上传jpg文件，大小在10～200KB之间，建议比例5:7</div> -->
              </el-upload>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="手写签名" prop="signaturePictureUrl">
              <el-upload ref="uploadSignature" :limit="1" accept=".jpg" :action="uploadSignature.url"
                :headers="uploadSignature.headers" :file-list="uploadSignature.fileList" list-type="picture"
                :multiple="false" :disabled="this.uploadSignature.fileList.length === 0 ? false : true
                  " :auto-upload="false">
                <!-- <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
                <el-button style="margin-left: 10px;" size="small" type="success" :loading="uploadSignature.isUploading" @click="submitUploadSignature">上传到服务器</el-button>
                <div slot="tip" class="el-upload__tip">只能上传jpg文件，大小小于50KB，建议比例45:11</div> -->
              </el-upload>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">

            <el-form-item label="上传附件" prop="attachmentUrls">
              <el-upload ref="uploadSignature" action accept=".doc, .pdf, .zip, .rar" :http-request="httpRequest"
                :file-list="fileList" :disabled="fileList.length === 0 ? false : true" :limit="4" multiple
                list-type="text">
                <!-- 自定义文件列表项的显示内容 -->
                <template #file="{ file }">
                  <div class="file-item" style="display: flex; flex-direction: column; width: 100%; padding: 5px 0;">
                    <!-- 文件标题 -->
                    <div
                      style="display: flex; justify-content: space-between; align-items: center; width: 100%; font-weight: 700; font-size: 16px;">
                      <div>{{ file.title }}</div>
                    </div>
                    <!-- 文件名称 -->
                    <div class="file-info"
                      style="display: flex; justify-content: space-between; align-items: center; width: 100%;">
                      <div style="margin-top: 4px; color: #666;">{{ file.name }}</div>
                      <el-button type="text" icon="el-icon-download" @click="downloadFile(file.url)">
                        下载
                      </el-button>
                    </div>
                  </div>
                </template>
              </el-upload>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="succeedSubmitFrom(1)" :style="{
          display: form.checkType == 1 || form.checkType == 5 ? '' : 'none',
        }">审核通过</el-button>
        <el-button type="primary" @click="handleAdd(1)" :style="{
          display: form.checkType == 1 || form.checkType == 5 ? '' : 'none',
        }">审核不通过</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 注销注册申请人信息对话框 -->
    <el-dialog :title="title" :visible.sync="zxopen" :close-on-click-modal="false" width="600px">
      <el-form ref="zxform" :model="zxform" :rules="rulesDel" label-width="140px">
        <el-row :gutter="20">
          <el-form-item label="姓名" prop="name">
            <el-input v-model="zxform.name" :disabled="true" style="width:350px" />
          </el-form-item>
        </el-row>

        <el-row :gutter="20">
          <el-form-item label="性别" prop="gender">
            <el-input v-model="zxform.gender" :disabled="true" style="width: 350px" />
          </el-form-item>
        </el-row>

        <el-row :gutter="20">
          <el-form-item label="出生日期" prop="dateOfBirth">
            <el-date-picker v-model="zxform.dateOfBirth" type="date" value-format="yyyy-MM-dd" :disabled="true"
              style="width: 350px" />
          </el-form-item>
        </el-row>

        <el-row :gutter="20">
          <el-form-item label="证件名称" prop="certificateType">
            <el-input v-model="zxform.certificateType" :disabled="true" style="width: 350px" />
          </el-form-item>
        </el-row>

        <el-row :gutter="20">
          <el-form-item label="证件号码" prop="idNumber">
            <el-input v-model="zxform.idNumber" :disabled="true" style="width: 350px" />
          </el-form-item>
        </el-row>

        <el-row :gutter="20">
          <el-form-item label="注册证书编号" prop="certificateNumber">
            <el-input v-model="zxform.certificateNumber" :disabled="true" style="width: 350px" />
          </el-form-item>
        </el-row>

        <el-row :gutter="20">
          <el-form-item label="注册有效期届满时间" prop="validUntil">
            <el-date-picker v-model="zxform.validUntil" type="date" value-format="yyyy-MM-dd" :disabled="true"
              style="width: 350px" />
          </el-form-item>
        </el-row>

        <el-row :gutter="20">
          <el-form-item label="注销原因" prop="zxyy">
            <el-input v-model="zxform.zxyy" :disabled="true" style="width: 350px" />
          </el-form-item>
        </el-row>

        <el-row :gutter="20">
          <el-form-item label="单位名称" prop="companyName">
            <el-input v-model="zxform.companyName" :disabled="true" style="width: 350px" />
          </el-form-item>
        </el-row>

        <el-row :gutter="20">
          <el-form-item label="统一社会信用代码" prop="uscc">
            <el-input v-model="zxform.uscc" :disabled="true" style="width: 350px" />
          </el-form-item>
        </el-row>

        <el-row :gutter="20">
          <el-form-item label="通讯地址" prop="address">
            <el-input v-model="zxform.address" :disabled="true" style="width: 350px" />
          </el-form-item>
        </el-row>

        <el-row :gutter="20">
          <el-form-item label="工商登记地" prop="registrationPlace">
            <el-input v-model="zxform.registrationPlace" :disabled="true" style="width: 350px" />
          </el-form-item>
        </el-row>

        <el-row :gutter="20">
          <el-form-item label="经办人手机号码" prop="transactorPhone">
            <el-input v-model="zxform.transactorPhone" :disabled="true" style="width: 350px" />
          </el-form-item>
        </el-row>

        <el-row :gutter="20">
          <el-form-item label="申请人手机号码" prop="applicantPhone">
            <el-input v-model="zxform.applicantPhone" :disabled="true" style="width: 350px" />
          </el-form-item>
        </el-row>

        <el-row :gutter="20">
          <el-form-item label="注册地" prop="registrationPlace">
            <el-input v-model="zxform.registrationPlace" :disabled="true" style="width: 350px" />
          </el-form-item>
        </el-row>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="succeedSubmitFrom(4)" :style="{
          display: clickRow && (clickRow.checkType === 1 || clickRow.checkType === 5) ? '' : 'none',
        }">审核通过</el-button>
        <el-button type="primary" @click="handleAdd(4)" :style="{
          display: clickRow && (clickRow.checkType === 1 || clickRow.checkType === 5) ? '' : 'none',
        }">审核不通过</el-button>
        <el-button @click="cancel">取 消</el-button>

        <!-- <el-button type="primary" @click="succeedSubmitFrom(4)">审核通过</el-button>
        <el-button type="primary" @click="handleAdd(4)">审核不通过</el-button>
        <el-button @click="zxcancel">取消</el-button> -->
      </div>
    </el-dialog>


    <!-- 添加审核不通过说明对话框 -->
    <el-dialog :title="title" :visible.sync="problemDescriptionOpen" width="800px"
      :close-on-click-modal="closeonclickmodal" append-to-body>
      <el-table :data="checkExplainString" style="width: 100%; margin-bottom: 10px; border: 1px solid #ebebeb"
        max-height="460">
        <!--        <el-table-column prop="createBy" label="审核人" align="center"></el-table-column>-->
        <el-table-column prop="createTime" label="审核时间" align="center"></el-table-column>
        <el-table-column prop="checkExplain" label="审核说明" align="center"></el-table-column>
      </el-table>
      <el-form ref="problemDescription" :model="formProblemDescription" :rules="rules" label-width="100px">
        <!--        <el-form-item label="审核说明" prop="checkExplain">-->
        <!--          <el-input v-model="formProblemDescription.checkExplain" type="textarea" placeholder="请输入内容" :autosize="{minRows:3,maxRows:10}" :disabled="formProblemDescription.checkType==2? true : false"/>-->
        <!--        </el-form-item>-->
        <el-form-item label="审核说明" prop="checkExplain">
          <el-input v-model="formProblemDescription.checkExplain" type="textarea" placeholder="请输入内容"
            :autosize="{ minRows: 3, maxRows: 10 }" :disabled="formProblemDescription.checkType === 2 ? true : false" />
        </el-form-item>
      </el-form>
      <el-form ref="unqualified" :model="unqualified" :rules="rules" label-width="100px">
        <el-form-item label="不合格材料" prop="unqualified">
          <el-checkbox-group v-model="unqualified">
            <el-checkbox v-for="option in unqualifiedOptions" :key="option.value" :label="option.value">
              {{ option.label }}
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer" :style="{
        display: formProblemDescription.checkType === 2 ? 'none' : 'inline',
      }">
        <el-button type="primary" @click="failSubmitForm">确 定</el-button>
        <el-button @click="cancelproblem">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 添加审核不通过说明对话框 -->
    <el-dialog :title="title" :visible.sync="problemDescriptionOpen5" width="800px"
      :close-on-click-modal="closeonclickmodal" append-to-body>
      <el-table :data="checkExplainString" style="width: 100%; margin-bottom: 10px; border: 1px solid #ebebeb"
        max-height="460">
        <!--        <el-table-column prop="createBy" label="审核人" align="center"></el-table-column>-->
        <el-table-column prop="createTime" label="审核时间" align="center"></el-table-column>
        <el-table-column prop="checkExplain" label="审核说明" align="center"></el-table-column>
      </el-table>
      <el-form ref="problemDescription" :model="formProblemDescription" :rules="rules" label-width="80px">
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import {
  listCheckResultMessage,
  getCheckResultMessage,
  queryCheckResultMessage,
  delCheckResultMessage,
  addCheckResultMessageSucceed,
  addCheckResultMessageFail,
  updateCheckResultMessage,
  downloadFileZipById,
  getAttachmentUrlDataByZx,
  withdrawalDuringIssuance,
  issuedWithdrawal,
  certificateHistory,
} from "@/api/checkMessage/checkResultMessage";
import { getToken } from "@/utils/auth";
import axios from "axios";
export default {
  name: "CheckResultMessage",
  dicts: ["check_type", "certificate_type", "gender", "data_type"],
  data() {
    return {
      // 审核通过
      formSuccess: {
        id: null,
        dataType: null,
      },
      formProblemDescription: {
        checkExplain: "",
        checkType: null,
        id: null,
      },
      // 上传证书
      // 被点击行
      clickRow: null,
      unqualifiedOptions: [], // 用于存储不合格材料选项
      unqualified: [], // 用于存储选中的不合格材料
      closeonclickmodal: false,
      zscode: "", // 证书编号
      zsyxq: "", //证书有效期
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 审核结果信息表格数据
      checkResultMessageList: [],
      // 审核结果信息实体
      // checkResultMessageinfo: {},
      // 弹出层标题
      title: "",
      // 是否显示弹出层（详情数据）
      open: false,
      // 是否显示弹出层（变更）
      bgopen1: false,
      bgopen2: false,
      zxopen: false,
      zsopen: false,
      // 是否显示弹出层(问题说明)
      problemDescriptionOpen: false,

      problemDescriptionOpen5: false,
      // 是否显示弹出层(证书上传)
      certificateOpen: false,
      // 创建时间时间范围
      daterangeIssueDate: [],
      // 查询参数
      queryParams: {
        name: null,
        checkType: null,
        dataTypeArr: [],
        dataTypeStr: [],
        checkTypeArr: [],
        checkTypeStr: [],
        pageNum: 1,
        pageSize: 10,
      },
      // 表单参数
      form: {},
      zxform: {},
      bgform: {
        bgsx: [], // 确保 bgsx 被初始化为空数组
      },
      checkExplainString: [],
      formCertificateUrl: {},
      // 表单校验
      rules: {},
      rulesDel: {},
      // 上传参数
      upload: {
        // 是否禁用上传
        isUploading: false,
        // 设置上传的请求头部
        headers: { Authorization: "Bearer " + getToken() },
        // 上传的地址
        url: process.env.VUE_APP_BASE_API + "/common/upload",
        // 上传的文件列表
        fileList: [],
      },
      uploadSignature: {
        // 是否禁用上传
        isUploading: false,
        // 设置上传的请求头部
        headers: { Authorization: "Bearer " + getToken() },
        // 上传的地址
        url: process.env.VUE_APP_BASE_API + "/common/upload",
        // 上传的文件列表
        fileList: [],
      },
      //附件数据
      fileList: [],
      activities: [],
      yxopen: false,
      // 延续表单
      yxform: {},
      // 变更表单
      // bgform: {},
      bgform: {
        // 基本信息
        name: '',                         // 姓名
        gender: '',                       // 性别
        dateOfBirth: null,                // 出生日期
        certificateType: '',              // 证件名称
        idNumber: '',                     // 证件号码
        certificateNumber: '',            // 注册证书编号
        expirationDate: null,             // 注册有效期届满时间
        // 变更信息
        changeRegistrationItems: [],      // 变更注册事项 (如: '执业单位变更', '单位名称变更')
        currentCompanyName: '',           // 现聘用单位名称
        currentCompanyCode: '',           // 现聘用单位统一社会信用代码
        currentCompanyAddress: '',        // 现聘用单位通讯地址
        currentCompanyRegistrationAddress: '', // 现聘用单位工商登记地
        // 联系方式
        transactorPhone: '',              // 经办人手机号码
        applicantPhone: '',               // 申请人手机号码
        // 其他
        registrationPlace: '',            // 注册地
        nowRegistrationPlace: ''
      },
    };
  },
  created() {
    this.getList();
  },
  methods: {
    // 初始注册模块下载
    downloadFile(url) {
      // 创建一个隐藏的 a 标签来触发下载
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', '');
      link.setAttribute('target', '_blank');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },
    // 历史沿革
    handleShowUpdate(row) {
      // console.log(row.idNumber);
      this.zsopen = true;
      this.title = "证书历史沿革";
      certificateHistory(row.idNumber).then(
        // certificateHistory().then(
        (response) => {
          // console.log(response);
          this.activities = response.data.map(item => {
            // 创建时间和更新时间的格式化
            const formatDate = (dateString) => {
              if (!dateString) return '';
              const date = new Date(dateString);
              return `${date.getFullYear()}年${String(date.getMonth() + 1).padStart(2, '0')}月${String(date.getDate()).padStart(2, '0')}日`;
            };

            return {
              createTime: formatDate(item.createTime) || '',
              updateTime: formatDate(item.updateTime) || '',
              title: item.applicationType === 1 ? '新办' : item.applicationType === 2 ? '变更' : item.applicationType === 3 ? '延续' : item.applicationType === 4 ? '注销' : '其他',
              createBy: item.createBy,
              issueDate: item.updateTime ? `发证日期：${formatDate(item.updateTime)}` : '',
              effectiveTime: item.effectiveTimeSta && item.effectiveTimeEnd
                ? `照面有效期：${formatDate(item.effectiveTimeSta)} 至 ${formatDate(item.effectiveTimeEnd)}`
                : ''
            };
          });
        }
      );
    },

    /** 查询审核结果信息列表 */
    getList() {
      this.loading = true;
      this.queryParams.params = {};
      if (null != this.daterangeIssueDate && "" != this.daterangeIssueDate) {
        this.queryParams.params["beginIssueDate"] = this.daterangeIssueDate[0];
        this.queryParams.params["endIssueDate"] = this.daterangeIssueDate[1];
      }
      let dataTypes = [];
      if (this.queryParams.dataTypeArr) {
        for (let i = 0; i < this.queryParams.dataTypeArr.length; i++) {
          dataTypes.push(this.queryParams.dataTypeArr[i]);
        }
        this.queryParams.dataTypeStr = dataTypes.join(","); // 通过"-"连接成字符串
      }

      let checkTypes = [];
      if (this.queryParams.checkTypeArr) {
        for (let i = 0; i < this.queryParams.checkTypeArr.length; i++) {
          checkTypes.push(this.queryParams.checkTypeArr[i]);
        }
        this.queryParams.checkTypeStr = checkTypes.join(","); // 通过"-"连接成字符串
      }

      listCheckResultMessage(this.queryParams).then((response) => {
        this.checkResultMessageList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.bgopen1 = false;
      this.bgopen2 = false;
      this.yxopen = false;
      this.zxopen = false;
      this.problemDescriptionOpen = false;
      this.certificateOpen = false;
      this.reset();
    },
    // 注销取消按钮
    zxcancel() {
      this.zxopen = false;
      this.problemDescriptionOpen = false;
      this.certificateOpen = false;
      this.reset();
    },
    cancelproblem() {
      this.problemDescriptionOpen = false;
      this.unqualified = []
      this.formProblemDescription.checkExplain = ""
      this.formProblemDescription.checkType = null
      this.formProblemDescription.id = null
    },
    // 文件提交处理
    submitUpload() {
      this.$refs.upload.submit();
    },
    //判断文件大小

    //判断文件格式（证件）
    pictureChang(file) {
      var testmsg = file.name.substring(file.name.lastIndexOf(".") + 1);
      // console.log(testmsg);
      const extension = testmsg === "ofd";
      if (!extension) {
        this.$modal.msgError("请上传.ofd文件");
        this.fileList = [];
        this.formCertificateUrl.certificateUrl = null;
        this.formCertificateUrl.effectiveTimeSta = null;
        this.formCertificateUrl.effectiveTimeEnd = null;
        return false;
      }
      return true;
    },
    handleRemove(file, fileList) {
      this.fileList = [];
      this.formCertificateUrl.certificateUrl = null;
      this.formCertificateUrl.effectiveTimeSta = null;
      this.formCertificateUrl.effectiveTimeEnd = null;
    },
    // 文件上传中处理
    handleFileUpload(event, file, fileList) {
      this.upload.isUploading = true;
    },
    // 文件上传成功处理
    handleFileSuccess(response, file, fileList) {
      this.upload.isUploading = false;
      this.formCertificateUrl.certificateUrl = response.url;
      this.$modal.msgSuccess(response.msg);
    },
    /** 文件下载 */
    handleDownloadCredential(row) {
      // console.log(row);
      this.download(
        "checkMessage/applicationMessage/downloadCredential",
        {
          id: row.id,
        },
        row.name + "二级造价师（水利工程）.ofd"
      );
    },
    // 表单重置
    reset() {
      this.form = {
        id: null,
        name: null,
        gender: null,
        dateOfBirth: null,
        certificateType: null,
        idNumber: null,
        graduationSchool: null,
        graduationDate: null,
        profession: null,
        education: null,
        qualification: null,
        credentialsNumber: null,
        issueDate: null,
        companyName: null,
        uscc: null,
        mailingAddress: null,
        icbcSite: null,
        transactorPhone: null,
        applicantPhone: null,
        registrationPlace: null,
        pictureUrl: null,
        signaturePictureUrl: null,
        attachmentUrls: null,
        creationBy: null,
        creationTime: null,
        updateBy: null,
        updateTime: null,
      };
      this.formProblemDescription = {
        id: null,
        checkType: null,
        checkExplain: null,
      };
      this.formCertificateUrl = {
        id: null,
        certificateUrl: null,
        registerNumber: null,
        effectiveTimeSta: null,
        effectiveTimeEnd: null,
      };
      this.formSuccess = {
        id: null,
        dataType: null,
      }
      this.upload.fileList = [];
      this.resetForm("form");
      this.resetForm("problemDescription");
      this.resetForm("certificateUrlRef");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.daterangeIssueDate = [];
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.id);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },
    /** 审核不通过说明按钮操作 */
    handleAdd(type) {
      this.problemDescriptionOpen = true;
      getCheckResultMessage(this.clickRow.id).then((response) => {
        // 过滤掉 fileType 为 9 和 0 的附件信息
        this.unqualifiedOptions = response.data.attachmentUrlDatas
          .filter(it => it.fileType !== 9 && it.fileType !== 0)
          .map(it => {
            return {
              label: it.url.substring(it.url.lastIndexOf("/") + 1), // 提取文件名作为标签
              value: it.url, // 使用 URL 作为值
              fileType: it.fileType
            };
          });
      });
      this.title = "审核不通过原因说明";
    },


    /** 审核不通过说明按钮操作 */
    handleAdd5(row) {
      this.checkExplainString = [];
      this.reset();
      this.formProblemDescription.id = row.id;
      this.problemDescriptionOpen5 = true;
      this.formProblemDescription.checkType = row.checkType;
      //查询审核不通过原因
      if (
        row.checkType === 2 ||
        row.checkType === 5 ||
        row.checkType === "2" ||
        row.checkType === "5"
      ) {
        queryCheckResultMessage(this.formProblemDescription.id).then(
          (response) => {
            // this.checkResultMessageinfo = response.rows;
            let arr = response.data.map((item, index) => {
              return item;
            });
            this.checkExplainString = arr;
          }
        );
      }
      this.title = "审核不通过原因说明";
    },

    /** 详情查看按钮操作 */
    handleUpdate(row) {
      this.clickRow = row
      this.reset();
      this.upload.fileList = [];
      this.uploadSignature.fileList = [];
      this.fileList = [];
      const id = row.id || this.ids;
      if (row.dataType == 1) {
        //初始注册详情
        getCheckResultMessage(id).then((response) => {
          this.form = response.data;
          // 设置图片文件列表
          if (this.form.pictureUrl != null) {
            var pictureName = this.form.pictureUrl.substring(
              this.form.pictureUrl.lastIndexOf("/") + 1
            );
            this.upload.fileList = [
              { name: pictureName, url: this.form.pictureUrl },
            ];
          }
          if (this.form.signaturePictureUrl != null) {
            var signatureName = this.form.signaturePictureUrl.substring(
              this.form.signaturePictureUrl.lastIndexOf("/") + 1
            );
            this.uploadSignature.fileList = [
              { name: signatureName, url: this.form.signaturePictureUrl },
            ];
          }

          // 获取上传附件信息
          response.data.attachmentUrlDatas.forEach((it) => {
            // 定义标题
            let title = '';
            switch (it.fileType) {
              case 1:
                title = '承诺书';
                break;
              case 2:
                title = '申请表';
                break;
              case 3:
                title = '社保证明';
                break;
              case 4:
                title = '劳务合同';
                break;
              case 5:
                title = '继续教育证明';
                break;
              case 6:
                title = '劳务合同';
                break;
              case 7:
                title = '退休证明';
                break;
              case 8:
                title = '意外伤害证明';
                break;
              case 9:
                title = '证件照';
                break;
              case 0:
                title = '签名照';
                break;
              default:
                title = '其他';
            }

            var index = this.fileList.length + 1;
            var attachmentName = it.url.substring(it.url.lastIndexOf("/") + 1);
            this.fileList.push({ title: index + ". " + title, name: attachmentName, url: it.url });
          })
          this.open = true;
          this.title = "查看申请信息详情";
        });

      } else if (row.dataType == 2) {
        this.formProblemDescription.id = row.id;
        this.formProblemDescription.dataType = row.dataType
        console.log(this.formProblemDescription);
        this.formSuccess.id = row.id;
        this.formSuccess.dataType = row.dataType
        //变更注册
        if (row.bgsx === "1") {
          this.bgopen1 = true
          this.bgform.changeRegistrationItems = ["执业单位变更"];
        } else {
          this.bgopen2 = true
          this.bgform.changeRegistrationItems = ["单位名称变更"];
        }


        if (row.gender == 1) {
          this.bgform.gender = "男";
        } else {
          this.bgform.gender = "女";
        }
        if (row.certificateType == 1) {
          this.bgform.certificateType = "身份证"
        } else if (row.certificateType == 2) {
          this.bgform.certificateType = "军官证"
        } else {
          this.bgform.certificateType = "其他"
        }
        // 设置姓名字段
        this.bgform.name = row.name;
        // 设置出生日期字段
        this.bgform.dateOfBirth = row.dateOfBirth;
        // 设置证件号码字段
        this.bgform.idNumber = row.idNumber;
        // 设置资格证书编号字段
        this.bgform.credentialsNumber = row.credentialsNumber;
        // 设置注册证书编号字段
        this.bgform.certificateNumber = row.registerNumber;
        // 设置注册有效期届满时间字段
        this.bgform.validUntil = row.effectiveTimeEnd;
        // 设置现单位名称字段
        this.bgform.companyName = row.companyName;
        // 设置统一社会信用代码字段
        this.bgform.uscc = row.uscc;
        // 设置工商登记地字段
        this.bgform.registrationPlace = row.registrationPlace;
        // 设置经办人手机号码字段
        this.bgform.transactorPhone = row.transactorPhone;
        // 设置申请人手机号码字段
        this.bgform.applicantPhone = row.applicantPhone;
        // 设置注册地字段
        this.bgform.registrationPlace = row.registrationPlace;
        // 设置当前单位代码字段
        this.bgform.currentCompanyCode = row.uscc;
        // 设置当前单位地址字段
        this.bgform.currentCompanyAddress = row.mailingAddress;
        // 设置当前单位工商登记地字段
        this.bgform.currentCompanyRegistrationAddress = row.icbcSite;
        // 设置现注册地字段
        this.bgform.nowRegistrationPlace = row.registrationPlace;
        this.title = "查看申请信息详情";
        // this.bgopen1 = true;
      } else if (row.dataType == 3) {
        this.formProblemDescription.id = row.id;
        this.formProblemDescription.dataType = row.dataType
        console.log(this.formProblemDescription);
        this.formSuccess.id = row.id;
        this.formSuccess.dataType = row.dataType
        // 延续
        if (row.gender == 1) {
          this.yxform.gender = "男";
        } else {
          this.yxform.gender = "女";
        }
        if (row.certificateType == 1) {
          this.yxform.certificateType = "身份证"
        } else if (row.certificateType == 2) {
          this.yxform.certificateType = "军官证"
        } else {
          this.yxform.certificateType = "其他"
        }
        console.log(row);
        console.log(row.registerNumber);
        // 设置姓名字段
        this.yxform.name = row.name;
        // 设置出生日期字段
        this.yxform.dateOfBirth = row.dateOfBirth;
        // 设置证件号码字段
        this.yxform.idNumber = row.idNumber;
        // 设置资格证书编号字段
        this.yxform.credentialsNumber = row.credentialsNumber;
        // 设置注册证书编号字段
        this.yxform.registerNumber = row.registerNumber;
        // 设置注册有效期届满时间字段
        this.yxform.validUntil = row.effectiveTimeEnd;
        // 设置现单位名称字段
        this.yxform.companyName = row.companyName;
        // 设置统一社会信用代码字段
        this.yxform.uscc = row.uscc;
        // 设置通讯地址字段
        this.yxform.address = row.mailingAddress;
        // 设置工商登记地字段
        this.yxform.registrationPlace = row.icbcSite;
        // 设置经办人手机号码字段
        this.yxform.transactorPhone = row.transactorPhone;
        // 设置申请人手机号码字段
        this.yxform.applicantPhone = row.applicantPhone;
        // 设置注册地字段
        this.yxform.registrationPlace = row.registrationPlace;
        this.title = "查看延续信息详情";
        this.yxopen = true;
        //延续注册
      } else if (row.dataType == 4) {
        console.log(row);
        this.formProblemDescription.id = row.id;
        // this.formProblemDescription.checkExplain = row.checkExplain;
        this.formProblemDescription.dataType = row.dataType
        console.log(this.formProblemDescription);
        this.formSuccess.id = row.id;
        this.formSuccess.dataType = row.dataType
        if (row.gender == 1) {
          this.zxform.gender = "男";
        } else {
          this.zxform.gender = "女";
        }
        if (row.certificateType == 1) {
          this.zxform.certificateType = "身份证"
        } else if (row.certificateType == 2) {
          this.zxform.certificateType = "军官证"
        } else {
          this.zxform.certificateType = "其他"
        }
        this.zxform.name = row.name;
        this.zxform.dateOfBirth = row.dateOfBirth;
        this.zxform.idNumber = row.idNumber;
        this.zxform.certificateNumber = row.registerNumber;
        this.zxform.validUntil = row.effectiveTimeEnd;
        this.zxform.zxyy = row.zxyy;
        this.zxform.companyName = row.companyName;
        this.zxform.uscc = row.uscc;
        this.zxform.address = row.mailingAddress;
        this.zxform.registrationPlace = row.icbcSite;
        this.zxform.transactorPhone = row.transactorPhone;
        this.zxform.applicantPhone = row.applicantPhone;
        this.zxform.registrationPlace = row.registrationPlace;
        this.zxopen = true;
        this.title = "查看注销信息详情";
      }
    },
    /** 文件下载 */
    handleDownload(data) {
      console.log(data);
      this.download(
        "checkMessage/checkResultMessage/download",
        {
          id: data.id,
          dataType: data.dataType,
        },
        data.name + "图片和附件压缩文件手机号" + data.applicantPhone + ".zip"
      );
    },

    /** 审核通过按钮 */
    succeedSubmitFrom(type) {
      let paramData = null;
      // this.$refs[abform].validate(valid => {
      //   if (valid) {
      // const formData = type == 1 ? this.form : this.zxform;
      const formData = type == 1 ? this.form : type == 2 ? this.bgform : type == 3 ? this.yxform : this.zxform;
      console.log(formData.dataType);
      let businessType = "初始";
      if (formData.dataType === 1) {
        //初始注册
        businessType = "初始";
      } else if (this.formSuccess.dataType === 2) {
        // 变更注册
        businessType = "变更";
      } else if (this.formSuccess.dataType === 3) {
        // 延续
        businessType = "延续"
      }
      else if (this.formSuccess.dataType === 4) {
        //注销注册
        businessType = "注销";
      }
      if (formData.dataType == 1) {
        paramData = { id: formData.id, dataType: formData.dataType };
      } else {
        paramData = { id: this.formSuccess.id, dataType: this.formSuccess.dataType }
      }

      this.$modal
        .confirm(
          '确定审核通过"' + formData.name + '"的' + businessType + "注册申请？"
        )
        .then(function () {
          return addCheckResultMessageSucceed(paramData);
        })
        .then(() => {
          this.getList();
          this.open = false;
          this.zxopen = false;
          // console.log("=======>>");
          this.$modal.msgSuccess("操作成功");
          this.open = false
          this.bgopen1 = false;
          this.bgopen2 = false;
          // this.yxform = false;
          this.zxopen = false
          this.yxopen = false;
          // this.$modal.msgSuccess("操作成功");
        })
        .catch(() => { });
      // }
      // });
    },
    /** 提交按钮 */
    // 重写文件上传方法,覆盖原有的上传方法，将上传的文件依次添加到fileList数组中
    httpRequest(option) { },
    /** 审核失败按钮 */
    failSubmitForm() {
      this.$refs["problemDescription"].validate((valid) => {
        if (valid) {
          // 获取选中的不合格材料的 fileType
          const fileTypeStr = this.unqualified
            .map(selected => {
              const option = this.unqualifiedOptions.find(opt => opt.value === selected);
              return option ? option.fileType : '';
            })
            .filter(fileType => fileType) // 去除无效的空字符串
            .join(',');

          console.log(this.formProblemDescription);

          let id = this.formProblemDescription.id;
          let applicationType = this.formProblemDescription.dataType;
          let checkExplain = this.formProblemDescription.checkExplain;

          // 创建提交数据对象
          const formData = {
            id,
            applicationType,
            checkExplain,
            fileTypeStr // 改为 fileTypeStr
          };

          console.log(formData);
          this.$modal
            .confirm("确定不通过当前的申请？")
            .then(() => addCheckResultMessageFail(formData))
            .then(() => {
              this.getList();
              this.problemDescriptionOpen = false;
              this.$modal.msgSuccess("操作成功");
              this.open = false
              this.bgopen1 = false;
              this.bgopen2 = false;
              this.yxopen = false;
              this.zxopen = false
              // this.yxform = false;
            })
            .catch(() => { });
        }
      });
    },

    // failSubmitForm() {
    //   this.$refs["problemDescription"].validate((valid) => {
    //     if (valid) {
    //       console.log( this.unqualified);
    //       // 获取检查说明和文件类型字符串
    //       // const checkExplain = this.formProblemDescription.checkExplain;
    //       const fileType = this.unqualified.join(',');
    //       let id=this.formProblemDescription.id
    //       let applicationType=this.formProblemDescription.checkType
    //       let checkExplain=this.formProblemDescription.checkExplain
    //       // 创建提交数据对象并适配图片中显示的参数
    //       const formData = {
    //         id,
    //         applicationType,
    //         checkExplain,
    //         fileType: fileType // 提交选中的不合格材料作为字符串
    //       };
    //       console.log(formData);
    //       this.$modal
    //         .confirm("确定不通过当前的申请？")
    //         .then(() => addCheckResultMessageFail(formData))
    //         .then(() => {
    //           this.getList();
    //           this.problemDescriptionOpen = false;
    //           this.$modal.msgSuccess("操作成功");
    //         })
    //         .catch(() => { });
    //     }
    //   });
    // },


    //证书下发中撤回
    handleWithdrawalDuringIssuance(row) {
      let params = {
        applicationId: row.id,
      };
      this.$modal
        .confirm("确定撤回当前的审核？")
        .then(function () {
          return withdrawalDuringIssuance(params);
        })
        .then(() => {
          this.getList();
          this.problemDescriptionOpen = false;
          // this.$modal.msgSuccess("操作成功");
          this.open = false;
          // console.log("=======>>");
          this.$modal.msgSuccess("操作成功");
        })
        .catch(() => { });
    },
    //已下发证书撤回
    handleIssuedWithdrawal(row) {
      let params = {
        applicationId: row.id,
      };
      this.$modal
        .confirm("确定撤回当前的审核？")
        .then(function () {
          return issuedWithdrawal(params);
        })
        .then(() => {
          this.getList();
          this.problemDescriptionOpen = false;
          // this.$modal.msgSuccess("操作成功");
          this.open = false;
          // console.log("=======>>");
          this.$modal.msgSuccess("操作成功");
        })
        .catch(() => { });
    },

    /** 上传证书地址数据提交按钮 */
    certificateUrlSubmitForm(row) {
      // 弹出确认对话框
      this.$modal
        .confirm("确定为 " + row.name + " 发放证书吗？")
        .then(() => {
          // 显示加载动画
          const loadingInstance = this.$loading({
            lock: true,
            text: "证书发放中，请稍候...",
            spinner: "el-icon-loading",
            background: "rgba(0, 0, 0, 0.7)"
          });

          // 将传入的行数据作为提交数据使用
          this.formCertificateUrl = {
            id: row.id,
            applicationType: row.dataType
          };
          console.log(this.formCertificateUrl);

          // 提交表单并处理结果
          return updateCheckResultMessage(this.formCertificateUrl).finally(() => {
            // 隐藏加载动画
            loadingInstance.close();
          });
        })
        .then(() => {
          this.getList();
          this.problemDescriptionOpen = false;
          this.open = false;
          this.$modal.msgSuccess("操作成功");
        })
        .catch(() => {
          // 如果用户取消操作或提交失败
          this.$modal.msgError("提交失败，请重试");
        });
    },



    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$modal
        .confirm('是否确认删除审核结果信息编号为"' + ids + '"的数据项？')
        .then(function () {
          return delCheckResultMessage(ids);
        })
        .then(() => {
          this.getList();
          this.$modal.msgSuccess("删除成功");
        })
        .catch(() => { });
    },
  },
};
</script>
<style>
/* .el-form-item__label {
  white-space: nowrap;
} */
.el-upload-list__item {
  background-color: #fff !important;
}

.file-item .file-info:hover {
  background-color: #fafafa;
  color: #fff;
  /* 确保文本在深色背景下仍然可见 */
}


.activity-content {
  margin-left: 20px;
}

.activity-title {
  font-weight: bold;
  margin-bottom: 5px;
}

.activity-department {
  font-size: 14px;
  color: #666;
  margin: 5px 0;
}

.activity-dates {
  font-size: 12px;
  color: #888;
  margin: 2px 0;
}
</style>

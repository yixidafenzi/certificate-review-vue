<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <!-- <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item> -->
    </el-form>

    <el-row :gutter="20" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd"
          v-hasPermi="['checkMessage:applicationMessage:add']">初始注册</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="primary" plain icon="el-icon-delete" size="mini" @click="handleDel"
          v-hasPermi="['checkMessage:applicationMessage:remove']">注销注册</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="primary" plain icon="el-icon-download" size="mini"
          @click="templateDownload">申请文件模版下载</el-button>
      </el-col>
      <!-- <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['checkMessage:applicationMessage:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['checkMessage:applicationMessage:remove']"
        >删除</el-button>
      </el-col> -->
      <!-- <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['checkMessage:applicationMessage:export']"
        >导出</el-button>
      </el-col> -->
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="applicationMessageList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <!-- <el-table-column label="主键" align="center" prop="id" /> -->
      <el-table-column label="姓名" align="center" prop="name" />
      <el-table-column label="性别" align="center" prop="gender">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.gender" :value="scope.row.gender" />
        </template>
      </el-table-column>
      <el-table-column label="出生年月" align="center" prop="dateOfBirth" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.dateOfBirth, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="申请类型" align="center" prop="dataType">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.data_type" :value="scope.row.dataType" />
        </template>
      </el-table-column>
      <el-table-column label="审核状态" align="center" prop="checkType">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.check_type" :value="scope.row.checkType" />
        </template>
      </el-table-column>
      <el-table-column label="申领时间" align="center" prop="applyTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.applyTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="修改时间" align="center" prop="updateTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.updateTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)"
            :style="{ display: scope.row.checkType == 0 || scope.row.checkType == 2 ? '' : 'none' }"
            v-hasPermi="['checkMessage:applicationMessage:edit']">修改</el-button>
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)"
            :style="{ display: scope.row.checkType != 0 && scope.row.checkType != 2 && scope.row.checkType != 6 ? '' : 'none' }"
            v-hasPermi="['checkMessage:applicationMessage:edit']">查看详情</el-button>
          <el-button size="mini" type="text" icon="el-icon-refresh" @click="revocation(scope.row)"
            :style="{ display: scope.row.checkType == 1 || scope.row.checkType == 5 ? '' : 'none' }"
            v-hasPermi="['checkMessage:applicationMessage:edit']">撤回</el-button>
          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleProblemDescription(scope.row.id)"
            :style="{ display: scope.row.checkType == 2 ? '' : 'none' }"
            v-hasPermi="['checkMessage:applicationMessage:query']">查看申请失败原因</el-button>
          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)"
            :style="{ display: scope.row.checkType == 0 || scope.row.checkType == 2 ? '' : 'none' }"
            v-hasPermi="['checkMessage:applicationMessage:remove']">删除</el-button>
          <el-button size="mini" type="text" icon="el-icon-download" @click="handleDownloadCredential(scope.row)"
            :style="{ display: scope.row.checkType == 4 ? '' : 'none' }"
            v-hasPermi="['checkMessage:applicationMessage:remove']">下载证书</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
      @pagination="getList" />

    <!-- 添加或修改申请人信息对话框 -->
    <el-dialog :title="title" :visible.sync="open" :close-on-click-modal="false" width="900px" append-to-body>
      <div style="width: 800px; margin: 0 auto;">

        <el-form ref="form" :model="form" :rules="rulesAdd" label-width="120px" label-position="top">

          <el-row :gutter="20">
            <el-form-item label="个人基本信息:" />
          </el-row>
          <el-row :gutter="20">
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="姓名" prop="name">
                  <el-input v-model="form.name" placeholder="请输入姓名" :disabled="!displayShow" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="性别" prop="gender">
                  <el-radio-group v-model="form.gender">
                    <el-radio :disabled="!displayShow" v-for="dict in dict.type.gender" :key="dict.value"
                      :label="parseInt(dict.value)">{{ dict.label }}</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="出生年月" prop="dateOfBirth">
                  <el-date-picker clearable :disabled="!displayShow" v-model="form.dateOfBirth" type="date"
                    value-format="yyyy-MM-dd" placeholder="请选择出生年月">
                  </el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="证件类型" prop="certificateType">
                  <el-radio-group v-model="form.certificateType">
                    <el-radio :disabled="!displayShow" v-for="dict in dict.type.certificate_type" :key="dict.value"
                      :label="parseInt(dict.value)">{{ dict.label }}</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="证件号码" prop="idNumber"
                  :rules="form.certificateType == 1 ? ruleIdNumber : (form.certificateType == 2 ? ruleOfficerNumber : ruleOtherNumber)">
                  <el-input v-model="form.idNumber" placeholder="请输入证件号码" :disabled="!displayShow" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="毕业院校" prop="graduationSchool">
                  <el-input v-model="form.graduationSchool" placeholder="请输入毕业院校" :disabled="!displayShow" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="毕业时间" prop="graduationDate">
                  <el-date-picker clearable :disabled="!displayShow" v-model="form.graduationDate" type="date"
                    value-format="yyyy-MM-dd" placeholder="请选择毕业时间">
                  </el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="专业" prop="profession">
                  <el-input v-model="form.profession" placeholder="请输入专业" :disabled="!displayShow" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="学历" prop="education">
                  <el-input v-model="form.education" placeholder="请输入学历" :disabled="!displayShow" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="学位" prop="qualification">
                  <el-input v-model="form.qualification" placeholder="请输入学位" :disabled="!displayShow" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="二造职业资格证书编号" prop="credentialsNumber">
                  <el-input v-model="form.credentialsNumber" placeholder="请输入二造职业资格证书编号" :disabled="!displayShow" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="批准日期" prop="issueDate">
                  <el-date-picker clearable :disabled="!displayShow" v-model="form.issueDate" type="date"
                    value-format="yyyy-MM-dd" placeholder="请选择批准日期">
                  </el-date-picker>
                </el-form-item>
              </el-col>
            </el-row>
          </el-row>
          <el-divider content-position="left"></el-divider>
          <el-row :gutter="20">
            <el-form-item label="聘用单位信息:" label-width="130px" style="margin-bottom: 0px;" />
          </el-row>
          <el-row :gutter="20">
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="单位名称" prop="companyName">
                  <el-input v-model="form.companyName" placeholder="请输入单位名称" :disabled="!displayShow" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="统一社会信用代码" prop="uscc">
                  <el-input v-model="form.uscc" placeholder="请输入统一社会信用代码" :disabled="!displayShow" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="通信地址" prop="mailingAddress">
                  <el-input v-model="form.mailingAddress" placeholder="请输入通讯地址" :disabled="!displayShow" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="工商登记地" prop="icbcSite">
                  <el-input v-model="form.icbcSite" placeholder="请输入工商登记地" :disabled="!displayShow" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="经办人手机号码" prop="transactorPhone">
                  <el-input v-model="form.transactorPhone" placeholder="请输入经办人手机号码" :disabled="!displayShow" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="申请人手机号码" prop="applicantPhone">
                  <el-input v-model="form.applicantPhone" placeholder="请输入申请人手机号码" :disabled="!displayShow" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="注册地" prop="registrationPlace">
                  <el-input v-model="form.registrationPlace" placeholder="请输入注册地" :disabled="!displayShow" />
                </el-form-item>
              </el-col>

            </el-row>
          </el-row>
          <el-divider content-position="left"></el-divider>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="证件照（近期白底免冠）" prop="pictureUrl">
                <el-upload ref="upload" :limit="1" accept=".jpg" :action="upload.url" :headers="upload.headers"
                  :file-list="upload.fileList" :before-upload="pictureChang" :on-progress="handleFileUploadProgress"
                  :on-success="handleFileSuccessPicture" :on-remove="handleRemoveProgress" list-type="picture"
                  :multiple="false">
                  <el-button slot="trigger" size="small" type="primary"
                    :style="{ display: displayType }">选取照片</el-button>
                  <div slot="tip" class="el-upload__tip" :style="{ display: displayType }">
                    只能上传jpg文件，大小在10～200KB之间，建议比例5:7
                  </div>
                </el-upload>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="手写签名" prop="signaturePictureUrl">
                <el-upload ref="uploadSignature" :limit="1" accept=".jpg" :action="uploadSignature.url"
                  :headers="uploadSignature.headers" :file-list="uploadSignature.fileList"
                  :before-upload="pictureSignatureChang" :on-progress="handleFileUploadSignatureProgress"
                  :on-success="handleFileSuccessSignature" list-type="picture" :on-remove="handleRemoveSignature"
                  :multiple="false">
                  <el-button slot="trigger" size="small" type="primary"
                    :style="{ display: displayType }">选取照片</el-button>
                  <div slot="tip" class="el-upload__tip" :style="{ display: displayType }">只能上传jpg文件，大小小于50KB，建议比例45:11
                  </div>
                </el-upload>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="上传附件" prop="attachmentUrls">
                <div v-if="displayType == 'none'">
                  <div class="mt20">
                    <p v-for="(item, index) in uploadFile.fileList" :key="index">{{ item.name }}</p>
                  </div>
                </div>
                <el-upload v-else :action="uploadFile.url" :headers="uploadFile.headers"
                  :file-list="uploadFile.fileList" name="files" accept=".doc, .pdf, .zip, .rar"
                  :before-upload="beforeUploadClick" :on-exceed="handleExceed" :before-remove="beforeRemove"
                  :on-remove="handleRemove" :on-success="handleFileSuccessFiles" :limit="4" multiple list-type="text">
                  <el-button slot="trigger" size="small" type="primary"
                    :style="{ display: displayType }">选取文件</el-button>
                  <div slot="tip" class="el-upload__tip">请上传相关附件，可上传.doc/.pdf/.zip/.rar格式</div>
                </el-upload>

              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="">
                <el-button size="mini" type="text" icon="el-icon-edit" @click="handleDownload(form)"
                  :disabled="displayShow">图片和附件下载</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>

      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm" :style="{ display: displayType }">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 注销注册申请人信息对话框 -->
    <el-dialog :title="title" :visible.sync="zxopen" :close-on-click-modal="false" width="600px" append-to-body>
      <div style="width: 600px; margin: 0 auto;">

        <el-form ref="zxform" :model="zxform" :rules="rulesDel" label-width="120px" label-position="top">

          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="上传附件" prop="zxattachmentUrls">
                <div v-if="zxdisplayType == 'none'">
                  <div class="mt20">
                    <p v-for="(item, index) in zxuploadFile.fileList" :key="index">{{ item.name }}</p>
                  </div>
                </div>
                <el-upload v-else :action="zxuploadFile.url" :headers="zxuploadFile.headers"
                  :file-list="zxuploadFile.fileList" name="files" accept=".doc, .pdf, .zip, .rar"
                  :before-upload="beforeUploadClick" :on-exceed="zxhandleExceed" :before-remove="zxbeforeRemove"
                  :on-remove="zxhandleRemove" :on-success="zxhandleFileSuccessFiles" :limit="4" multiple
                  list-type="text">
                  <el-button slot="trigger" size="small" type="primary"
                    :style="{ display: zxdisplayType }">选取文件</el-button>
                  <div slot="tip" class="el-upload__tip">请上传相关附件，可上传.doc/.pdf/.zip/.rar格式</div>
                </el-upload>

              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="">
                <el-button size="mini" type="text" icon="el-icon-edit" @click="handleDownload(form)"
                  :disabled="zxdisplayShow">图片和附件下载</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>

      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="zxsubmitForm" :style="{ display: zxdisplayType }">确 定</el-button>
        <el-button @click="zxcancel">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 审核不通过说明对话框 -->
    <el-dialog :title="title" :visible.sync="problemDescriptionOpen" width="500px" append-to-body>
      <el-form ref="problemDescription" :model="formProblemDescription" :rules="rules" label-width="80px">
        <el-form-item label="审核说明" prop="checkExplain">
          <el-input v-model="formProblemDescription.checkExplain" disabled="true" type="textarea" placeholder="请输入内容" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>


<style scoped>
.el-form>>>.el-row .el-col .el-form-item .el-form-item__label {
  white-space: pre-line;
  /*换行显示*/
  height: 40px;
  /*设置lable高度，与input高度一样*/
  line-height: 20px !important;
  /*设置行高为label高度的一半（有n行就是label高度的1/n）*/
}
</style>

<script>
import {
  listApplicationMessage, getApplicationMessage,
  delApplicationMessage, addApplicationMessage, getProblemDescription,
  updateApplicationMessage, zxupdateApplicationMessage, revocationDate
} from "@/api/checkMessage/applicationMessage";
import { getAttachmentUrlDataByZx } from "@/api/checkMessage/checkResultMessage";


import { validateIdNumber, validateOfficerNumber } from "@/utils/validate";
import { getToken } from "@/utils/auth";
import axios from 'axios'

export default {
  name: "ApplicationMessage",
  dicts: ['check_type', 'certificate_type', 'gender', 'data_type'],
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      //禁止修改
      displayType: '',
      zxdisplayType: '',
      displayShow: true,
      zxdisplayShow: true,
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 申请人信息表格数据
      applicationMessageList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 是否显示弹出层（注销）
      zxopen: false,
      // 是否显示弹出层(问题说明)
      problemDescriptionOpen: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
      },
      // 表单参数
      form: {},
      zxform: {},
      formProblemDescription: {},
      rulesAdd: {
        pictureUrl: [{ required: true, trigger: "change", message: "请上传证件照" }],
        signaturePictureUrl: [{ required: true, trigger: "change", message: "请上传手写签名" }],
        attachmentUrls: [{ required: true, trigger: "change", message: "请上传附件" }],
        name: [
          { required: true, message: "姓名不能为空", trigger: "blur" }
        ],
        gender: [
          { required: true, message: "性别不能为空", trigger: "blur" }
        ],
        dateOfBirth: [
          { required: true, message: "出生年月不能为空", trigger: "blur" }
        ],
        certificateType: [
          { required: true, message: "证件类型不能为空", trigger: "change" },

        ],
        graduationSchool: [
          { required: true, message: "毕业院校不能为空", trigger: "blur" }
        ],
        graduationDate: [
          { required: true, message: "毕业时间不能为空", trigger: "blur" }
        ],
        profession: [
          { required: true, message: "专业不能为空", trigger: "blur" },
          { min: 2, max: 20, message: '请正确填写专业', trigger: 'blur' }
        ],
        education: [
          { required: true, message: "学历不能为空", trigger: "blur" },
          { min: 2, max: 10, message: '请正确填写学历', trigger: 'blur' }
        ],
        qualification: [
          { required: true, message: "学位不能为空", trigger: "blur" },
          { min: 1, max: 10, message: '请正确填写学位', trigger: 'blur' }
        ],
        credentialsNumber: [
          { required: true, message: "资格证书编号不能为空", trigger: "blur" },
          { pattern: /^[A-Za-z0-9]{2,19}$/, message: '资格证书编号长度不得超过20，并且不能包含文字以及特殊字符', trigger: 'blur' }
        ],
        issueDate: [
          { required: true, message: "签发日期不能为空", trigger: "blur" }
        ],
        companyName: [
          { required: true, message: "单位名称不能为空", trigger: "blur" }
        ],
        uscc: [
          { required: true, message: "统一社会信用代码不能为空", trigger: "blur" },
          {
            pattern: /^([0-9A-HJ-NPQRTUWXY]{2}\d{6}[0-9A-HJ-NPQRTUWXY]{10}|[1-9]\d{14})$/,
            message: "请输入正确格式的统一社会信用代码",
            trigger: "blur"
          }
        ],
        mailingAddress: [
          { required: true, message: "通讯地址不能为空", trigger: "blur" }
        ],
        icbcSite: [
          { required: true, message: "工商登记地不能为空", trigger: "blur" }
        ],
        transactorPhone: [
          { required: true, message: "经办人手机号码不能为空", trigger: "blur" },
          {
            pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
            message: "请输入正确的手机号码",
            trigger: "blur"
          }
        ],
        applicantPhone: [
          { required: true, message: "申请人手机号码不能为空", trigger: "blur" },
          {
            pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
            message: "请输入正确的手机号码",
            trigger: "blur"
          }
        ],
        registrationPlace: [
          { required: true, message: "注册地不能为空", trigger: "blur" }
        ],
      },
      rulesDel: {
        zxattachmentUrls: [{ required: true, trigger: "change", message: "请上传zx附件" }],
      },
      // 身份证表单校验
      ruleIdNumber: [
        { required: true, trigger: "blur", validator: validateIdNumber },
      ],
      // 军官证表单校验
      ruleOfficerNumber: [
        { required: true, trigger: "blur", validator: validateOfficerNumber },
      ],
      ruleOtherNumber: [
        { required: true, message: "证件号码不能为空", trigger: "blur" },
        { max: 18, message: '请正确填写证件号码', trigger: 'blur' }
      ],
      // 表单校验
      rules: {

      },
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
      uploadFile: {
        // 设置上传的请求头部
        headers: { Authorization: "Bearer " + getToken() },
        // 上传的地址
        url: process.env.VUE_APP_BASE_API + "/common/uploads",
        //附件数据
        fileList: []
      },
      zxuploadFile: {
        // 设置上传的请求头部
        headers: { Authorization: "Bearer " + getToken() },
        // 上传的地址
        url: process.env.VUE_APP_BASE_API + "/common/uploads",
        //附件数据
        fileList: []
      },
      //附件数据
      fileList: []
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询申请人信息列表 */
    getList() {
      this.loading = true;
      listApplicationMessage(this.queryParams).then(response => {
        this.applicationMessageList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.problemDescriptionOpen = false;
      this.reset();
      this.upload.fileList = [];
      this.uploadSignature.fileList = [];
      this.uploadFile.fileList = [];
    },
    // 注销取消按钮
    zxcancel() {
      this.zxopen = false;
      this.problemDescriptionOpen = false;
      this.reset();
      this.upload.fileList = [];
      this.uploadSignature.fileList = [];
      this.uploadFile.fileList = [];
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
        updateTime: null
      };
      this.zxform = {
        attachmentUrls: null,
        zxattachmentUrls: null,
      };
      this.formProblemDescription = {
        id: null,
        checkExplain: null,
      };
      this.resetForm("form");
      this.resetForm("problemDescription");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.upload.fileList = [];
      this.uploadSignature.fileList = [];
      this.uploadFile.fileList = [];
      this.open = true;
      this.displayType = '';
      this.displayShow = true;
      this.title = "添加申请人信息";
    },
    /** 注销按钮操作 */
    handleDel() {
      this.reset();
      this.upload.fileList = [];
      this.uploadSignature.fileList = [];
      this.uploadFile.fileList = [];
      this.displayType = '';

      if (this.applicationMessageList == null || this.applicationMessageList.length < 1 ||
        (this.applicationMessageList[0].checkType == 6 && this.applicationMessageList[0].dataType == 4) ||
        (this.applicationMessageList[0].checkType != 4 && this.applicationMessageList[0].dataType != 4)
      ) {
        this.$modal.msgError("请先完成初始注册");
      } else {
        this.zxform.id = this.applicationMessageList[0].id;
        this.zxopen = true;
        this.displayShow = true;
        this.title = "注销申请人信息";
      }
    },
    /** 问题描述 */
    handleProblemDescription(id) {
      this.reset();
      getProblemDescription(id).then(response => {

        this.formProblemDescription = response.data;
        this.problemDescriptionOpen = true;
        this.title = "问题描述";
      });
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      this.upload.fileList = [];
      this.uploadSignature.fileList = [];
      this.uploadFile.fileList = [];
      const id = row.id || this.ids
      if (row.dataType == 1) {//初始注册详情
        getApplicationMessage(id).then(response => {
          this.form = response.data;
          if (this.form.pictureUrl != null) {
            var pictureName = this.form.pictureUrl.substring(this.form.pictureUrl.lastIndexOf('/') + 1);
            this.upload.fileList = [{ name: pictureName, url: this.form.pictureUrl }];
          }
          if (this.form.signaturePictureUrl != null) {
            var signatureName = this.form.signaturePictureUrl.substring(this.form.signaturePictureUrl.lastIndexOf('/') + 1);
            this.uploadSignature.fileList = [{ name: signatureName, url: this.form.signaturePictureUrl }];
          }
          // console.log(this.form);
          // // 获取上传附件信息
          // const attachmentData = new FormData()
          // // 将上传文件数组依次添加到参数attachmentData中
          response.data.attachmentUrlDatas.forEach((it, index) => {
            // console.log(it.url);
            var attachmentName = it.url.substring(it.url.lastIndexOf('/') + 1);
            this.uploadFile.fileList.push({ name: attachmentName, url: it.url });
          });
          console.log(this.uploadFile.fileList);
          if (this.form.checkType == 0 || this.form.checkType == 2) {
            this.displayType = '';
            this.displayShow = true;
            this.title = "修改申请人信息";

          } else {
            this.displayType = 'none';
            this.displayShow = false;
            this.title = "查看详情";
          }
          // console.log(this.fileList);
          this.open = true;

        });
      } else if (row.dataType == 4) {//注销注册详情
        getAttachmentUrlDataByZx(id).then(response => {
          this.zxform = response.data;
          this.zxform.checkType = row.checkType;
          this.zxform.dataType = row.dataType;
          this.zxform.name = row.name;
          this.zxform.applicantPhone = row.applicantPhone;
          if (this.zxform.pictureUrl != null) {
            var pictureName = this.zxform.pictureUrl.substring(this.zxform.pictureUrl.lastIndexOf('/') + 1);
            this.upload.fileList = [{ name: pictureName, url: this.zxform.pictureUrl }];
          }
          response.data.attachmentUrlDatas.forEach((it, index) => {
            console.log(it.url);
            var attachmentName = it.url.substring(it.url.lastIndexOf('/') + 1);
            this.fileList.push({ name: attachmentName, url: it.url });
          });
          this.zxdisplayType = 'none';
          this.zxopen = true;
          this.title = "查看申请信息详情";
        });
      }


    },
    /** 撤回按钮操作 */
    revocation(row) {
      this.$modal.confirm('是否确认撤回数据项？').then(function () {
        return revocationDate(row.id);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("撤回成功");
      }).catch(() => { });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateApplicationMessage(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.getList();
              this.open = false;
            });
          } else {
            addApplicationMessage(this.form).then(response => {
              this.$modal.msgSuccess("新增成功");
              this.getList();
              this.open = false;
            });
          }
        }
      });
    },
    /** 注销按钮 */
    zxsubmitForm() {
      this.$refs["zxform"].validate(valid => {
        if (valid) {
          console.log(this.zxform.id);
          if (this.zxform.id != null) {
            this.zxform.attachmentUrls = this.zxform.zxattachmentUrls;
            zxupdateApplicationMessage(this.zxform).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.getList();
              this.zxopen = false;
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$modal.confirm('是否确认删除申请人信息编号为"' + ids + '"的数据项？').then(function () {
        return delApplicationMessage(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => { });
    },
    // 文件提交处理
    submitUpload() {
      this.$refs.upload.submit();
    },

    //判断文件大小与后缀（证件照）

    pictureChang(file) {
      let imgSize = Number(file.size / 1024);  // 获取文件大小 (KB)

      // 获取文件扩展名并进行扩展名验证
      const extension = file.name.substring(file.name.lastIndexOf('.') + 1).toLowerCase();
      if (extension !== 'jpg') {
        this.$modal.msgError("请上传.jpg文件");
        this.upload.isUploading = false;
        this.upload.fileList = [];
        this.form.signaturePictureUrl = null;
        return false;
      }

      // 判断文件大小
      if (imgSize < 10) {
        this.$modal.msgError("图片小于10KB");
        this.upload.isUploading = false;
        this.upload.fileList = [];
        this.form.signatureProgress = null;
        return false;
      }
      if (imgSize > 200) {
        this.$modal.msgError("图片大于200KB");
        this.upload.isUploading = false;
        this.upload.fileList = [];
        this.form.signatureProgress = null;
        return false;
      }

      // 使用 FileReader 验证文件真实 MIME 类型，避免用户通过直接将png修改为jpg格式
      return new Promise((resolve, reject) => {
        const reader = new FileReader();

        // 当文件读取完毕后进行 MIME 类型检查
        reader.onloadend = (e) => {
          const arr = new Uint8Array(e.target.result).subarray(0, 4);  // 获取前4个字节的二进制数据
          let header = '';
          for (let i = 0; i < arr.length; i++) {
            header += arr[i].toString(16);  // 转换成16进制字符串
          }

          // 通过文件头判断真实类型（JPEG的文件头以 ffd8 开头）
          let fileType = '';
          switch (header) {
            case 'ffd8ffe0':
            case 'ffd8ffe1':
            case 'ffd8ffe2':
            case 'ffd8ffe3':
              fileType = 'image/jpeg';
              break;
            default:
              fileType = 'unknown';
          }

          if (fileType === 'image/jpeg') {
            resolve(true);  // 如果是真实的JPEG文件，允许上传
          } else {
            this.$modal.msgError("文件类型错误，请上传真实的 .jpg 文件");
            this.upload.isUploading = false;
            this.upload.fileList = [];
            this.form.signaturePictureUrl = null;
            reject(false);
          }
        };

        reader.readAsArrayBuffer(file);  // 读取文件为二进制数组
      });
    },

    handleRemoveProgress(file, fileList) {
      this.upload.fileList = [];
      this.form.signatureProgress = null;
    },
    // 文件上传中处理(证件照)
    handleFileUploadProgress(event, file, fileList) {
      this.upload.isUploading = true;
    },
    // 文件上传成功处理(证件照)
    handleFileSuccessPicture(response, file, fileList) {
      this.upload.isUploading = false;
      this.form.pictureUrl = response.url;
      this.$modal.msgSuccess(response.msg);
    },

    // 文件提交处理（手写签名）
    submitUploadSignature() {
      this.$refs.uploadSignature.submit();
    },
    //判断文件大小（手写签名）
    pictureSignatureChang(file) {
      let imgSize = Number(file.size / 1024);
      var testmsg = file.name.substring(file.name.lastIndexOf('.') + 1);
      const extension = testmsg === 'jpg';
      if (!extension) {
        this.$modal.msgError("请上传.jpg文件");
        this.uploadSignature.isUploading = false;
        this.uploadSignature.fileList = [];
        this.form.signaturePictureUrl = null;
        return false;
      }
      if (50 <= imgSize) {
        this.$modal.msgError("图片大于50KB");
        this.uploadSignature.isUploading = false;
        this.uploadSignature.fileList = [];
        this.form.signaturePictureUrl = null;
        return false;
      }

      // 使用 FileReader 验证文件真实 MIME 类型，避免用户通过直接将png修改为jpg格式
      return new Promise((resolve, reject) => {
        const reader = new FileReader();

        // 当文件读取完毕后进行 MIME 类型检查
        reader.onloadend = (e) => {
          const arr = new Uint8Array(e.target.result).subarray(0, 4);  // 获取前4个字节的二进制数据
          let header = '';
          for (let i = 0; i < arr.length; i++) {
            header += arr[i].toString(16);  // 转换成16进制字符串
          }

          // 通过文件头判断真实类型（JPEG的文件头以 ffd8 开头）
          let fileType = '';
          switch (header) {
            case 'ffd8ffe0':
            case 'ffd8ffe1':
            case 'ffd8ffe2':
            case 'ffd8ffe3':
              fileType = 'image/jpeg';
              break;
            default:
              fileType = 'unknown';
          }

          if (fileType === 'image/jpeg') {
            resolve(true);  // 如果是真实的JPEG文件，允许上传
          } else {
            this.$modal.msgError("文件类型错误，请上传真实的 .jpg 文件");
            this.upload.isUploading = false;
            this.upload.fileList = [];
            this.form.signaturePictureUrl = null;
            reject(false);
          }
        }
        reader.readAsArrayBuffer(file);  // 读取文件为二进制数组
      });
    },
    // return true;

    handleRemoveSignature(file, fileList) {
      this.uploadSignature.fileList = [];
      this.form.signaturePictureUrl = null;
    },
    // 文件上传中处理(手写签名)
    handleFileUploadSignatureProgress(event, file, fileList) {
      this.uploadSignature.isUploading = true;
    },
    // 文件上传成功处理(手写签名)
    handleFileSuccessSignature(response, file, fileList) {
      this.uploadSignature.isUploading = false;
      this.form.signaturePictureUrl = response.url;
      this.$modal.msgSuccess(response.msg);
    },

    // 文件提交处理（附件）
    /** 提交按钮 */
    // 重写文件上传方法,覆盖原有的上传方法，将上传的文件依次添加到fileList数组中
    httpRequest(option) {
      // console.log(option);
      this.uploadFile.fileList.push(option.file)
    },
    // 上传前处理
    beforeUploadClick(file) {
      // const isSize = file.size / 1024 / 1024 < 20;
      // console.log(92, isSize);
      // if (!isSize) {
      //   this.$message.error("文件大小不能超过20M！");
      //   return false;
      // }
      // return true;
    },
    // 文件数量过多时提醒
    handleExceed() {
      this.$modal.msgError("最多支持4个附件上传");
    },
    // 文件数量过多时提醒
    zxhandleExceed() {
      this.$modal.msgError("最多支持4个附件上传");
    },
    //删除处理
    beforeRemove(file, fileList) {
      return this.$confirm("是否要删除" + file.name + '?');
    },
    //删除处理
    zxbeforeRemove(file, fileList) {
      return this.$confirm("是否要删除" + file.name + '?');
    },
    handleRemove(file, fileList) {
      this.uploadFile.fileList = fileList;
      let attachmentUrlArray = this.uploadFile.fileList.map(item => item.url);
      this.form.attachmentUrls = attachmentUrlArray.join(',');
    },
    zxhandleRemove(file, fileList) {
      this.zxuploadFile.fileList = fileList;
      let attachmentUrlArray = this.zxuploadFile.fileList.map(item => item.url);
      this.zxform.zxattachmentUrls = attachmentUrlArray.join(',');
    },
    // 附件提交
    handleFileSuccessFiles(res, file) {
      if (res.code === 200) {
        this.uploadFile.fileList.push({ name: res.newFileNames, url: res.urls });
        let attachmentUrlArray = this.uploadFile.fileList.map(item => item.url);
        this.form.attachmentUrls = attachmentUrlArray.join(',');
        this.$modal.msgSuccess("上传附件成功");
      } else {
        this.$modal.msgError("上传附件失败");
      }
    },
    // 附件提交
    zxhandleFileSuccessFiles(res, file) {
      if (res.code === 200) {
        this.zxuploadFile.fileList.push({ name: res.newFileNames, url: res.urls });
        let attachmentUrlArray = this.zxuploadFile.fileList.map(item => item.url);
        this.zxform.zxattachmentUrls = attachmentUrlArray.join(',');
        this.$modal.msgSuccess("上传附件成功");
      } else {
        this.$modal.msgError("上传附件失败");
      }
    },
    /** 图片 附件文件下载 */
    handleDownload(data) {
      this.download('checkMessage/checkResultMessage/download', {
        id: data.id,
        dataType: data.dataType
      }, data.name + "图片和附件压缩文件手机号" + data.applicantPhone + ".zip")
    },

    /** 证书文件下载 */
    handleDownloadCredential(row) {
      this.download('checkMessage/applicationMessage/downloadCredential', {
        id: row.id
      }, row.name + "二级造价师（水利工程）.ofd")
    },

    /** 申请文件模版下载 */
    templateDownload() {
      this.download('checkMessage/applicationMessage/templateDownload', {}, "山东省二级造价师（水利工程）申请表模板.rar");
    },

    /** 导出按钮操作 */
    handleExport() {
      this.download('checkMessage/applicationMessage/export', {
        ...this.queryParams
      }, `applicationMessage_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
<style scoped>
/deep/ .el-form[data-v-490264e0] .el-row .el-col .el-form-item .el-form-item__label {
  height: 26px !important;
}

/deep/ .el-form--label-top .el-form-item__label {
  padding: 0px;
}
</style>

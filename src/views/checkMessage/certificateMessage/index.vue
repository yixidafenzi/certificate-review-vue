<template>
    <div class="app-container">
        <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch"
            label-width="68px">
        </el-form>
        <div class="buttons">
            <el-date-picker v-model="date" type="date" placeholder="选择日期" value-format="yyyy-MM-dd"></el-date-picker>
            <div class="progress-bar"></div>

            <!-- 下载模板按钮 -->
            <el-button type="primary" plain icon="el-icon-download" size="mini" :style="{ marginRight: '50px' }"
                @click="downloadTemplate">申请文件模版下载</el-button>

            <!-- 导入合格人员按钮 -->
            <el-upload ref="uploadExcel" :action="upExcel.uploadUrl" :before-upload="beforeUploadExcel"
                :on-success="handleUploadSuccess" :on-error="handleUploadError" :headers="upExcel.headers"
                accept=".xlsx,.xls">
                <el-button type="primary" plain icon="el-icon-plus" size="mini">导入合格人员</el-button>
            </el-upload>

            <div class="arrow"></div>

            <!-- 多张照片上传 -->
            <div class="upload-container">
                <el-upload ref="upload" accept=".jpg" :action="upload.url" :headers="upload.headers"
                    :file-list="upload.fileList" :before-upload="beforeUpload" :on-success="handleFileSuccessPicture"
                    list-type="picture" multiple name="files">
                    <el-button slot="trigger" type="primary" plain icon="el-icon-plus" size="mini">选取照片</el-button>
                </el-upload>
            </div>
            <div class="arrow"></div>

            <!-- 资格证书生成按钮 -->
            <el-button type="primary" plain icon="el-icon-plus" size="mini"
                @click="generateCertificate">资格证书生成</el-button>
            <div class="arrow"></div>
            <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="signCertificate">资格证书签章</el-button>
            <div class="arrow"></div>
            <el-button type="primary" plain icon="el-icon-plus" size="mini"
                @click="archiveCertificate">资格证书归档</el-button>
        </div>
    </div>
</template>

<script>
import { getToken } from "@/utils/auth";
import axios from 'axios';
export default {
    data() {
        return {
            date: '',
            // 上传excel
            upExcel: {
                // 设置上传的请求头部
                headers: { Authorization: "Bearer " + getToken() },
                // 后端接收文件的API地址，excel
                uploadUrl: process.env.VUE_APP_BASE_API + "/checkMessage/checkResultMessage/importData",
            },
            // 上传照片
            upload: {
                headers: { Authorization: "Bearer " + getToken() },
                // 上传的地址
                url: process.env.VUE_APP_BASE_API + "/common/uploadsZgzp",
                // 上传的文件列表
                fileList: [],
            },
            localhost: "http://127.0.0.1:8089"
        }
    },
    methods: {

        // 文件上传前的处理
        beforeUploadExcel(file) {
            const isExcel = file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || file.type === 'application/vnd.ms-excel';
            if (!isExcel) {
                this.$message.error('只能上传Excel文件!');
                return false;
            }
            return true;
        },

        // 处理上传成功
        handleUploadSuccess(response) {
            if (response.code === 200) {
                this.$message.success('Excel文件上传成功，数据已导入');
            } else {
                this.$message.error('上传成功，但处理数据失败');
            }
        },

        // 处理上传失败
        handleUploadError() {
            this.$message.error('文件上传失败，请重试');
        },

        // 下载模版
        downloadTemplate() {
            window.location.href = 'E:/山东省二级造价师水利工程注册/合格人员数据 - 模板.xlsx';
            // 假设模板文件存放在 public 文件夹下的 templates 文件夹中
            const templatePath = process.env.BASE_URL + '合格人员数据 - 模板.xlsx';
            const link = document.createElement('a');
            link.href = templatePath;
            link.setAttribute('download', '合格人员数据 - 模板.xlsx');
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        },


        beforeUpload(file) {
            // 这里可以进行上传前的验证，例如文件大小限制等
            const isJPG = file.type === 'image/jpeg';
            if (!isJPG) {
                this.$message.error('上传的图片格式应为 JPG');
                return false;
            }
            return true;
        },


        // 资格证书生成
        async generateCertificate() {
            if (!this.date) {
                this.$message.error("请选择日期");
                return;
            }
            let success = false;
            while (!success) {
                try {
                    // 将日期作为路径参数传递
                    // const response = await axios.get(`/transmitData/queryCertData/${this.date}`);
                    const response = await axios.get(this.localhost + `/transmitData/queryCertData/${this.date}`);
                    this.$message.success("资格证书生成成功");
                    success = true;
                } catch (error) {
                    await this.sleep(1000);
                }
            }
        },

        // 资格证书签章
        async signCertificate() {
            if (!this.date) {
                this.$message.error("请选择日期");
                return;
            }
            try {
                // 修改请求路径，将日期作为查询参数传递
                const response = await axios.get(this.localhost + `/httpEleCert/signAndLockList/${this.date}`);
                this.$message.success("资格证书签章成功");
            } catch (error) {
                this.$message.error("资格证书签章失败，请重试");
            }
        },

        // 资格证书归档
        async archiveCertificate() {
            if (!this.date) {
                this.$message.error("请选择日期");
                return;
            }
            try {
                // 修改请求路径，将日期作为查询参数传递
                const response = await axios.get(this.localhost + `/transmitData/archiveCert/${this.date}`);
                this.$message.success("资格证书归档成功");
            } catch (error) {
                this.$message.error("资格证书归档失败，请重试");
            }
        },

        // 文件上传成功处理(证件照)
        handleFileSuccessPicture(response, file, fileList) {
            // 上传成功处理
            if (response.code === 200) {
                this.$message.success('照片上传成功');
                // this.upload.fileList = fileList;
                this.upload.fileList=[]
            } else {
                this.$message.error('上传失败');
            }
        },

        // 资格证书生成
        async generateCertificate() {
            if (!this.date) {
                this.$message.error("请选择日期");
                return;
            }
            let success = false;
            while (!success) {
                try {
                    // 将日期作为路径参数传递
                    const response = await axios.get(`/transmitData/queryCertData/${this.date}`);
                    this.$message.success("资格证书生成成功");
                    success = true;
                } catch (error) {
                    await this.sleep(1000);
                }
            }
        },

        // 资格证书签章
        async signCertificate() {
            if (!this.date) {
                this.$message.error("请选择日期");
                return;
            }
            try {
                // 修改请求路径，将日期作为查询参数传递
                const response = await axios.get(`/transmitData/signAndLockList/${this.date}`);
                this.$message.success("资格证书签章成功");
            } catch (error) {
                this.$message.error("资格证书签章失败，请重试");
            }
        },

        // 资格证书归档
        async archiveCertificate() {
            if (!this.date) {
                this.$message.error("请选择日期");
                return;
            }
            try {
                // 修改请求路径，将日期作为查询参数传递
                const response = await axios.get(`/transmitData/archiveCert/${this.date}`);
                this.$message.success("资格证书归档成功");
            } catch (error) {
                this.$message.error("资格证书归档失败，请重试");
            }
        },
    }
}
</script>

<style scoped>
.buttons {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 10px;
}

.upload-container {
    max-width: 200px;
    max-height: 120px;
    overflow: auto;
}

.progress-bar {
    margin-left: 100px;
}

.arrow {
    display: inline-block;
    position: relative;
    top: 0px;
    width: 30px;
    height: 2px;
    background-color: rgba(24, 24, 24, 0.493);
}

.arrow::before,
.arrow::after {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    width: 10px;
    height: 2px;
    background-color: rgba(24, 24, 24, 0.493);
}

.arrow::before {
    transform: rotate(45deg);
    transform-origin: top right;
}

.arrow::after {
    transform: rotate(-45deg);
    transform-origin: bottom right;
}
</style>

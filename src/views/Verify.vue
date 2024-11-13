<template>
  <div class="register">
    <div class="content">
      <el-form ref="registerForm" :model="registerForm" :rules="registerRules" class="register-form" v-if="!isGetData">
        <el-form-item prop="name">
          <el-input v-model="registerForm.name" type="text" auto-complete="off" prefix-icon="el-icon-user" placeholder="输入姓名"></el-input>
        </el-form-item>
        <el-form-item prop="idNumber">
          <el-input v-model="registerForm.idNumber" type="text" auto-complete="off" prefix-icon="el-icon-bank-card" placeholder="身份证号码"></el-input>
        </el-form-item>
        <el-form-item prop="registerNumber">
          <el-input v-model="registerForm.registerNumber" type="text" auto-complete="off" prefix-icon="el-icon-bank-card" placeholder="注册证书编号（不含“建[造]”字样）"></el-input>
        </el-form-item>
        <!-- <el-form-item prop="ownersfzhm">
          <el-input v-model="registerForm.code" type="text" auto-complete="off" prefix-icon="el-icon-postcard" placeholder="输入证书编号 不含‘建造’字样"></el-input>
        </el-form-item> -->
        <el-row :gutter="20">
          <el-col :span="15">
            <el-form-item prop="veifyCode">
              <el-input v-model="registerForm.veifyCode" type="text" auto-complete="off" prefix-icon="el-icon-mobile" placeholder="请输入验证码"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <img :src="imgurl" @click="getcodeimage2"/>
          </el-col>
          <el-col :span="5">
            <el-button type="text" @click="getcodeimage2">看不清楚换一张</el-button>
          </el-col>
        </el-row>



        <el-form-item>
          <el-row :gutter="20" justify="center">
            <el-col>
              <el-button
                :loading="loading"
                type="primary"
                class="btnstyle"
                width="100%"
                @click.native.prevent="btnClick"
              >
                验 证
              </el-button>
            </el-col>
          </el-row>
        </el-form-item>
      </el-form>
      <div :gutter="20" justify="center" align="center">
        <!--      <el-col :span="4" offset="10">-->
        <!-- <div v-if="infoData.zg.zgInfo" class="backinfo">二级造价工程师(水利工程) 资格信息：<br>--{{infoData.zg.zgInfo}}--</div> -->

        <!--  <el-descriptions class="margin-top" title="二级造价工程师(水利工程) 资格信息" :column="1" :size="size" v-if="isGetData" style="width:329px; margin-left: -200px;">

            <el-descriptions-item v-if="infoData.zg.zgInfo">

              {{infoData.zg.zgInfo}}
            </el-descriptions-item>

            <template v-if="!infoData.zg.zgInfo">
              <el-descriptions-item>
              <template slot="label">
                <i class="el-icon-user"></i>
                姓名
              </template>
              {{infoData.zg.zgName}}
            </el-descriptions-item>
            <el-descriptions-item>
              <template slot="label">
                <i class="el-icon-warning-outline"></i>
                性别
              </template>
              {{infoData.zg.zgGender}}
            </el-descriptions-item>
            <el-descriptions-item>
              <template slot="label">
                <i class="el-icon-document-remove"></i>
                资格证书编号
              </template>
              {{infoData.zg.zgNum}}
            </el-descriptions-item>
            <el-descriptions-item>
              <template slot="label">
                <i class="el-icon-tickets"></i>
                身份证号码
              </template>
              <el-tag size="small">{{infoData.zg.zgSfz}}</el-tag>
            </el-descriptions-item>
            <el-descriptions-item>
              <template slot="label">
                <i class="el-icon-time"></i>
                批准日期
              </template>
              {{infoData.zg.zgPzrq}}
            </el-descriptions-item>
            </template>

          </el-descriptions>-->

        <!-- <div class="backinfo" v-if="infoData.zc.zcPzrq === '未查询到该人员相关信息'">二级造价工程师(水利工程) 注册信息：<br>--{{infoData.zc.zcPzrq}}-- </div> -->
        <div class="margin-top" title="二级造价工程师(水利工程) 注册信息" v-if="isGetData"  style="width:329px; margin-top: 20px; margin-left: -200px;">

          <div v-if="infoData === '' || infoData == null || infoData == 'null'">
            {{'未查询到该人员相关信息'}}
          </div>

          <div v-else>
            <el-descriptions title="二级造价工程师(水利工程) 注册信息" column="1" v-for="item in infoData">

              <el-descriptions-item>
                <template slot="label">
                  <i class="el-icon-user"></i>
                  姓名
                </template>
                {{item.name}}
              </el-descriptions-item>
              <el-descriptions-item v-if="item.gender =='1'">
                <template slot="label">
                  <i class="el-icon-male"></i>
                  性别
                </template>
                男
              </el-descriptions-item>
              <el-descriptions-item v-if="item.gender =='2'">
                <template slot="label">
                  <i class="el-icon-male"></i>
                  性别
                </template>
                女
              </el-descriptions-item>
              <el-descriptions-item>
                <template slot="label">
                  <i class="el-icon-document-remove"></i>
                  聘用单位
                </template>
                {{item.companyName}}
              </el-descriptions-item>
              <el-descriptions-item>
                <template slot="label">
                  <i class="el-icon-tickets"></i>
                  身份证号码
                </template>
                <el-tag size="small">{{item.idNumber}}</el-tag>
              </el-descriptions-item>
              <el-descriptions-item>
                <template slot="label">
                  <i class="el-icon-document-remove"></i>
                  证书编号
                </template>
                建[造]{{item.registerNumber}}
              </el-descriptions-item>
              <el-descriptions-item>
                <template slot="label">
                  <i class="el-icon-time"></i>
                  有效期
                </template>
                {{item.effectiveTimeSta}}
              </el-descriptions-item>
            </el-descriptions>
          </div>
        </div>
      </div>

    </div>

    <!--  底部  -->
    <div class="el-register-footer">
      <span>Copyright © 2018-2023 北京金水信息技术发展有限公司 All Rights Reserved.</span>
    </div>


  </div>
</template>

<script>
import { getCodeImg, register, getVerifyInfo, getCodeImage } from "@/api/login";

export default {
  name: "Register",
  data() {
    return {
      infoData:null,
      imgurl:"",
      isGetData: false,
      info: "",
      url:"https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg",
      dialogVisible: false,
      codeUrl: "",
      registerForm: {
        name:"",
        idNumber:"",
        registerNumber:"",
        veifyCode:""
      },
      registerRules: {
        name: [{ required: false, trigger: "blur", message: "请输入姓名" }],
        idNumber: [{ required: false, trigger: "blur", message: "请输入身份证" }],
        registerNumber: [{ required: false, trigger: "blur", message: "请输入注册证书编号" }]
      },
      loading: false,
      captchaEnabled: true
    };
  },
  created() {
    this.getCode();
    this.getcodeimage();
  },
  methods: {
    getcodeimage2(){
      this.getcodeimage();
    },
    // 获取验证码
    getcodeimage(){
      getCodeImage().then(res=>{
        let myurl=window.URL.createObjectURL(res)
        this.imgurl = myurl;
      })
    },
    btnClick(){
      this.$refs.registerForm.validate((valid) => {
        if (valid) {
          this.loading = true
          getVerifyInfo(this.registerForm).then(res => {
            if (res.info === "验证码错误") {
              this.$message.error('验证码错误');
            } else if(res.info === "查询信息不能为空!"){
              this.$message.error('查询信息不能为空!');
            }else if(res.info === "成功"){
              if(res.data !=null && res.data !=''){
                this.infoData = res.data;
              }
              this.isGetData = true;
              this.info = res.data;
            }else{
              this.$message.error('未知错误');
            }
            this.loading = false
          }).catch(err=>{console.log(err)})

        } else {
          console.log('error submit!!');
          this.loading = false
          return false;
        }

      });



    },
    getCode() {
      getCodeImg().then(res => {
        this.captchaEnabled = res.captchaEnabled === undefined ? true : res.captchaEnabled;
        if (this.captchaEnabled) {
          this.codeUrl = "data:image/gif;base64," + res.img;
          this.registerForm.uuid = res.uuid;
        }
      });
    },
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.op {
  width: 300px;
}
.register {
  height: 100%;
  display: flex;
  flex-direction: column;
}
.titleH3 {
  border-bottom: 2px solid #02183d;
  padding: 0px 10px 0px 10px;
  background: #124db3;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.btnstyle {display: block; margin: 0 auto;}
.content {
  // width: 640px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 1;
}
h3 {
  height: 80px;
  color: #fff !important;
  font-size: 24px;
  line-height: 80px;
}
.title {
  text-align: center;
  color: #707070;
}

.register-form {
  // border-color: rgb(128, 128, 128);
  border-style: none;
  border-radius: 6px;
  background: #ffffff;
  width: 600px;
  padding: 25px 25px 5px 25px;
  .el-input {
    height: 38px;
    input {
      height: 38px;
    }
  }
  .input-icon {
    height: 39px;
    width: 14px;
    margin-left: 2px;
  }
}
.register-tip {
  font-size: 13px;
  text-align: center;
  color: #bfbfbf;
}
.register-code {
  width: 33%;
  height: 38px;
  float: right;
  img {
    cursor: pointer;
    vertical-align: middle;
  }
}
.el-register-footer {
  height: 40px;
  line-height: 40px;
  width: 100%;
  text-align: center;
  color: #888;
  font-family: Arial;
  font-size: 12px;
  letter-spacing: 1px;
}
.register-code-img {
  height: 38px;
}
.backinfo {
  margin-top:20px;
  color:#333;
  text-align:center;
  line-height:28px
}
</style>

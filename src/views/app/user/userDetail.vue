<template>
  <div class="main" v-loading="isLoading">
    <div class="main-top">
      <div class="main-top-avatar">
        <img :src="userDetails.avatar ? baseUrl + userDetails.avatar : defaultAvatar" alt="" />
        <span>{{ userDetails.nickName }}</span>
      </div>
      <el-button
        icon="el-icon-refresh"
        :loading="resetLoading"
        size="mini"
        @click="reset()"
        >数据刷新</el-button
      >
    </div>
    <div class="main-content">
      <div class="main-content-left">
        <!-- 基本信息 -->
        <div class="main-content-left-item">
          <label>基本信息</label>
          <div class="main-content-left-item-item">
            <span>当前是否在线：</span>
            <span></span>
          </div>
          <div class="main-content-left-item-item">
            <span>领头羊ID：</span>
            <span>{{ userDetails.wtId }}</span>
          </div>
          <div class="main-content-left-item-item">
            <span>ID：</span>
            <span>{{ userDetails.id }}</span>
          </div>
          <div class="main-content-left-item-item">
            <span>用户分组：</span>
            <span>
              <el-select v-model="userDetails.userGroup" >
                <el-option
                  v-for="dict in dict.type.app_user_group"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                ></el-option>
              </el-select>
            </span>
          </div>
          <div class="main-content-left-item-item">
            <span>靓号：</span>
            <span></span>
          </div>
          <div class="main-content-left-item-item">
            <span>性别：</span>
            <span>{{ parseInt(userDetails.gender) === 0 ? "男" : "女" }}</span>
          </div>
          <div class="main-content-left-item-item">
            <span>地区：</span>
            <span>{{ userDetails.area }}</span>
          </div>
          <div class="main-content-left-item-item">
            <span>出生日期：</span>
            <span>{{ parseTime(userDetails.birthday, "{y}-{m}-{d}") }}</span>
          </div>
          <div class="main-content-left-item-item">
            <span>注册手机号：</span>
            <span>{{ userDetails.mobile }}</span>
          </div>
          <div class="main-content-left-item-item">
            <span>绑定手机号：</span>
            <span>{{ userDetails.mobile }}</span>
          </div>
          <div class="main-content-left-item-item">
            <span>注册时间：</span>
            <span>{{ userDetails.createTime }}</span>
          </div>
          <div class="main-content-left-item-item">
            <span>注册IP：</span>
            <span>{{ userDetails.joinIp }}</span>
          </div>
          <div class="main-content-left-item-item">
            <span>注册Device ID：</span>
            <span>{{ userDetails.deviceId }}</span>
          </div>
          <div class="main-content-left-item-item">
            <span>用户等级：</span>
            <span>{{ userDetails.userLevel }}</span>
          </div>
          <div class="main-content-left-item-item">
            <span>会员等级：</span>
            <span></span>
          </div>
          <div class="main-content-left-item-item">
            <span>个人简介：</span>
            <span>{{ userDetails.bio }}</span>
          </div>
        </div>
        <!-- 最近登录信息 -->
        <div class="main-content-left-item">
          <label>最近登录信息</label>
          <div class="main-content-left-item-item">
            <span>最后登录时间：</span>
            <span>{{ userDetails.lastLoginTime }}</span>
          </div>
          <div class="main-content-left-item-item">
            <span>最后登录IP：</span>
            <span>{{ userDetails.lastLoginIp }}</span>
          </div>
          <div class="main-content-left-item-item">
            <span>最后登录经纬度：</span>
            <span></span>
            <el-button
              type="primary"
              size="small"
              @click="openLocationLog()"
              style="margin-left: 15px"
              >历史日志</el-button
            >
          </div>
        </div>
        <!-- 设备信息 -->
        <div class="main-content-left-item">
          <label>设备信息</label>
          <div class="main-content-left-item-item">
            <span>设备标识：</span>
            <span>{{
              userDetails.userDeviceInfoVo &&
              userDetails.userDeviceInfoVo.deviceName
                ? userDetails.userDeviceInfoVo.deviceName
                : ""
            }}</span>
          </div>
          <div class="main-content-left-item-item">
            <span>Device ID：</span>
            <span>{{
              userDetails.userDeviceInfoVo &&
              userDetails.userDeviceInfoVo.deviceId
                ? userDetails.userDeviceInfoVo.deviceId
                : ""
            }}</span>
          </div>
          <div class="main-content-left-item-item">
            <span>系统版本：</span>
            <span>{{
              userDetails.userDeviceInfoVo &&
              userDetails.userDeviceInfoVo.systemVersion
                ? userDetails.userDeviceInfoVo.systemVersion
                : ""
            }}</span>
          </div>
          <div class="main-content-left-item-item">
            <span>APP版本号：</span>
            <span>{{
              userDetails.userDeviceInfoVo &&
              userDetails.userDeviceInfoVo.appVersion
                ? userDetails.userDeviceInfoVo.appVersion
                : ""
            }}</span>
          </div>
          <div class="main-content-left-item-last">
            <span>同设备下其他账号：</span>
            <span
              class="main-content-left-item-last-number"
              v-if="
                userDetails.userDeviceInfoVo &&
                userDetails.userDeviceInfoVo.userList
              "
            >
              <span
                v-for="(item, index) in userDetails.userDeviceInfoVo.userList"
                @click="goToUserDetail(item.wtId)"
                >{{ `${item.nickName}(${item.wtId})` }}</span
              >
            </span>
          </div>
        </div>
      </div>
      <el-divider direction="vertical" style="height: 100%"></el-divider>
      <div class="main-content-right">
        <!-- 互动信息 -->
        <div class="main-content-right-item">
          <label>互动信息</label>
          <div class="main-content-right-item-item">
            <span class="main-content-right-item-item-left"
              ><span>已添加好友数：</span>
              <span></span>
            </span>
          </div>
          <div class="main-content-right-item-item">
            <span class="main-content-right-item-item-left"
              ><span>当前群聊数：</span><span></span
            ></span>
            <el-button type="primary" size="small" @click=""
              >群聊详情</el-button
            >
          </div>
          <div class="main-content-right-item-item">
            <span class="main-content-right-item-item-left"
              ><span>朋友圈动态发布数：</span><span></span
            ></span>
            <el-button type="primary" size="small" @click=""
              >朋友圈详情</el-button
            >
          </div>
          <div class="main-content-right-item-item">
            <span class="main-content-right-item-item-left"
              ><span>当前社区数：</span><span></span
            ></span>
            <el-button type="primary" size="small" @click=""
              >社区详情</el-button
            >
          </div>
        </div>
        <!-- 消费信息 -->
        <div class="main-content-right-item">
          <label>消费信息</label>
          <div class="main-content-right-item-item">
            <span><span>领头羊币余额：</span><span></span></span>
            <el-button type="primary" size="small" @click=""
              >账单记录</el-button
            >
          </div>
          <div class="main-content-right-item-item">
            <span><span>VIP信息：</span><span></span></span>
            <el-button type="primary" size="small" @click=""
              >开通记录</el-button
            >
          </div>
          <div class="main-content-right-item-item">
            <span><span>SVIP信息：</span><span></span></span>
          </div>
          <div class="main-content-right-item-item">
            <span><span>靓号购买：</span><span></span></span>
            <el-button type="primary" size="small" @click=""
              >购买记录</el-button
            >
          </div>
        </div>
        <!-- 权限操作 -->
        <div class="main-content-right-item">
          <label>权限操作</label>
          <div class="main-content-right-item-item">
            <span
              ><span>封禁状态：</span>
              <span v-if="userDetails.actionStatus === 0">未封禁</span>
              <span v-if="userDetails.actionStatus === 1">已注销</span>
              <span v-if="userDetails.actionStatus === 2 || userDetails.actionStatus === 3">封禁中</span>
            </span>
            <el-button
              v-if="userDetails.actionStatus !== 1"
              type="primary"
              size="small"
              @click="handleDialog()"
              >{{ userDetails.actionStatus === 0 ? "封禁" : "解封" }}</el-button
            >
          </div>
          <div class="main-content-right-item-item">
            <span><span>重置密码：</span><span>12345678</span></span>
            <el-button type="primary" size="small" @click="resetPWD"
              >立即重置</el-button
            >
          </div>
        </div>
      </div>
    </div>
    <UserDisableRecord ref="banDialog" @success="reset" />
    <UnbanDialog ref="unBanDialog" @success="reset" />
    <LocationLog ref="locationLog" />
  </div>
</template>
<script>
import { getBaseUrl } from "@/utils/auth";
import { getUserByWtId } from "@/api/app/user";
import UserDisableRecord from "../../components/userDisableRecord";
import UnbanDialog from "../disableRecords/UnbanDialog.vue";
import LocationLog from "./locationLog.vue";
import defaultAvatar from '@/assets/images/defaultAvatar.png'

export default {
  name: "userDetail",
  dicts: ["app_user_group"],
  components: { UserDisableRecord, UnbanDialog, LocationLog },
  data() {
    return {
      userId: this.$route.query.id,
      userDetails: {},
      isLoading: false,
      resetLoading: false,
      baseUrl: getBaseUrl(),
      defaultAvatar: defaultAvatar,
    };
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      vm.userId = to.query.id;
      vm.getUserDetails();
    });
  },
  beforeRouteUpdate(to, from, next) {
    if (to.query.id !== from.query.id) {
      this.userId = to.query.id;
      this.getUserDetails();
    }
    next();
  },
  methods: {
    getUserDetails() {
      this.isLoading = true;
      getUserByWtId(this.userId)
        .then((response) => {
          if (response.code === 200) {
            console.log(response.data);
            this.userDetails = response.data;
            this.isLoading = false;
          }
        })
        .catch((error) => {
          console.log(error);
        })
        .finally(() => {
          this.isLoading = false;
        });
    },
    reset() {
      this.resetLoading = true;
      setTimeout(() => {
        this.resetLoading = false;
      }, 1000);
      this.getUserDetails();
    },
    handleDialog() {
      if (this.userDetails.actionStatus === 0) {
        let data = {
          relationName: this.userDetails.nickName,
          relationId: this.userDetails.wtId,
          type: 0,
        };
        this.$refs.banDialog.openDialog(data);
      } else {
        let data = {
          relationName: this.userDetails.nickName,
          relationId: this.userDetails.wtId,
          // 封禁类型
          type: this.userDetails.disableLevel,
        };
        this.$refs.unBanDialog.openDialog(data);
      }
    },
    openLocationLog() {
      this.$refs.locationLog.openDialog();
    },
    // resetPWD() {
    //   this.$prompt("请输入新密码", "提示", {
    //     confirmButtonText: "确定",
    //     cancelButtonText: "取消",
    //     inputPattern: /^[a-zA-Z0-9]{6,20}$/,
    //     inputErrorMessage: "请输入6-20位的字母或数字",
    //   })
    //     .then(({ value }) => {
    //       this.$message({})
    //     })
    // }
    resetPWD() {
      this.$confirm("是否重置用户密码为12345678?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$message({
            type: "success",
            message: "重置成功!",
          });
        })
        .catch(() => {
          // this.$message({
          //   type: 'info',
          //   message: '已取消重置'
          // });
        });
    },
    goToUserDetail(id) {
      this.$router.push({ name: "userDetail", query: { id: id }});
      // this.userId = id;
      // this.getUserDetails();
      // window.scrollTo(0, 0);
    },
  },
};
</script>
<style lang="scss" scoped>
.main {
  width: 100%;
  height: 100%;
  padding: 20px;
  font-size: 12px;
  &-top {
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    margin: 20px 0;
    &-avatar {
      width: 50%;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 10px;
      font-size: 14px;
      color: #000;
      img {
        width: 70px;
        height: 70px;
        border-radius: 50%;
      }
    }
  }
  &-content {
    display: flex;
    flex-direction: row;
    &-left {
      width: 50%;
      display: flex;
      flex-direction: column;
      gap: 10px;
      &-item {
        display: flex;
        flex-direction: column;
        gap: 7px;
        &-item {
          display: flex;
          flex-direction: row;
          align-items: baseline;
          .el-button {
            font-size: 12px;
            padding: 7px 10px;
            min-width: 70px;
          }
          span:nth-of-type(1) {
            width: 120px;
            flex-shrink: 0;
          }
        }
        &-last {
          display: flex;
          flex-direction: column;
          gap: 7px;
          &-number {
            color: rgb(64, 158, 255);
            font-size: 11px;
            cursor: pointer;
            display: flex;
            flex-direction: row;
            flex-wrap: wrap;
            align-items: center;
            column-gap: 15px;
            row-gap: 5px;
          }
        }
      }
    }
    &-right {
      width: 50%;
      padding: 40px 40px 0 40px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      &-item {
        display: flex;
        flex-direction: column;
        gap: 20px;
        &-item {
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: space-between;
          .el-button {
            font-size: 12px;
            padding: 7px 10px;
            min-width: 70px;
          }
          &-left {
            display: flex;
            flex-direction: row;
            align-items: baseline;
            span:nth-of-type(1) {
              width: 120px;
              flex-shrink: 0;
            }
          }
        }
      }
    }
    .el-divider--vertical {
      margin-top: 40px;
      height: auto;
    }
  }
}
</style>

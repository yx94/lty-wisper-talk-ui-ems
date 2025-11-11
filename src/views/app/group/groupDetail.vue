<template>
  <div class="main" v-loading="isLoading">
    <el-descriptions
      :column="2"
      border
      :labelStyle="{ 'text-align': 'center', width: '60px' }"
      :contentStyle="{ width: '120px' }"
    >
      <template slot="extra" v-if="groupDetails.groupStatus === 0">
        <el-button
          v-if="!isUpdate"
          type="primary"
          size="small"
          @click="toUpdate()"
          >修改群设置</el-button
        >
        <el-button v-else type="danger" size="small" @click="save()"
          >保存设置</el-button
        >
      </template>
      <el-descriptions-item label="群名称">
        <span class="space-between">
          <span>{{ groupDetails.groupName }}</span>
          <i
            class="el-icon-arrow-right btn"
            v-if="isUpdate"
            @click="edit('groupName')"
          ></i>
        </span>
      </el-descriptions-item>
      <el-descriptions-item label="群ID">
        {{ groupDetails.groupNumber }}
      </el-descriptions-item>
      <el-descriptions-item label="群头像">
        <span class="space-between">
          <el-popover placement="top-start" title="" trigger="hover">
            <img
              :src="groupDetails.groupAvatar ? baseUrl + groupDetails.groupAvatar : defaultGroupAvatar"
              width="200"
              height="200"
            />
            <img
              slot="reference"
              :src="groupDetails.groupAvatar ? baseUrl + groupDetails.groupAvatar : defaultGroupAvatar"
              width="40"
              height="40"
            />
          </el-popover>
          <i
            class="el-icon-arrow-right btn"
            v-if="isUpdate"
            @click="edit('groupAvatar')"
          ></i>
        </span>
      </el-descriptions-item>
      <el-descriptions-item label="群人数">
        {{ groupDetails.groupMemberCount || 0 }}
      </el-descriptions-item>
      <el-descriptions-item label="创建者信息">
        <span class="btn" @click=goToUserDetail(groupDetails.userWtId)>{{
          `${groupDetails.userName} (ID：${groupDetails.userWtId})`
        }}</span>
      </el-descriptions-item>
      <el-descriptions-item label="创建时间">
        {{ groupDetails.createTime }}
      </el-descriptions-item>
      <el-descriptions-item label="群公告">
        <span class="space-between">
          <span>{{ groupDetails.groupNotice || "暂无" }}</span>
          <i
            class="el-icon-arrow-right btn"
            v-if="isUpdate"
            @click="edit('groupNotice')"
          ></i>
        </span>
      </el-descriptions-item>
      <el-descriptions-item label="入群欢迎语">
        <span class="space-between">
          <span>{{ groupDetails.groupWelcomeMsg || "暂无" }}</span>
          <i
            class="el-icon-arrow-right btn"
            v-if="isUpdate"
            @click="edit('groupWelcomeMsg')"
          ></i>
        </span>
      </el-descriptions-item>
      <el-descriptions-item label="入群限制">
        <span class="space-between">
          <span>{{
            groupDetails.limitLevel ? `Lv.${groupDetails.limitLevel}` : "暂无"
          }}</span>
          <i
            class="el-icon-arrow-down btn"
            v-if="isUpdate"
            @click="edit('limitLevel')"
          ></i>
        </span>
      </el-descriptions-item>
      <el-descriptions-item label="公开群聊">
        <el-select
          v-if="isUpdate"
          v-model="groupDetails.confirminviteSwitch"
          placeholder="请选择"
        >
          <el-option
            v-for="item in confirmOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
        <span class="space-between" v-else>
          <span v-if="groupDetails.confirminviteSwitch === 0">自动通过</span>
          <span v-else-if="groupDetails.confirminviteSwitch === 1"
            >管理员审批</span
          >
          <span v-else>禁止加入</span>
        </span>
      </el-descriptions-item>
      <el-descriptions-item label="成员保护模式">
        <el-select
          v-if="isUpdate"
          v-model="groupDetails.memberProtectSwitch"
          placeholder="请选择"
        >
          <el-option
            v-for="item in memberProtectOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
        <span class="space-between" v-else>
          <span v-if="groupDetails.memberProtectSwitch === 0">关闭</span>
          <span v-else>开启</span>
        </span>
      </el-descriptions-item>
      <el-descriptions-item label="邀请加群">
        <el-select
          v-if="isUpdate"
          v-model="groupDetails.inviteSwitch"
          placeholder="请选择"
        >
          <el-option
            v-for="item in inviteOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
        <span class="space-between" v-else>
          <span v-if="groupDetails.inviteSwitch === 0">自动通过</span>
          <span v-else-if="groupDetails.inviteSwitch === 1">管理员审批</span>
          <span v-else>禁止加入</span>
        </span>
      </el-descriptions-item>
      <el-descriptions-item label="群通话">
        <el-select
          v-if="isUpdate"
          v-model="groupDetails.callSwitch"
          placeholder="请选择"
        >
          <el-option
            v-for="item in callOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
        <span class="space-between" v-else>
          <span v-if="groupDetails.callSwitch === 0">关闭</span>
          <span v-else>开启</span>
        </span>
      </el-descriptions-item>
      <el-descriptions-item label="全员禁言">
        <el-select
          v-if="isUpdate"
          v-model="groupDetails.bannedSwitch"
          placeholder="请选择"
        >
          <el-option
            v-for="item in banOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
        <span class="space-between" v-else>
          <span v-if="groupDetails.bannedSwitch === 0">关闭</span>
          <span v-else>开启</span>
        </span>
      </el-descriptions-item>
      <el-descriptions-item label="被禁言成员">
        <div class="member-list">
          <div class="member-list-top">
            <span v-for="(item, index) in groupDetails.mutedList" :key="index"
              ><span class="btn" @click=goToUserDetail(item.wtId)>{{
                `${item.groupNickname} (${item.wtId})`
              }}</span>
              <span v-if="index < groupDetails.mutedList.length - 1" style="color: rgb(64, 158, 255);">， </span>
            </span>
            <span
              v-if="
                !groupDetails.mutedList || groupDetails.mutedList.length === 0
              "
              >暂无</span
            >
          </div>
          <span
            class="member-list-bottom"
            v-if="isUpdate"
            @click="handleMember('mute')"
            >修改</span
          >
        </div>
      </el-descriptions-item>
      <el-descriptions-item label="群黑名单">
        <div class="member-list">
          <div class="member-list-top">
            <span v-for="(item, index) in groupDetails.blackList" :key="index"
              ><span class="btn" @click=goToUserDetail(item.wtId)>{{
                `${item.groupNickname} (${item.wtId})`
              }}</span>
              <span v-if="index < groupDetails.blackList.length - 1" style="color: rgb(64, 158, 255);">， </span>
            </span>
            <span
              v-if="
                !groupDetails.blackList || groupDetails.blackList.length === 0
              "
              >暂无</span
            >
          </div>
          <span
            class="member-list-bottom"
            v-if="isUpdate"
            @click="handleMember('black')"
            >修改</span
          >
        </div>
      </el-descriptions-item>
      <el-descriptions-item label="群管理员">
        <div class="member-list">
          <div class="member-list-top">
            <span v-for="(item, index) in groupDetails.adminList" :key="index"
              ><span class="btn" @click=goToUserDetail(item.wtId)>{{
                `${item.groupNickname} (${item.wtId})`
              }}</span>
              <span v-if="index < groupDetails.adminList.length - 1" style="color: rgb(64, 158, 255);">， </span>
            </span>
            <span
              v-if="
                !groupDetails.adminList || groupDetails.adminList.length === 0
              "
              >暂无</span
            >
          </div>
          <span
            class="member-list-bottom"
            v-if="isUpdate"
            @click="handleMember('admin')"
            >修改</span
          >
        </div>
      </el-descriptions-item>
    </el-descriptions>
    <EditAvatar ref="editAvatar" @success="submitUpload" />
    <EditLimit ref="editLimit" @success="submitLimit" />
    <EditText ref="editText" @success="submitText" />
    <HandleMember
      ref="handleMember"
      :title="handleMemberTitle"
      :list="handleMemberList"
      :addList="addMemberList"
      @add="addMember"
      @remove="removeMember"
      @refresh="refreshMember"
      @getData="getGroupMember"
    />
  </div>
</template>
<script>
import { getBaseUrl } from "@/utils/auth";
import {
  getGroup,
  updateGroup,
  getMutedList,
  getAdminList,
  getBlackList,
  addBlack,
  setOrCancelMuted,
  setOrCancelManager,
  removeBlack,
} from "@/api/app/group";
import EditAvatar from "./editAvatar.vue";
import EditLimit from "./editLimit.vue";
import EditText from "./editText.vue";
import HandleMember from "./handleMember.vue";
import defaultGroupAvatar from '@/assets/images/defaultGroupAvatar.png'

export default {
  name: "groupDetail",
  components: { EditAvatar, EditLimit, EditText, HandleMember },
  data() {
    return {
      baseUrl: getBaseUrl(),
      groupId: this.$route.query.id,
      groupDetails: {},
      isLoading: false,
      resetLoading: false,
      isUpdate: false,
      handleMemberTitle: "",
      handleMemberList: [],
      handleMemberType: "",
      addMemberList: [],
      originData: {
        groupNumber: undefined,
        groupName: undefined,
        groupAvatar: undefined,
        groupNotice: undefined,
        confirminviteSwitch: undefined,
        inviteSwitch: undefined,
        bannedSwitch: undefined,
        memberProtectSwitch: undefined,
        limitLevel: undefined,
        groupWelcomeMsg: undefined,
        warnStatus: undefined,
        callSwitch: undefined,
      },
      confirmOptions: [
        { label: "自动通过", value: 0 },
        { label: "管理员审批", value: 1 },
        { label: "禁止加入", value: 2 },
      ],
      inviteOptions: [
        { label: "自动通过", value: 0 },
        { label: "管理员审批", value: 1 },
        { label: "禁止加入", value: 2 },
      ],
      callOptions: [
        { label: "关闭", value: 0 },
        { label: "开启", value: 1 },
      ],
      banOptions: [
        { label: "关闭", value: 0 },
        { label: "开启", value: 1 },
      ],
      memberProtectOptions: [
        { label: "关闭", value: 0 },
        { label: "开启", value: 1 },
      ],
      defaultGroupAvatar: defaultGroupAvatar
    };
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      vm.groupId = to.query.id;
      vm.getGroupDetails();
    });
  },
  methods: {
    getGroupDetails() {
      this.isLoading = true;
      getGroup(this.groupId)
        .then((response) => {
          if (response.code === 200) {
            console.log(response.data);
            this.groupDetails = JSON.parse(JSON.stringify(response.data));
            this.isLoading = false;
            this.originData = JSON.parse(JSON.stringify(response.data));
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
      this.getGroupDetails();
    },
    toUpdate() {
      this.isUpdate = true;
    },
    edit(type) {
      switch (type) {
        case "groupName":
            this.$refs["editText"].openDialog('groupName',this.groupDetails.groupName);
          break;
        case "groupNotice":
          this.$refs["editText"].openDialog('groupNotice',this.groupDetails.groupNotice);
          break;
        case "groupWelcomeMsg":
          this.$refs["editText"].openDialog('groupWelcomeMsg',this.groupDetails.groupWelcomeMsg);
          break;
        case "groupAvatar":
          this.$refs["editAvatar"].openDialog();
          break;
        case "limitLevel":
          this.$refs["editLimit"].openDialog(this.groupDetails.limitLevel);
        default:
          break;
      }
    },
    submitText(type,value) {
      this.groupDetails[type] = value;
    },
    save() {
      let data = this.getChangedValues(this.originData, this.groupDetails);
      updateGroup(data)
        .then((response) => {
          if (response.code === 200) {
            this.$modal.msgSuccess("修改成功");
            this.originData = JSON.parse(JSON.stringify(this.groupDetails));
          } else {
            this.$modal.msgError(response.msg);
          }
        })
        .catch((error) => {
          console.log(error);
        })
        .finally(() => {
          this.isUpdate = false;
        });
    },
    getChangedValues(origin, current) {
      const changed = {};
      Object.keys(current).forEach((key) => {
        if (key === "groupNumber") {
          changed[key] = current[key];
        }
        if (current[key] !== origin[key]) {
          changed[key] = current[key];
        }
      });
      return changed;
    },
    submitUpload(imageUrl) {
      this.groupDetails["groupAvatar"] = imageUrl;
      console.log("ok");
    },
    submitLimit(level) {
      console.log(level);
      this.groupDetails["limitLevel"] = level;
    },
    handleMember(type) {
      switch (type) {
        case "mute":
          this.handleMemberTitle = "被禁言成员";
          this.handleMemberList = this.groupDetails.mutedList || [];
          break;
        case "black":
          this.handleMemberTitle = "群黑名单";
          this.handleMemberList = this.groupDetails.blackList || [];
          break;
        case "admin":
          this.handleMemberTitle = "群管理员";
          this.handleMemberList = this.groupDetails.adminList || [];
          break;
        default:
          break;
      }
      this.handleMemberType = type;
      this.$refs.handleMember.openDialog();
    },
    addMember(value) {
      if (!this.groupDetails.groupNumber) return;
      if (this.handleMemberType === "admin") {
        setOrCancelManager({
          groupNumber: this.groupDetails.groupNumber,
          wtIds: value,
          identity: 2,
        }).then((response) => {
          if (response.code === 200) {
            this.$message.success("操作成功");
            this.refreshMember();
          }
        });
      } else if (this.handleMemberType === "mute") {
        setOrCancelMuted({
          groupNumber: this.groupDetails.groupNumber,
          wtIds: value,
          muteTime: 1,
        }).then((response) => {
          if (response.code === 200) {
            this.$message.success("操作成功");
            this.refreshMember();
          }
        });
      } else if (this.handleMemberType === "black") {
        addBlack({
          groupNumber: this.groupDetails.groupNumber,
          wtIds: value,
        }).then((response) => {
          if (response.code === 200) {
            this.$message.success("操作成功");
            this.refreshMember();
          }
        });
      }
    },
    removeMember(wtId) {
      if (!this.groupDetails.groupNumber) return;
      if (this.handleMemberType === "admin") {
        setOrCancelManager({
          groupNumber: this.groupDetails.groupNumber,
          wtIds: [wtId],
          identity: 1,
        }).then((response) => {
          if (response.code === 200) {
            this.$message.success("操作成功");
            this.refreshMember();
          }
        });
      } else if (this.handleMemberType === "mute") {
        setOrCancelMuted({
          groupNumber: this.groupDetails.groupNumber,
          wtIds: [wtId],
          muteTime: 0,
        }).then((response) => {
          if (response.code === 200) {
            this.$message.success("操作成功");
            this.refreshMember();
          }
        });
      } else if (this.handleMemberType === "black") {
        removeBlack({
          groupNumber: this.groupDetails.groupNumber,
          wtIds: [wtId],
        }).then((response) => {
          if (response.code === 200) {
            this.$message.success("操作成功");
            this.refreshMember();
          }
        });
      }
    },
    refreshMember() {
      if (!this.groupDetails.groupNumber) return;
      getGroup(this.groupId).then((response) => {
        if (response.code === 200) {
          this.groupDetails = JSON.parse(JSON.stringify(response.data));
          this.originData = JSON.parse(JSON.stringify(response.data));
          switch (this.handleMemberType) {
            case "mute":
              this.handleMemberList = this.groupDetails.mutedList || [];
              break;
            case "black":
              this.handleMemberList = this.groupDetails.blackList || [];
              break;
            case "admin":
              this.handleMemberList = this.groupDetails.adminList || [];
              break;
            default:
              break;
          }
        }
      });
    },
    getGroupMember() {
      if (this.handleMemberType === "admin") {
        getAdminList({
          groupNumber: this.groupDetails.groupNumber,
        }).then((response) => {
          if (response.code === 200) {
            this.addMemberList = response.data;
          }
        });
      } else if (this.handleMemberType === "mute") {
        getMutedList({
          groupNumber: this.groupDetails.groupNumber,
        }).then((response) => {
          if (response.code === 200) {
            this.addMemberList = response.data;
          }
        });
      } else if (this.handleMemberType === "black") {
        getBlackList({
          groupNumber: this.groupDetails.groupNumber,
        }).then((response) => {
          if (response.code === 200) {
            this.addMemberList = response.data;
          }
        });
      }
    },
    goToUserDetail(id) {
      this.$router.push({ name: "userDetail", query: { id: id }});
    },
  },
};
</script>
<style lang="scss" scoped>
.main {
  width: 100%;
  height: 100%;
  padding: 20px;
  .space-between {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
  .btn {
    color: rgb(64, 158, 255);
    cursor: pointer;
  }
  .member-list {
    &-top {
      display: flex;
      flex-direction: row;
      align-items: center;
      flex-wrap: wrap;
      gap: 5px;
    }
    &-bottom {
      float: right;
      cursor: pointer;
      color: red;
    }
  }
}
</style>
<style lang="scss">
.el-textarea__inner {
  min-height: 300px !important;
}
</style>

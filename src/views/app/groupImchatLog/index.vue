<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      size="small"
      :inline="true"
      v-show="showSearch"
      label-width="110px"
    >
      <el-form-item label="发送时间" prop="currentDate">
        <el-date-picker
          v-model="queryParams.currentDate"
          style="width: 192px"
          type="daterange"
          :default-time="['00:00:00', '23:59:59']"
          placeholder="选择日期"
          :clearable="false"
          :picker-options="pickerOptions"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="发送者信息" prop="fromAccountId">
        <el-input
          v-model="queryParams.fromAccountId"
          placeholder="请输入用户领头羊ID"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="群聊信息" prop="txgroupId">
        <el-input
          v-model="queryParams.txgroupId"
          placeholder="请输入群聊ID"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="信息内容" prop="msgText">
        <el-input
          v-model="queryParams.msgText"
          placeholder="请输入文本消息内容"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="消息类型" prop="msgType">
        <el-select
          v-model="queryParams.msgType"
          placeholder="请选择消息类型"
          clearable
        >
          <el-option
            v-for="dict in dict.type.im_chat_msg_type"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          icon="el-icon-search"
          size="mini"
          @click="handleQuery"
          >搜索</el-button
        >
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery"
          >重置</el-button
        >
      </el-form-item>
    </el-form>
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          >导出</el-button
        >
      </el-col>
      <right-toolbar
        :showSearch.sync="showSearch"
        @queryTable="getList"
      ></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="dataList">
      <el-table-column label="发送者信息" align="center" prop="fromAccount">
        <template slot-scope="scope">
          <router-link :to="'/app/user/detail/?id=' + scope.row.fromAccount">
            <el-link type="primary" :underline="false">
              {{ scope.row.fromAccountName }}（ID:{{ scope.row.fromAccount }}）
            </el-link>
          </router-link>
        </template>
      </el-table-column>
      <el-table-column label="消息内容" align="center" prop="msgType">
        <template slot-scope="scope">
          <div v-if="scope.row.msgType === 'TIMTextElem'">
            {{ scope.row.msgContent }}
          </div>
          <div v-if="scope.row.msgType === 'TIMImageElem'">
            <el-image
              style="width: 80px; height: 80px"
              :src="scope.row.msgBody.MsgContent.ImageInfoArray[0].URL"
              :preview-src-list="[
                scope.row.msgBody.MsgContent.ImageInfoArray[0].URL,
              ]"
            >
            </el-image>
          </div>

          <div v-if="scope.row.msgType === 'TIMFaceElem'">
            <el-image
              style="width: 80px; height: 80px"
              :src="scope.row.msgFaceUrl"
              :preview-src-list="[scope.row.msgFaceUrl]"
            >
            </el-image>
          </div>

          <div
            v-if="scope.row.msgType === 'TIMLocationElem'"
            :title="scope.row.msgBody.MsgContent.Desc"
          >
            [位置]{{ scope.row.msgBody.MsgContent.Desc }}
          </div>

          <div v-if="scope.row.msgType === 'TIMCustomElem'">
            <div v-if="scope.row.msgBody.type === 'collect'">
              <el-link
                type="primary"
                :underline="false"
                @click="openDialog(scope.row)"
              >
                [笔记]{{ scope.row.msgBody.detail.collectTitle }}
              </el-link>
            </div>
            <div v-if="scope.row.msgBody.type === 'nameCard'">
              [名片]{{ scope.row.msgBody.nickName }} (ID:
              {{ scope.row.msgBody.userId }})
            </div>
            <div
              v-if="scope.row.msgBody.type === 'GroupCustomMsg'"
              :title="scope.row.msgBody.content || scope.row.customMsg"
            >
              [群自定义消息]
            </div>
            <div v-else>
              {{ scope.row.msgBody.content }}
            </div>
          </div>

          <div v-if="scope.row.msgType === 'TIMVideoFileElem'">
            <el-link
              type="primary"
              :underline="false"
              @click="openDialog(scope.row.msgBody)"
            >
              [视频文件]
            </el-link>
          </div>

          <div v-if="scope.row.msgType === 'TIMSoundElem'">
            <el-link
              type="primary"
              :underline="false"
              @click="openDialog(scope.row.msgBody)"
            >
              [语音] {{ scope.row.msgBody.MsgContent.Second }} s
            </el-link>
          </div>

          <div v-if="scope.row.msgType === 'TIMFileElem'">
            <el-link
              type="primary"
              :underline="false"
              :href="scope.row.msgBody.MsgContent.Url"
              target="_blank"
              >[文件]</el-link
            >
          </div>
        </template>
      </el-table-column>
      <el-table-column
        label="消息类型"
        align="center"
        prop="msgType"
        width="80px"
      >
        <template slot-scope="scope">
          <dict-tag
            :options="dict.type.im_chat_msg_type"
            :value="scope.row.msgType"
          />
        </template>
      </el-table-column>
      <el-table-column label="群聊信息" align="center" prop="groupId">
        <template slot-scope="scope">
          <router-link :to="'/app/group/detail/?id=' + scope.row.groupId">
            <el-link type="primary" :underline="false">
              {{ scope.row.groupName }}（ID:{{ scope.row.groupId }}）
            </el-link>
          </router-link>
        </template>
      </el-table-column>
      <el-table-column
        label="发送时间"
        align="center"
        prop="msgTimestamp"
        width="160px"
      />
      <el-table-column
        label="操作"
        align="center"
        fixed="right"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button
            v-if="!scope.row.operatorName"
            type="danger"
            size="small"
            @click="onDelete(scope.row.id)"
            >删除</el-button
          >
          <div v-if="scope.row.operatorName">
            {{ scope.row.operatorName }}于{{ scope.row.operatorTime }}双向删除
          </div>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />
    <PreviewDialog ref="dialog" />
  </div>
</template>

<script>
import dayjs from "dayjs";
import {
  listGroupImchatLog,
  delGroupImchatLog,
} from "@/api/app/groupImchatLog";
import { getBaseUrl } from "@/utils/auth";
import PreviewDialog from "../c2cImchatLog/PreviewDialog.vue";
export default {
  name: "GroupImchatLog",
  dicts: ["im_chat_msg_type"],
  components: { PreviewDialog },
  data() {
    return {
      pickerOptions: {
        // 时间不能大于当前时间
        disabledDate: (time) => {
          return time.getTime() > dayjs().endOf('day').valueOf()
        }
      },
      baseUrl: getBaseUrl(),
      // 按钮loading
      buttonLoading: false,
      // 遮罩层
      loading: false,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 单聊聊天记录列表数据
      dataList: [],
      // 日期范围
      dateRange: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 30,
        currentDate: [
          dayjs().startOf("day").toISOString(),
          dayjs().endOf("day").toISOString(),
        ],
        fromAccountId: undefined,
        txgroupId: this.$route.query.groupId,
        msgText: undefined,
        msgType: undefined,
      },
    };
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      if (to.query.groupId && to.query.groupId !== vm.queryParams.txgroupId) {
        (vm.queryParams = {
          pageNum: 1,
          pageSize: 30,
          currentDate: dayjs().format("YYYYMMDD"),
          fromAccountId: undefined,
          txgroupId: to.query.groupId,
          msgText: undefined,
          msgType: undefined,
        }),
          vm.getList();
      }
    });
  },
  created() {
    this.getList();
  },
  methods: {
    getParams() {
      const params = {
        ...this.queryParams,
      };
      if (this.queryParams.currentDate?.[0]) {
        params.startTime = dayjs(this.queryParams.currentDate[0]).unix();
      }
      if (this.queryParams.currentDate?.[1]) {
        params.endTime = dayjs(this.queryParams.currentDate[1]).unix();
      }
      delete params.currentDate;
      return params;
    },
    /** 查询封禁管理列表 */
    getList() {
      this.loading = true;
      listGroupImchatLog(this.getParams())
        .then((response) => {
          this.dataList = response.rows.map((item) => {
            if (item.msgBody && typeof item.msgBody === "string") {
              const data = JSON.parse(item.msgBody);
              item.msgBody = data?.[0] ? data[0] : data;
            }
            // if (item.msgType === "TIMCustomElem") {
            //   item.customData = JSON.parse(item.customMsg);
            //   if (typeof item.customData.detail === "string") {
            //     item.customData.detail = JSON.parse(item.customData.detail);
            //   }
            // }
            // if (item.msgType === "TIMLocationElem") {
            //   item.locationDesc =
            //     item.locationDesc && JSON.parse(item.locationDesc);
            // }
            // if (item.msgType === "TIMFaceElem") {
            //   item.msgFaceUrl =
            //     this.baseUrl +
            //     (item.msgFaceUrl && JSON.parse(item.msgFaceUrl).url);
            // }
            // if (item.msgType === "TIMSoundElem") {
            //   item.soundDuration = 0;
            //   this.getAudioDuration(item.msgSoundUrl)
            //     .then((duration) => {
            //       item.soundDuration = duration;
            //     })
            //     .catch((error) => {
            //       console.error(error.message);
            //     });
            // }
            item.msgTimestamp = dayjs(item.msgTime * 1000).format(
              "YYYY-MM-DD HH:mm:ss"
            );
            console.log(item);
            return item;
          });
          this.total = response.total;
        })
        .finally(() => {
          this.loading = false;
        });
    },
    openDialog(item) {
      console.log(item);
      let params;
      if (
        item.MsgType === "TIMCustomElem" &&
        item.customData.type === "collect"
      ) {
        params = {
          type: "note",
          content: item.MsgContent.detail,
        };
      }
      if (item.MsgType === "TIMVideoFileElem") {
        params = {
          type: "video",
          content: {
            videoUrl: item.MsgContent.VideoUrl,
          },
        };
      }
      if (item.MsgType === "TIMSoundElem") {
        params = {
          type: "sound",
          content: {
            soundUrl: item.MsgContent.Url,
          },
        };
      }
      this.$refs["dialog"].openDialog(params);
    },
    onDelete(id) {
      this.$confirm("确定从所有设备中双向删除此消息?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        let startTime = null;
        let endTime = null;
        if (this.queryParams.currentDate?.[0]) {
          startTime = dayjs(this.queryParams.currentDate[0]).unix();
        }
        if (this.queryParams.currentDate?.[1]) {
          endTime = dayjs(this.queryParams.currentDate[1]).unix();
        }
        const params = { id };
        if (startTime) {
          params.startTime = startTime;
        }
        if (endTime) {
          params.endTime = endTime;
        }
        delGroupImchatLog(params).then(() => {
          this.getList();
          this.$message({
            type: "success",
            message: "删除成功!",
          });
        });
      });
    },
    getAudioDuration(url) {
      return new Promise((resolve, reject) => {
        const audio = new Audio(url);
        audio.addEventListener("loadedmetadata", () => {
          resolve(audio.duration.toFixed(1)); // 返回音频时长（单位：秒）
        });
        audio.addEventListener("error", () => {
          reject(new Error("无法加载音频文件"));
        });
      });
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.dateRange = [];
      this.resetForm("queryForm");
      this.handleQuery();
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download(
        "app/groupImchatLog/export",
        this.getParams(),
        `c2cImchatLog_${new Date().getTime()}.xlsx`
      );
    },
  },
};
</script>

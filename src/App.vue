<template>
  <div id="bpmn">
    <my-process-designer
      :key="`designer-${reloadIndex}`"
      ref="processDesigner"
      v-model="xmlString"
      v-bind="controlForm"
      keyboard
      :readonly="type===3"
      @element-click="elementClick"
      @init-finished="initModeler"
    />
    <MyPropertiesPanel :key="`penal-${reloadIndex}`" :bpmn-modeler="modeler" :id-edit-disabled="idEditDisabled" :prefix="controlForm.prefix" :readonly="type===3" class="process-panel" />
    <!-- demo config -->
    <div v-if="type!==3" class="demo-control-bar">
      <div class="open-control-dialog" @click="controlDrawerVisible = true"><el-icon><setting /></el-icon></div>
    </div>
    <el-drawer v-model="controlDrawerVisible" size="400px" title="偏好设置" append-to-body destroy-on-close>
      <el-form :model="controlForm" size="default" label-width="100px" class="control-form" @submit.prevent>
        <el-form-item label="流程ID">
          <el-input v-model="controlForm.processId" @change="reloadProcessDesigner" />
        </el-form-item>
        <el-form-item label="流程名称">
          <el-input v-model="controlForm.processName" @change="reloadProcessDesigner" />
        </el-form-item>
        <el-form-item label="流转模拟">
          <el-switch v-model="controlForm.simulation" inactive-text="停用" active-text="启用" @change="reloadProcessDesigner" />
        </el-form-item>
        <el-form-item label="禁用双击">
          <el-switch v-model="controlForm.labelEditing" inactive-text="停用" active-text="启用" @change="changeLabelEditingStatus" />
        </el-form-item>
        <el-form-item label="隐藏label">
          <el-switch v-model="controlForm.labelVisible" inactive-text="停用" active-text="启用" @change="changeLabelVisibleStatus" />
        </el-form-item>
        <el-form-item label="流程引擎">
          <el-radio-group v-model="controlForm.prefix" @change="reloadProcessDesigner">
            <el-radio label="camunda">camunda</el-radio>
            <el-radio label="flowable">flowable</el-radio>
            <el-radio label="activiti">activiti</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="工具栏">
          <el-radio-group v-model="controlForm.headerButtonSize">
            <el-radio label="small">mini</el-radio>
            <el-radio label="default">default</el-radio>
            <el-radio label="large">large</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <br />
    </el-drawer>
  </div>
</template>

<script>
// 参考来源
// https://github.com/miyuesc/bpmn-process-designer
// https://gitee.com/MiyueSC/bpmn-process-designer

import translations from './translations';
// 自定义渲染（隐藏了 label 标签）
import CustomRenderer from './modules/custom-renderer';
// 自定义元素选中时的弹出菜单（修改 默认任务 为 用户任务）
import CustomContentPadProvider from './package/designer/plugins/content-pad';
// 自定义左侧菜单（修改 默认任务 为 用户任务）
import CustomPaletteProvider from './package/designer/plugins/palette';

import 'bpmn-js/dist/assets/diagram-js.css';
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn.css';
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-codes.css';


export default {
  name: 'App',
  data() {
    return {
      xmlString: '',
      modeler: null,
      reloadIndex: 0,
      controlDrawerVisible: false,
      translationsSelf: translations,
      controlForm: {
        processId: '',
        processName: '',
        simulation: true,
        labelEditing: false,
        labelVisible: false,
        prefix: 'activiti',
        headerButtonSize: 'small',
        // additionalModel: []
        additionalModel: [CustomContentPadProvider, CustomPaletteProvider]
      },
      addis: {},
      addLoading: false,
      activeBpmn: {},
      idEditDisabled: false,
      type: 1 // 1-新增 2-修改 3-查看
    };
  },
  created() {
      this.idEditDisabled = false
  },
  methods: {
    initModeler(modeler) {
      setTimeout(() => {
        this.modeler = modeler;
        // console.log(modeler);
      }, 10);
    },
    reloadProcessDesigner() {
      this.controlForm.additionalModel = [];
      for (const key in this.addis) {
        if (this.addis[key]) {
          this.controlForm.additionalModel.push(this.addis[key]);
        }
      }
      this.reloadIndex += 1;
      this.modeler = null; // 避免 panel 异常
    },
    changeLabelEditingStatus(status) {
      this.addis.labelEditing = status ? { labelEditingProvider: ['value', ''] } : false;
      this.reloadProcessDesigner();
    },
    changeLabelVisibleStatus(status) {
      this.addis.customRenderer = status ? CustomRenderer : false;
      this.reloadProcessDesigner();
    },
    elementClick(element) {
      this.element = element;
    }
  }
};
</script>

<style lang="scss">
#app {
  height: 100%;
  width: 100%;
}
#bpmn {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  display: inline-grid;
  grid-template-columns: auto max-content;

}
.demo-control-bar {
  position: fixed;
  right: 8px;
  bottom: 8px;
  z-index: 1;
  .open-control-dialog {
    width: 48px;
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 4px;
    font-size: 32px;
    background: rgba(64, 158, 255, 1);
    color: #ffffff;
    cursor: pointer;
  }
}
.control-form {
  .el-radio {
    width: 100%;
    line-height: 32px;
  }
}

</style>

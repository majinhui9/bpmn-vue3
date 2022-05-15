<template>
  <div class="panel-tab__content">
    <el-form size="default" label-width="90px" :disabled="readonly" @submit.prevent>
      <el-form-item label="ID">
        <el-input v-model="elementBaseInfo.id" :disabled="idEditDisabled" clearable @change="updateBaseInfo('id')" />
      </el-form-item>
      <el-form-item label="名称">
        <el-input v-model="elementBaseInfo.name" clearable @change="updateBaseInfo('name')" />
      </el-form-item>
      <!--流程的基础属性-->
      <template v-if="elementBaseInfo.$type === 'bpmn:Process'">
        <el-form-item label="版本标签">
          <el-input v-model="elementBaseInfo.versionTag" clearable @change="updateBaseInfo('versionTag')" />
        </el-form-item>
        <el-form-item label="可执行">
          <el-switch v-model="elementBaseInfo.isExecutable" active-text="是" inactive-text="否" @change="updateBaseInfo('isExecutable')" />
        </el-form-item>
      </template>
      <!-- 调用活动 -->
      <el-form-item v-if="elementBaseInfo.$type === 'bpmn:CallActivity'" label="调用流程">
        <el-select v-model="elementBaseInfo.calledElement" placeholder="请选择" clearable @change="updateBaseInfo('calledElement')">
          <el-option v-for="item in callList" :key="item.key" :label="item.name" :value="item.key"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item v-if="elementBaseInfo.$type === 'bpmn:CallActivity'" label="业务KEY">
        <el-input v-model="elementBaseInfo.businessKey" clearable @change="updateBaseInfo('businessKey')" />
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
export default {
  name: 'ElementBaseInfo',
  props: {
    businessObject: Object,
    type: String,
    idEditDisabled: {
      type: Boolean,
      default: true
    }
  },
  inject: ['readonly'],
  data() {
    return {
      elementBaseInfo: {},
      callList: []
    };
  },
  watch: {
    businessObject: {
      immediate: false,
      handler: function(val) {
        if (val) {
          this.$nextTick(() => this.resetBaseInfo());
        }
      }
    }
  },
  methods: {
    resetBaseInfo() {
      this.bpmnElement = window?.bpmnInstances?.bpmnElement;
      this.elementBaseInfo = JSON.parse(JSON.stringify(this.bpmnElement.businessObject));
    },
    updateBaseInfo(key) {
      const attrObj = Object.create(null);
      attrObj[key] = this.elementBaseInfo[key];
      if (key === 'id') {
        window.bpmnInstances.modeling.updateProperties(this.bpmnElement, {
          id: this.elementBaseInfo[key],
          di: { id: `${this.elementBaseInfo[key]}_di` }
        });
      } else {
        window.bpmnInstances.modeling.updateProperties(this.bpmnElement, attrObj);
      }
    }
  },
  beforeUnmount() {
    this.bpmnElement = null;
  }
};
</script>

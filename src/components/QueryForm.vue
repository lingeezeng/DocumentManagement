<template>
    <div class="query-form">
        <!-- 调试信息（开发环境使用，可删除） -->
        <div v-if="showDebug" class="debug-info">
            🔍 分类: {{ form.category || '(未选择)' }} |
            级别: {{ form.level || '(未选择)' }} |
            状态: {{ form.status || '(未选择)' }} |
            部门: {{ form.department || '(未输入)' }}
        </div>

        <el-form :model="form" class="toolbar">
            <!-- ========== 第1行 ========== -->
            <el-row :gutter="12">
                <el-col :span="8">
                    <el-form-item label="文件名称" class="compact-item">
                        <el-input v-model="form.fileName"
                                  placeholder="模糊查询"
                                  clearable
                                  size="small" />
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="文件分类" class="compact-item">
                        <el-select v-model="form.category"
                                   clearable
                                   placeholder="请选择"
                                   size="small"
                                   style="width: 100%">
                            <el-option v-for="x in categories"
                                       :key="x"
                                       :label="x"
                                       :value="x" />
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="发放日期" class="compact-item">
                        <el-date-picker v-model="uploadRange"
                                        type="daterange"
                                        value-format="YYYY-MM-DD"
                                        :clearable="true"
                                        start-placeholder="开始"
                                        end-placeholder="结束"
                                        size="small"
                                        style="width: 100%" />
                    </el-form-item>
                </el-col>
            </el-row>

            <!-- ========== 第2行 ========== -->
            <el-row :gutter="12">
                <el-col :span="8">
                    <el-form-item label="起效日期" class="compact-item">
                        <el-date-picker v-model="effectiveRange"
                                        type="daterange"
                                        value-format="YYYY-MM-DD"
                                        :clearable="true"
                                        start-placeholder="开始"
                                        end-placeholder="结束"
                                        size="small"
                                        style="width: 100%" />
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="文件级别" class="compact-item">
                        <el-select v-model="form.level"
                                   clearable
                                   placeholder="请选择"
                                   size="small"
                                   style="width: 100%">
                            <el-option v-for="x in [1, 2, 3, 4]"
                                       :key="x"
                                       :label="x"
                                       :value="x" />
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="发放部门" class="compact-item">
                        <el-input v-model="form.department"
                                  placeholder="部门名称"
                                  clearable
                                  size="small" />
                    </el-form-item>
                </el-col>
            </el-row>

            <!-- ========== 第3行 ========== -->
            <el-row :gutter="12">
                <el-col :span="8">
                    <el-form-item label="失效日期" class="compact-item">
                        <el-date-picker v-model="expiryRange"
                                        type="daterange"
                                        value-format="YYYY-MM-DD"
                                        :clearable="true"
                                        start-placeholder="开始"
                                        end-placeholder="结束"
                                        size="small"
                                        style="width: 100%" />
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="文件状态" class="compact-item">
                        <el-select v-model="form.status"
                                   clearable
                                   placeholder="请选择"
                                   size="small"
                                   style="width: 100%">
                            <el-option label="有效" value="有效" />
                            <el-option label="失效" value="失效" />
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="8" class="btn-col">
                    <el-button type="primary" size="small" @click="handleSearch">查询</el-button>
                    <el-button size="small" @click="handleReset">重置</el-button>
                </el-col>
            </el-row>
        </el-form>
    </div>
</template>

<script setup>
    import { reactive, ref, watch } from 'vue'

    // ==================== 常量定义 ====================
    const categories = ['手冊', '程序', '作業指引']

    // ==================== 调试开关 ====================
    const showDebug = ref(false)

    // ==================== 表单数据 ====================
    const form = reactive({
        fileName: '',
        category: '',
        level: null,
        status: '',
        department: ''
    })

    const uploadRange = ref([])
    const effectiveRange = ref([])
    const expiryRange = ref([])

    // ==================== 事件定义 ====================
    const emit = defineEmits(['search'])

    // ==================== 方法 ====================
    function buildParams() {
        return {
            fileName: form.fileName || null,
            category: form.category || null,
            level: form.level || null,
            status: form.status || null,
            department: form.department || null,
            uploadDateFrom: uploadRange.value?.[0] || null,
            uploadDateTo: uploadRange.value?.[1] || null,
            effectiveDateFrom: effectiveRange.value?.[0] || null,
            effectiveDateTo: effectiveRange.value?.[1] || null,
            expiryDateFrom: expiryRange.value?.[0] || null,
            expiryDateTo: expiryRange.value?.[1] || null
        }
    }

    function handleSearch() {
        const params = buildParams()
        console.log('📤 查询参数:', params)
        emit('search', params)
    }

    function handleReset() {
        form.fileName = ''
        form.category = ''
        form.level = null
        form.status = ''
        form.department = ''
        uploadRange.value = []
        effectiveRange.value = []
        expiryRange.value = []
        handleSearch()
    }

    // ==================== 调试监控 ====================
    watch(() => form.category, (newVal, oldVal) => {
        if (newVal !== oldVal) {
            console.log('🟢 分类变化:', oldVal, '→', newVal)
        }
    })

    watch(() => form.level, (newVal, oldVal) => {
        if (newVal !== oldVal) {
            console.log('🟢 级别变化:', oldVal, '→', newVal)
        }
    })

    // ==================== 暴露给父组件的方法 ====================
    defineExpose({
        search: handleSearch,
        reset: handleReset,
        getParams: buildParams
    })
</script>
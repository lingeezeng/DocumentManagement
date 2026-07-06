<template>
    <div class="page">
        <div class="page-header">
            <h2>✏️ 文件修改</h2>
        </div>

        <!-- 查询表单 -->
        <QueryForm ref="queryFormRef" @search="handleSearch" />

        <!-- 文档表格（显示修改按钮） -->
        <DocumentTable :data="tableData"
                       :loading="loading"
                       mode="edit"
                       @row-click="handleRowClick"
                       @edit="handleEdit"
                       @open="handleOpen" />

        <el-divider />

        <!-- 编辑表单 -->
        <el-empty v-if="!selected" description="请先在查询结果中选择一份文件" />
        <el-form v-else :model="form" label-width="100px" style="max-width:520px">
            <el-form-item label="文件名称">{{ selected.fileName }}</el-form-item>
            <el-form-item label="文件分类">
                <el-select v-model="form.category">
                    <el-option v-for="x in categories" :key="x" :label="x" :value="x" />
                </el-select>
            </el-form-item>
            <el-form-item label="文件级别">
                <el-select v-model="form.level">
                    <el-option v-for="x in [1,2,3,4]" :key="x" :label="x" :value="x" />
                </el-select>
            </el-form-item>
            <el-form-item label="文件状态">
                <el-select v-model="form.status">
                    <el-option label="有效" value="有效" />
                    <el-option label="失效" value="失效" />
                </el-select>
            </el-form-item>
            <el-form-item label="发放部门">
                <el-input v-model="form.departments" placeholder="多个部门用 / 分开" />
            </el-form-item>
            <el-button type="primary" @click="save">保存修改</el-button>
        </el-form>
    </div>
</template>

<script setup>
    import { reactive, ref, watch, onMounted } from 'vue'
    import { ElMessage } from 'element-plus'
    import { queryDocuments, updateDocument } from '../api/documents'
    import QueryForm from '../components/QueryForm.vue'
    import DocumentTable from '../components/DocumentTable.vue'

    const queryFormRef = ref(null)
    const categories = ['手冊', '程序', '作業指引']
    const selected = ref(null)
    const tableData = ref([])
    const loading = ref(false)

    const form = reactive({
        category: '',
        level: 1,
        status: '',
        departments: ''
    })

    // 处理查询
    async function handleSearch(params) {
        loading.value = true
        try {
            const res = await queryDocuments(params)
            tableData.value = res.data || []
            if (tableData.value.length === 0) {
                console.log('📭 没有找到匹配的文件')
            }
        } catch (error) {
            console.error('❌ 查询失败:', error)
            tableData.value = []
        } finally {
            loading.value = false
        }
    }

    // 行点击 - 选中文件
    function handleRowClick(row) {
        console.log('🟢 点击行:', row.fileName)
        selected.value = row
    }

    // 编辑按钮点击
    function handleEdit(row) {
        console.log('🟢 编辑按钮点击:', row.fileName)
        selected.value = row
    }

    // 打开文件
    function handleOpen(row) {
        console.log('📄 打开文件:', row.fileName)
    }

    // 监听 selected 变化，更新表单
    watch(selected, (row) => {
        if (row) {
            Object.assign(form, {
                category: row.category || '',
                level: row.level || 1,
                status: row.status || '',
                departments: row.departments || ''
            })
        }
    })

    // 保存修改
    async function save() {
        if (!selected.value) {
            ElMessage.warning('请先选择一份文件')
            return
        }

        const id = selected.value.id
        if (!id) {
            ElMessage.error('文件 ID 不存在')
            return
        }

        try {
            await updateDocument(id, form)
            ElMessage.success('✅ 修改成功')

            // 刷新表格
            if (queryFormRef.value && typeof queryFormRef.value.search === 'function') {
                await queryFormRef.value.search()
            }
        } catch (error) {
            console.error('❌ 保存失败:', error)
            ElMessage.error('修改失败：' + (error.response?.data?.message || error.message))
        }
    }

    // 页面加载时自动查询
    onMounted(() => {
        handleSearch({})
    })
</script>
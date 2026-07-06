<template>
    <div class="page">
        <div class="page-header">
            <h2>📄 文件查询</h2>
        </div>

        <!-- 查询表单 -->
        <QueryForm ref="queryFormRef" @search="handleSearch" />

        <!-- 文档表格 -->
        <DocumentTable :data="tableData"
                       :loading="loading"
                       mode="query"
                       @row-click="handleRowClick"
                       @open="handleOpen" />
    </div>
</template>

<script setup>
    import { ref, onMounted } from 'vue'
    import { queryDocuments } from '../api/documents'
    import QueryForm from '../components/QueryForm.vue'
    import DocumentTable from '../components/DocumentTable.vue'

    const queryFormRef = ref(null)
    const tableData = ref([])
    const loading = ref(false)

    /**
     * 处理查询
     */
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

    /**
     * 行点击事件
     */
    function handleRowClick(row) {
        console.log('🟢 点击行:', row.fileName)
    }

    /**
     * 打开文件事件
     */
    function handleOpen(row) {
        console.log('📄 打开文件:', row.fileName)
    }

    /**
     * 重置查询（外部调用）
     */
    function resetQuery() {
        if (queryFormRef.value && typeof queryFormRef.value.reset === 'function') {
            queryFormRef.value.reset()
        }
    }

    // 页面加载时自动查询
    onMounted(() => {
        handleSearch({})
    })

    // 暴露方法给父组件（如果需要）
    defineExpose({
        refresh: handleSearch,
        reset: resetQuery
    })
</script>
<template>
    <div class="page">
        <div class="page-header">
            <h2>📊 文件统计</h2>
        </div>

        <!-- 统计工具栏 -->
        <div class="statistics-toolbar">
            <el-date-picker v-model="range"
                            type="daterange"
                            value-format="YYYY-MM-DD"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            size="default" />
            <el-button type="primary" @click="load" size="default">统计</el-button>
        </div>

        <!-- 统计结果 -->
        <div v-for="table in tables" :key="table.key" class="stat-card-wrapper">
            <div class="stat-card-title">{{ table.title }}</div>
            <el-table :data="stats[table.key] || []" border size="small">
                <el-table-column prop="name" label="项目" />
                <el-table-column prop="count" label="文件数量" align="center" />
            </el-table>
        </div>

        <!-- 空状态 -->
        <el-empty v-if="!hasData" description="请选择日期范围并点击统计" />
    </div>
</template>

<script setup>
    import { reactive, ref, computed } from 'vue'
    import { ElMessage } from 'element-plus'
    import { getStatistics } from '../api/documents'

    const range = ref([])
    const stats = reactive({})
    const loading = ref(false)

    const tables = [
        { key: 'byUploadDate', title: '📅 按上传日期汇总' },
        { key: 'byEffectiveDate', title: '📅 按起效日期汇总' },
        { key: 'byExpiryDate', title: '📅 按失效日期汇总' },
        { key: 'byCategory', title: '📂 按文件分类汇总' },
        { key: 'byLevel', title: '📊 按文件级别汇总' },
        { key: 'byStatus', title: '🏷️ 按文件状态汇总' },
        { key: 'byDepartment', title: '🏢 按发放部门汇总' }
    ]

    // 是否有数据
    const hasData = computed(() => {
        return Object.keys(stats).length > 0 && tables.some(t => stats[t.key]?.length > 0)
    })

    // 加载统计数据
    async function load() {
        if (!range.value?.length) {
            ElMessage.warning('请选择日期范围')
            return
        }

        loading.value = true
        try {
            const { data } = await getStatistics({
                from: range.value[0],
                to: range.value[1]
            })
            Object.assign(stats, data)
            ElMessage.success('✅ 统计完成')
        } catch (error) {
            console.error('❌ 统计失败:', error)
            ElMessage.error('统计失败：' + (error.response?.data?.message || error.message))
        } finally {
            loading.value = false
        }
    }
</script>
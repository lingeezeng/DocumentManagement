<template>
    <div class="document-table">
        <el-table :data="data"
                  border
                  @row-click="handleRowClick"
                  v-loading="loading"
                  size="small">
            <el-table-column prop="fileNumber" label="文件编号" width="120" />
            <el-table-column prop="fileName" label="文件名称" min-width="180" />
            <el-table-column prop="fileType" label="类型" width="80" />
            <el-table-column prop="category" label="分类" width="100" />
            <el-table-column prop="level" label="级别" width="80" />
            <el-table-column prop="status" label="状态" width="80">
                <template #default="{ row }">
                    <el-tag :type="row.status === '有效' ? 'success' : 'danger'" size="small">
                        {{ row.status }}
                    </el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="departments" label="发放部门" min-width="120" />

            <!-- 操作列 -->
            <el-table-column label="操作" width="120" fixed="right">
                <template #default="{ row }">
                    <!-- query 模式：显示"打开"按钮 -->
                    <el-button v-if="mode === 'query'"
                               link
                               type="primary"
                               size="small"
                               @click.stop="handleOpen(row)">
                        打开
                    </el-button>

                    <!-- edit 模式：显示"修改"按钮 -->
                    <el-button v-if="mode === 'edit'"
                               link
                               type="warning"
                               size="small"
                               @click.stop="handleEdit(row)">
                        修改
                    </el-button>
                </template>
            </el-table-column>
        </el-table>

        <!-- 空状态 -->
        <el-empty v-if="!loading && data.length === 0" description="暂无数据" />
    </div>
</template>

<script setup>
    import { openDocumentUrl } from '../api/documents'

    // Props
    const props = defineProps({
        data: {
            type: Array,
            required: true,
            default: () => []
        },
        loading: {
            type: Boolean,
            default: false
        },
        // mode: 'query' 显示"打开"，'edit' 显示"修改"
        mode: {
            type: String,
            default: 'query',
            validator: (value) => ['query', 'edit'].includes(value)
        }
    })

    // 事件
    const emit = defineEmits(['row-click', 'open', 'edit'])

    // 行点击
    function handleRowClick(row) {
        emit('row-click', row)
    }

    // 打开文件（仅 query 模式）
    function handleOpen(row) {
        const token = localStorage.getItem('token')
        const url = `${openDocumentUrl(row.id)}?access_token=${token}`
        window.open(url, '_blank')
        emit('open', row)
    }

    // 修改文件（仅 edit 模式）
    function handleEdit(row) {
        console.log('🟢 修改按钮点击:', row.fileName)
        emit('edit', row)
    }
</script>
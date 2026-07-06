<template>
    <div class="page">
        <div class="page-header">
            <h2>📤 文件上传</h2>
        </div>

        <el-alert title="先选择 Excel 清单，再选择清单对应的多个文件。文件名需与清单中的文件名称匹配。"
                  type="info"
                  show-icon
                  :closable="false" />

        <div class="upload-toolbar">
            <el-upload :auto-upload="false"
                       :limit="1"
                       :on-change="onExcel"
                       :on-remove="() => excel = null"
                       :on-exceed="() => ElMessage.warning('只能选择一个 Excel 文件')">
                <el-button size="default">📋 选择 Excel 清单</el-button>
            </el-upload>

            <el-upload :auto-upload="false"
                       multiple
                       :on-change="onFile"
                       :on-remove="onRemoveFile">
                <el-button size="default">📎 选择文件</el-button>
            </el-upload>

            <el-button type="primary" :loading="loading" @click="submit">
                {{ loading ? '上传中...' : '🚀 批量上传' }}
            </el-button>
        </div>

        <!-- 文件列表 -->
        <div v-if="files.length > 0" class="upload-file-list">
            <span class="file-list-label">已选文件 ({{ files.length }})：</span>
            <el-tag v-for="(file, index) in files"
                    :key="index"
                    size="default"
                    closable
                    @close="() => removeFileByIndex(index)"
                    style="margin: 2px 4px">
                {{ file.name }}
            </el-tag>
        </div>

        <!-- 上传结果表格 -->
        <el-table v-if="rows.length" :data="rows" border size="small" class="upload-result-table">
            <el-table-column prop="fileName" label="文件名称" min-width="180" />
            <el-table-column prop="success" label="结果" width="100" align="center">
                <template #default="{ row }">
                    <el-tag :type="row.success ? 'success' : 'danger'" size="small">
                        {{ row.success ? '✅ 成功' : '❌ 失败' }}
                    </el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="message" label="说明" min-width="200" />
        </el-table>

        <!-- 空状态 -->
        <el-empty v-if="rows.length === 0 && !loading" description="上传结果将显示在这里" />
    </div>
</template>

<script setup>
    import { ref } from 'vue'
    import { ElMessage } from 'element-plus'
    import { batchUpload } from '../api/documents'

    const excel = ref(null)
    const files = ref([])
    const rows = ref([])
    const loading = ref(false)

    // 选择 Excel 文件
    const onExcel = file => {
        excel.value = file.raw
        ElMessage.success(`已选择 Excel: ${file.name}`)
    }

    // 选择文件
    const onFile = file => {
        files.value.push(file.raw)
    }

    // 移除文件
    const onRemoveFile = file => {
        files.value = files.value.filter(x => x.name !== file.name)
    }

    // 按索引移除文件
    const removeFileByIndex = (index) => {
        files.value.splice(index, 1)
    }

    // 批量上传
    async function submit() {
        if (!excel.value) {
            ElMessage.warning('请先选择 Excel 清单')
            return
        }
        if (files.value.length === 0) {
            ElMessage.warning('请选择要上传的文件')
            return
        }

        const form = new FormData()
        form.append('excel', excel.value)
        files.value.forEach(f => form.append('files', f))

        loading.value = true
        try {
            const { data } = await batchUpload(form)
            rows.value = data.rows || []
            ElMessage.success(`✅ 成功 ${data.success || 0} 份，失败 ${data.failed || 0} 份`)
        } catch (error) {
            console.error('❌ 上传失败:', error)
            ElMessage.error(error.response?.data?.message || '上传失败，请重试')
        } finally {
            loading.value = false
        }
    }
</script>
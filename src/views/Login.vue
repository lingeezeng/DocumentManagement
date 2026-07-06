<template>
    <div class="login-page">
        <div class="login-box">
            <h2>📁 文档管理系统</h2>
            <p class="login-subtitle">请登录以继续</p>

            <el-form :model="form" @keyup.enter="submit">
                <el-form-item label="用户名">
                    <el-input v-model="form.Username"
                              placeholder="请输入用户名"
                              size="large"
                              prefix-icon="User" />
                </el-form-item>
                <el-form-item label="密码">
                    <el-input v-model="form.Password"
                              type="password"
                              show-password
                              placeholder="请输入密码"
                              size="large"
                              prefix-icon="Lock"
                              @keyup.enter="submit" />
                </el-form-item>
                <el-button type="primary"
                           :loading="loading"
                           @click="submit"
                           size="large"
                           style="width:100%; margin-top: 8px;">
                    {{ loading ? '登录中...' : '登 录' }}
                </el-button>
            </el-form>
        </div>
    </div>
</template>

<script setup>
    import { reactive, ref } from 'vue'
    import { useRouter } from 'vue-router'
    import { ElMessage } from 'element-plus'
    import { useAuthStore } from '../stores/auth'

    const form = reactive({
        Username: 'admin',
        Password: 'Admin@123'
    })
    const loading = ref(false)
    const auth = useAuthStore()
    const router = useRouter()

    async function submit() {
        // 基本校验
        if (!form.Username.trim()) {
            ElMessage.warning('请输入用户名')
            return
        }
        if (!form.Password.trim()) {
            ElMessage.warning('请输入密码')
            return
        }

        loading.value = true
        try {
            form.Username = form.Username.trim()
            form.Password = form.Password.trim()
            await auth.signIn(form)
            ElMessage.success('✅ 登录成功')
            router.push('/query')
        } catch (error) {
            console.error('❌ 登录失败:', error)
            ElMessage.error(error.response?.data?.message || error.response?.data || '登录失败，请确认后端已启动、数据库连接正常')
        } finally {
            loading.value = false
        }
    }
</script>
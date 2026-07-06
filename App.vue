<template>
    <el-container class="app-container">
        <!-- ========== 顶部导航栏 ========== -->
        <el-header class="app-header">
            <!-- 左侧：品牌标题 -->
            <div class="header-left">
                <span class="app-title">📁 文档管理系统</span>
            </div>

            <!-- 中间：菜单（不限制宽度，自动撑开） -->
            <div class="header-center">
                <el-menu :default-active="activeMenu"
                         mode="horizontal"
                         router
                         class="header-menu">
                    <el-menu-item index="/upload">📤 文件上传</el-menu-item>
                    <el-menu-item index="/edit">✏️ 文件修改</el-menu-item>
                    <el-menu-item index="/query">📄 文件查询</el-menu-item>
                    <el-menu-item index="/statistics">📊 文件统计</el-menu-item>
                </el-menu>
            </div>

            <!-- 右侧：用户信息 + 退出 -->
            <div class="header-right">
                <span class="username">{{ auth.username }}</span>
                <el-button size="small" @click="logout">退出</el-button>
            </div>
        </el-header>

        <!-- ========== 主内容区 ========== -->
        <el-main class="app-main">
            <router-view />
        </el-main>
    </el-container>
</template>

<script setup>
    import { computed } from 'vue'
    import { useRouter, useRoute } from 'vue-router'
    import { useAuthStore } from './stores/auth'

    const auth = useAuthStore()
    const router = useRouter()
    const route = useRoute()

    const activeMenu = computed(() => route.path)

    function logout() {
        auth.signOut()
        router.push('/login')
    }
</script>
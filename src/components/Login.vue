<template>
<div class="login_container">
    <div class="login_box">
        <div class="avatar_box">
            <img src="../assets/logo.png" alt="">
        </div>
        <!-- 登录表单区域 -->
        <el-form ref="form" :model='loginForm' :rules="loginRules" label-width="0px" class="login_form">
            <!-- 用户名 -->
            <el-form-item prop="username">
                <el-input v-model="loginForm.username" prefix-icon="iconfont icon-user"></el-input>
            </el-form-item>
            <!-- 密码 -->
            <el-form-item prop="password">
                <el-input v-model="loginForm.password" prefix-icon="iconfont icon-3702mima" type="password"></el-input>
            </el-form-item>
            <!-- 按钮 -->
            <el-form-item class="btn">
                <el-button type="primary" @click="login">登录</el-button>
                <el-button type="info" @click="resetForm">重置</el-button>
            </el-form-item>
        </el-form>
    </div>
</div>
</template>

<script>
export default {
    data() {
        return {
            // 这是登录表单的数据绑定对象
            loginForm: {
                username: '',
                password: ''
            },
            // 这是表单的验证规则对象
            // 注: porp的属性设置时需要对应校验的字段名 username password
            loginRules: {
                username: [
                    { required: true, message: '请输入用户名', trigger: 'blur' },
                    { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
                ],
                password: [
                    { required: true, message: '请输入密码', trigger: 'blur' },
                    { min: 6, max: 8, message: '长度在 6 到 8 个字符', trigger: 'blur' }
                ]
            }
        }
    },
    methods: {
        resetForm() {
            // 获取表单组件实例 this.$refs
            // resetField()
            this.$refs.form.resetFields()
        },
        login() {
            this.$refs.form.validate(async (flag)=> {
                // console.log(flag);
                if(!flag) return;
                var res = await this.axios.put('login',this.loginForm)
                console.log(res);
                if(res.meta.status == 200) {
                   this.$message.success('登录成功')
                   sessionStorage.setItem('token',res.data.token)
                    this.$router.push('/home')              
                } else {
                    this.$message.error(res.meta.msg)                   
                }
                
                
            })
        }
    }
}
</script>

<style lang="less" scoped>
// 加scoped代表样式只在这个组件起作用
.login_container {
    height: 100%;
    width: 100%;
    background-color: #2b4b6b;
    .login_box {
        width: 450px;
        height: 300px;
        border-radius: 5px;
        position: absolute;
        top: 50%;
        left:50%;
        transform: translate(-50%,-50%);
        background-color: #fff;

        .avatar_box {
            width: 130px;
            height: 130px;
            border: 1px solid #eee;
            border-radius: 50%;
            box-shadow: 0 0 10px;
            padding: 5px;
            position: absolute;
            left: 50%;
            transform: translate(-50%,-50%);
            background-color: #fff;

            img {
                width: 100%;
                height: 100%;
                border-radius: 50%;
            }
        }
        .login_form {
            position: absolute;
            bottom: 0;
            width: 100%;
            box-sizing: border-box;
            padding: 20px;

            .btn {
                float: right;
            }
        }
    }
}

</style>


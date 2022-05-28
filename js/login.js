class Login {
    constructor() {
        // 点击登录,获取表单中的数据,封装实现登录的方法.给登录按钮绑定点击事件,封装获取节点的方法
        // 箭头函数作为元素事件的回调函数时 this也指向宿主 不会指向节点对象
        this.$('.over').addEventListener('click', this.islogin)

        // console.log(location.search.split('='));
        // 判断当前是否有回调函数
        let search=location.search;
        if(search){
            this.url=search.split('=')[1];
        }

    }
    /*******封装实现登录的方法*******/
    islogin = () => {
        //1.收集表单中的数据
        let form = document.forms[0].elements;
        // console.log(form);
        let username = form.uname.value.trim();
        let password = form.password.value.trim();
        // console.log(username,password);
        // 2.进行非空验证
        if (!username || !password) throw new Error('用户名和密码不正确...')
        // 3.发送ajax请求实现登录
        // 参数传递方式,key=val&key=val
        let param = `username=${username}&password=${password}`;
        axios.post('http://localhost:8888/users/login', param, {
            // 当变量名和属性名一致的时候,直接写变量名
            Headers: {
                // axios 默认以json的形式请求和编码参数
                // axios.defaults.headers.common['Content-Type'] = 'application/x-www-form-urlencoded';
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).then(res => {
            console.log(res);
            // 判断登录状态,将用户信息进行保存
            if (res.status == 200 && res.data.code == 1){
                // 将token和user进行保存到local
                localStorage.setItem('token',res.data.token);
                localStorage.setItem('user_id',res.data.user.id);
                // 如果有回调的地址,则跳转
                if(this.url){
                    location.href=this.url;
                }
            }
        })


    }

    

    /*******封装获取节点的方法*******/
    $(ele) {
        let res = document.querySelectorAll(ele);
        // console.log(res);
        // 如果获取到的是单个节点集合,,就返回单个节点,如果是多个节点,就返回节点集合
        return res.length == 1 ? res[0] : res;
    }
}
new Login;
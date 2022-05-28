class List {
    constructor() {
        this.getDate();
        this.bindEve();

    }
    /******封装绑定事件的方法******/
    bindEve() {
        // 给ul绑定点击事件,点击之后加入购物车,则要封装加入购物车的方法在此调用
        this.$('.sk_bd ul').addEventListener('click', this.addCart.bind(this))
    }
    /*****获取数据的方法******/
    // 使用async await等待后面的promise解包完成,拿到最后结果
    async getDate() {
        // console.log(1111);
        // 1.发送ajax get请求,获取商品列表的相关数据
        let { status, data } = await axios.get('http://localhost:8888/goods/list');
        // console.log(status, data);
        // 2.判断请求状态是否成功
        if (status != 200 && data.code != 1) throw new Error('获取数据失败...');
        // 3.循环渲染数据,追加到页面中
        let html = '';
        data.list.forEach(goods => {
            // console.log(goods);
            html += `<li class="sk_goods">
            <a href="#none">
                <img src="${goods.img_big_logo}" alt="">
            </a>
            <h5 class="sk_goods_title">${goods.title}</h5>
            <p class="sk_goods_price">
                <em>¥${goods.current_price}</em>
                <del>￥${goods.price}</del>
            </p>
            <div class="sk_goods_progress">
                已售
                <i>${goods.sale_type}</i>
                <div class="bar">
                    <div class="bar_in"></div>
                </div>
                剩余
                <em>29</em>件
            </div>
            <a href="#none" class="sk_goods_buy">立即抢购</a>
        </li>`
        });
        // console.log(html);
        // 将拼接好的字符串追加到ul中,需要获取ul节点,则要封装获取节点的方法
        this.$('.sk_bd ul').innerHTML += html;

    }
    /******封装加入购物车的方法******/
    addCart(eve) {
        // console.log(this);
        // 获取事件源,判断点击的是否为a标签
        // console.log(eve.target);
        if (eve.target.nodeName != 'A' || eve.target.className != 'sk_goods_buy') return;
        // 判断用户是否登录,如果local中有token,表示登录,没有则表示未登录
        let token=localStorage.getItem('token');
        // console.log(token);
        // 没有token表示未登录,跳转到登录页面
        if(!token) location.assign('./login.html?ReturnUrl=./list.html')
    }

    /******封装获取节点的方法*******/
    $(ele) {
        let res = document.querySelectorAll(ele);
        // 如果获取到的是单个节点集合,,就返回单个节点,如果是多个节点,就返回节点集合
        return res.length == 1 ? res[0] : res;

    }
}
new List;

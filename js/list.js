class List {
    constructor() {

        this.getDate();
        this.bindEve();
        // 默认页码
        this.currentPage = 1;
        // 使用锁
        this.lock = false;
    }
    /******封装绑定事件的方法******/
    bindEve() {
        // 给ul绑定点击事件,点击之后加入购物车,则要封装加入购物车的方法在此调用
        this.$('.sk_bd ul').addEventListener('click', this.checkLogin.bind(this))

        // 滚动条事件
        window.addEventListener('scroll', this.lazyLoader)
    }
    /*****获取数据的方法******/
    // 使用async await等待后面的promise解包完成,拿到最后结果
    async getDate(page = 1) {
        // console.log(1111);
        // 1.发送ajax get请求,获取商品列表的相关数据
        let { status, data } = await axios.get('http://localhost:8888/goods/list?current=' + page);
        // console.log(status, data);
        // 2.判断请求状态是否成功
        if (status != 200 && data.code != 1) throw new Error('获取数据失败...');
        // 3.循环渲染数据,追加到页面中
        let html = '';
        data.list.forEach(goods => {
            // console.log(goods);
            html += `<li class="sk_goods" data-id="${goods.goods_id}">
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
    /******封装检查是否登录的方法******/
    checkLogin(eve) {
        // console.log(this);
        // 获取事件源,判断点击的是否为a标签
        // console.log(eve.target);
        if (eve.target.nodeName != 'A' || eve.target.className != 'sk_goods_buy') return;
        // 判断用户是否登录,如果local中有token,表示登录,没有则表示未登录
        let token = localStorage.getItem('token');
        // console.log(token);
        // 没有token表示未登录,跳转到登录页面
        if (!token) location.assign('./login.html?ReturnUrl=./list.html');

        // 如果用户已经登录,此时就需要将商品加入购物车
        // 获取商品id和用户id
        let goodsId = eve.target.parentNode.dataset.id;
        // console.log(goodsId);
        let userId = localStorage.getItem('user_id');


        this.addCartGoods(goodsId, userId);

    }
    // 封装一个加入购物车的方法
    addCartGoods(gId, uId) {
        // console.log(gId,uId);
        // 给添加购物车接口,发送请求
        // 调用购物车接口,后台要验证是否为登录状态,需要传递token
        const AUTH_TOKEN = localStorage.getItem('token');
        axios.defaults.headers.common['authorization'] = AUTH_TOKEN;
        axios.defaults.headers['Content-Type'] = 'application/x-www-form-urlencoded';
        let param = `id=${uId}&goodsId=${gId}`;
        axios.post('http://localhost:8888/cart/add', param).then(({ data, status }) => {
            console.log(data, status);
            // 判断添加购物车是否成功
            if (status == 200 && data.code == 1) {
                layer.open({
                    title: '商品添加成功'
                    , content: '进购物车看看吗?'
                    , btn: ['留下', '去吧']
                    , btn2: function (index, layero) {
                        // console.log('去购物车了....');
                        location.assign('./cart.html')
                    }
                });
            } else if (status == 200 & data.code == 401) {//如果登录过期,则重新登录
                // 清除local中存的token和userid
                localStorage.removeItem('token');
                localStorage.removeItem('user_id');
                // 跳转到登录页面
                location.assign('./login.html?ReturnUrl=./list.html')
            } else {
                layer.open({
                    title: '失败提示框'
                    , content: '商品添加失败'
                    , time: 3000
                });
            }


        })
    }


    /******懒加载**** */
    // 当前需要的高度===滚动条距离顶部的高度+ 可视区的高度
    // 需要获取新的数据     当前实际内容高度<滚动条距离顶部的高度+ 可视区的高度

    lazyLoader = () => {
        // 需要滚动条高度,可视区高度,实际内容高度
        let top = document.documentElement.scrollTop;
        // console.log(top, 't');
        let cliH = document.documentElement.clientHeight;
        // console.log(cliH, 'c');
        let conH = this.$('.sk_container').offsetHeight;
        // console.log(conH);
        // 但滚动条高度+可视区的高度> 实际内容高度时,就加载新数据
        if (top + cliH > (conH + 450)) {
            // console.log(111);
            // this.getData(++this.currentPage)
            // 一瞬间就满足条件,会不停的触发数据加载,使用节流和防抖

            // 如果是锁着的,就结束代码执行
            if (this.lock) return;
            this.lock = true;
            // 指定时间开锁,才能进行下次数据清除
            setTimeout(() => {
                this.lock = false;
            }, 1000)
            // console.log(1111);
            this.getDate(++this.currentPage)
        }

    }

    /******封装获取节点的方法*******/
    $(ele) {
        let res = document.querySelectorAll(ele);
        // 如果获取到的是单个节点集合,,就返回单个节点,如果是多个节点,就返回节点集合
        return res.length == 1 ? res[0] : res;

    }
}
new List;

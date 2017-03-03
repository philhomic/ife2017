//订阅
function EventTarget(){

}

EventTarget.prototype = {
    constructor: EventTarget,
    addListener: function(name, fn){
        if(!this.hasOwnProperty("_listeners")){
            this._listeners = [];
        }
        if(typeof this._listeners[name] == 'undefined'){
            this._listeners[name] = [];
        }
        this._listeners[name].push(fn);
    },
    fire: function(name, value){
        if(this._listeners && this._listeners[name] instanceof Array){
            var fns = this._listeners[name];
            for(var i = 0, len = fns.length; i < len; i++){
                fns[i](value);
            }
        }
    }
}

//观察者
function Observer(data) {
    this.data = data;
    this.walk(data);
    this.event = new EventTarget();
}

let p = Observer.prototype;

p.walk = function (obj) {
    let val;
    for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
            val = obj[key];

            if (typeof val === 'object') {
                new Observer(val);
            }

            this.convert(key, val);
        }
    }
};

p.convert = function (key, val) {
    var self = this;
    Object.defineProperty(this.data, key, {
        enumerable: true,
        configurable: true,
        get: function () {
            return val;
        },
        set: function (newVal) {
            if (newVal === val) return;
            val = newVal;
            if(typeof newVal == 'object'){
                new Observer(newVal)
            };
            self.event.fire(key, val);

        }
    })
};

p.$watch = function(name, fn){
    this.event.addListener(name, fn);
}


//以下是测试

let app1 = new Observer({
    name: 'youngwind',
    age: 25
});

// 你需要实现 $watch 这个 API
app1.$watch('age', function(age) {
    console.log(`我的年纪变了，现在已经是：${age}岁了`)
});

app1.data.age = 100; // 输出：'我的年纪变了，现在已经是100岁了'

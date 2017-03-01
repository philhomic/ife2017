/**
 * Created by WangPei on 2017/3/1.
 */
//Vue task 1

function Observer(data) {
    this.data = data;
    this.walk(data)
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
    Object.defineProperty(this.data, key, {
        enumerable: true,
        configurable: true,
        get: function () {
            console.log('你访问了' + key);
            return val
        },
        set: function (newVal) {
            console.log('你设置了' + key + '，新的值为' + newVal);
            if (newVal === val) return;
            val = newVal
            if(typeof newVal == 'object'){
                new Observer(newVal)
            }
        }
    })
};

let app1 = new Observer({
    name: 'youngwind',
    age: 25
});

let app2 = new Observer({
    university: 'bupt',
    major: 'computer'
});


//以下是测试
app1.data.name;
app1.data.age = 100;
app2.data.university;
app2.data.major = 'science';

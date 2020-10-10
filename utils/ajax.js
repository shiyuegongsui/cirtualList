let baseUrl = "https://api.fjdaze.com/zx";

wx.$baseUrl = baseUrl;

function ajax(method, url, data, loading, ignoreToken) {
    return new Promise((resolve, reject) => {
        if (loading) {
            wx.showLoading({
                title: '数据加载中'
            });
        }
        let token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ2aXAiOjEsImV4cCI6MTYwNDg4NDA3NywidXNlcklkIjoiMjQ4MzYwNTkxNTg4OTY2NCIsImlhdCI6MTYwMjI5MjA3Nywiand0SWQiOiJvSnF2MjZuYklpQjRJZ00tQWR1OENGNGdVa1k0In0.oc9erZ49Uo2cIjGHpyqWDOzJTJjunTrV78tzXGvEJuM";

        if (!data.userId) {
            let userId = wx.getStorageSync("userId");
            if (url.indexOf("tool/c") > -1) {
                if (userId) {
                    data.userId = userId;
                }
            }
        }

        let postUrl = baseUrl + url;
        if (url.indexOf("://") > 0) {

            postUrl = url;
        }

        wx.request({
            url: postUrl,
            data: data,
            header: {
                'content-type': 'application/json',
                "token": token,
                'platform':0
            },
            method: method ? method.toUpperCase() : "POST",
            success: function (res) {
                if (res.statusCode == 200) {
                    console.log(res.data.code)
                    if (res.data.code == 200) {
                        resolve(res.data);
                        return;
                    }
                } else {
                    recordError({
                        requestUrl: url,
                        data: JSON.stringify(data),
                        errorCode: res.statusCode,
                    });
                    wx.showLoading('网络错误' + res.statusCode);
                }
            },
            fail: function (error) {
                wx.showLoading("网络错误");
                reject(error);
            },
            complete: function () {

                if (loading) {
                    setTimeout(() => {
                        wx.hideLoading();
                    }, 500)
                }
            }
        })
    });
}


function recordError(options) {
    wx.request({
        url: "https://api.fjdaze.com/commonser/api/common/log/add",
        data: {
            func: "接口报错",
            projectName: "觅享相册",
            requestUrl: options.requestUrl,
            errorCode: options.errorCode,
            params: options.params || '{}'
        },
        header: {
            'content-type': 'application/json'
        },
        method: "POST",
        success: function (res) { }
    })
}

function get(url, data, loading, ignoreToken) {
    return ajax("GET", url, data, loading, ignoreToken);
}

function post(url, data, loading, ignoreToken) {
    return ajax("POST", url, data, loading, ignoreToken);
}

module.exports = {
    get: get,
    post: post
}
const timeout = 60000;

// 添加拦截器
const httpInterceptor = {
  // 拦截前触发
  invoke(options: UniApp.RequestOptions) {
    // 非http请求，添加前缀
    if (!options.url.startsWith('http')) {
      options.url = '/test' + options.url;
    }
    options.timeout = timeout;
    options.header = {
      ...options.header,
      // 自定义标识符，用于后端区分app、后台或其他渠道请求
      'source-client': 'H5',
      // 自定义请求头
      'content-type': 'application/json',
    };
    // 添加 token 请求头标识
    uni.getStorage({
      key: 'token',
      success: (token) => {
        options.header.Authorization = token.data;
      },
      fail: () => {
        console.log('未登录');
      },
    });
  },
};

uni.addInterceptor('request', httpInterceptor);

export type Data<T> = {
  // 后端返回的通用响应结构
  statusCode: string;
  msg: string;
  result: T;
};
// UniApp.RequestOptions为配置网络请求的选项
export const request = <T>(options: UniApp.RequestOptions) => {
  return new Promise<Data<T>>((resolve, reject) => {
    uni.request({
      // 拦截器配置内容
      ...options,
      success(res) {
        // 成功响应
        handleResponse(res, resolve, reject);
      },
      fail(err) {
        handleError(err, reject);
      },
    });
  });
};

// resolve和reject不返回任何值，但通知promise更改状态
const handleResponse = <T>(res: any, resolve: (value: Data<T>) => void, reject: (reason?: any) => void) => {
  // 处理请求成功的响应
  if (isSuccessStatusCode(res.statusCode)) {
    // 实际业务状态码
    if (isSuccessStatusCode(res.data.code)) {
      resolve(res.data as Data<T>);
      return;
    }
    if ([401, 402, 403].includes(res.data.code)) {
      handleClearUserInfo();
      reject(res);
      return;
    }
    showErrorToast(res.data as Data<T>);
    reject(res);
  } else if ([401, 403].includes(res.statusCode)) {
    handleClearUserInfo();
    reject(res);
  } else {
    showErrorToast(res.data as Data<T>);
    reject(res);
  }
};
/**请求是否成功 */
const isSuccessStatusCode = (statusCode: number) => {
  return statusCode >= 200 && statusCode < 300;
};

const showErrorToast = <T>(data: Data<T>) => {
  uni.showToast({
    icon: 'none',
    title: data.msg || '请求错误',
  });
};

/**处理请求错误 */
const handleError = (err: any, reject: (reason?: any) => void) => {
  // uni.showToast({
  //   icon: 'none',
  //   title: '网络可能开小差了~',
  // });
  reject(err);
};

/**处理清除用户信息并跳转登录 */
export const handleClearUserInfo = (showToast: boolean = true) => {
  uni.removeStorageSync('token');
  uni.removeStorageSync('userInfo');
  if (showToast) {
    uni.showToast({
      icon: 'none',
      title: '登录信息已过期，请重新登录',
      duration: 1500,
    });
  }
  setTimeout(
    () => {
      uni.reLaunch({ url: '/pages/login/login?isLogin=true' });
    },
    showToast ? 1500 : 0
  );
};

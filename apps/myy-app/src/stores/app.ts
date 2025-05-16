import { defineStore } from "pinia";
import Taro from "@tarojs/taro";

type UserInfo = {
  id: number;
  username: string;
};
export const useAppStore = defineStore("app", () => {
  const [route] = useRouter();
  const isLogin = ref(false);
  const userInfo = ref<UserInfo | null>();
  const userToken = ref("");
  const userId = ref(1);

  // 初始化时检查 quick 登录
  if (route.params.quick) {
    const quickLogin = async () => {
      try {
        const res = await Taro.request({
          url: getApiUrl("user/quick-login"),
          method: "POST",
          data: {
            token: route.params.token
          }
        });
        
        if (res.data.code === 0) {
          const { id, username } = res.data.data;
          userToken.value = route.params.token;
          userInfo.value = { id, username };
          userId.value = id;
          isLogin.value = true;
          Taro.navigateTo({ url: "/pages/me/index" });
        } else {
          Taro.showToast({ title: res.data.message || '快速登录失败', icon: 'none' });
        }
      } catch (error) {
        console.error('快速登录失败:', error);
        Taro.showToast({ title: '登录失败，请重试', icon: 'none' });
      }
    };
    
    quickLogin();
  }
  const loginByPassword = async (username: string, password: string) => {
    return new Promise<UserInfo>((resolve, reject) => {
      Taro.request({
        url: getApiUrl("login"),
        method: "POST",
        data: {
          user_name: username,
          password,
        },
        success: (res) => {
          if (res.data.code === 0) {
            const { userid, token } = res.data.data;
            userToken.value = token;
            userInfo.value = { id: userid };
            userId.value = userid;
            isLogin.value = true;
            useCourtyardStore().getDevices();
            resolve(userInfo.value);
          } else {
            reject(res.data);
          }
        },
        fail: (err) => {
          reject(err);
        },
      });
    });
  };

  const goToLogin = () => {
    if (isLogin.value) return;
    Taro.navigateTo({
      url: "/pages/me/login",
    });
  };
  return {
    isLogin,
    userInfo,
    userId,
    loginByPassword,
    goToLogin,
    userToken,
  };
});

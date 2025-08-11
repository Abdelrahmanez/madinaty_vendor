import { CommonActions } from "@react-navigation/native";

// استيراد مخزن المصادقة
import useAuthStore from "../stores/authStore";

let navigator;

function setNavigator(ref) {
  navigator = ref;
}

/**
 * التنقل إلى شاشة محددة
 * يتحقق من حالة المصادقة قبل السماح بالوصول إلى شاشات المصادقة
 * @param {string} name اسم الشاشة
 * @param {object} params معلمات التنقل
 */
function navigate(name, params) {
  if (navigator) {
    // لا يمكن استخدام hooks مباشرةً هنا لأننا خارج مكون وظيفي
    // لذلك نستخدم getState مباشرة من المخزن
    const authStore = useAuthStore.getState();
    
    // شاشات المصادقة
    const authScreens = ['Login', 'Signup', 'Welcome'];
    
    // إذا كان المستخدم مسجل دخوله ويحاول الوصول إلى شاشة مصادقة
    if (authStore.isAuthenticated && authScreens.includes(name)) {
      console.log('المستخدم مسجل دخول بالفعل. لا يمكن الوصول إلى شاشة المصادقة:', name);
      // إعادة توجيه المستخدم إلى الصفحة الرئيسية بدلاً من ذلك
      navigator.dispatch(
        CommonActions.navigate({
          name: 'Home',
          params,
        })
      );
      return;
    }
    
    // التنقل الطبيعي لكل الشاشات الأخرى
    navigator.dispatch(
      CommonActions.navigate({
        name,
        params,
      })
    );
  }
}

/**
 * إعادة تعيين مكدس التنقل
 * @param {object} params 
 * @param {string} name 
 */
function reset(params, name) {
  if (navigator) {
    navigator.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: params.name || name }],
      })
    );
  }
}

/**
 * الحصول على المسار الحالي
 * @returns {object} المسار الحالي
 */
function getCurrentRoute() {
  if (navigator) {
    return navigator.getCurrentRoute();
  }
  return null;
}

export default {
  reset,
  navigate,
  setNavigator,
  getCurrentRoute,
};

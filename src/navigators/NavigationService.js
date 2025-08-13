import { CommonActions } from "@react-navigation/native";

let navigator;

function setNavigator(ref) {
  navigator = ref;
}

function navigate(name, params) {
  if (navigator) {
    navigator.dispatch(
      CommonActions.navigate({
        name,
        params,
      })
    );
  }
}

function reset(params, name) {
  navigator.dispatch(
    CommonActions.reset({
      index: 0,
      routes: [{ name: params.name }],
    })
  );
}

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

import ListScreen from "./ListScreen.js";
import ProductScreen from "./ProductScreen.js";
import UserData from "./UserData.js";

UserData.loadData();
const listScreen = new ListScreen(onNextClick);
const productScreen = new ProductScreen(onBackClick);
listScreen.init();
productScreen.init();

listScreen.show();

function onNextClick() {
	listScreen.hide();
	productScreen.show(UserData.lists[listScreen.selectedListIdx]);
}

function onBackClick() {
	productScreen.hide();
	listScreen.show();
}
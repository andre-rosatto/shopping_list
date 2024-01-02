import ShoppingListItem, { ListItem } from "./utils.js"

const LOCAL_STORAGE = 'shopping-list-data';

export default class UserData {
	static shoppingItems: ShoppingListItem[] = [];

	static createListItem(): ListItem {
		return {
			name: '',
			price: 0,
			bought: false
		};
	}

	static createShoppingListItem(): ShoppingListItem {
		return {
			name: '27/12/2023',
			items: []
		};
	}

	static loadData() {
		this.shoppingItems = JSON.parse(localStorage.getItem(LOCAL_STORAGE)!) || [];
	}

	static saveData() {
		localStorage.setItem(LOCAL_STORAGE, JSON.stringify(this.shoppingItems));
	}
}
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
		const today = new Date();
		const date = today.getDate().toString().padStart(2, '0');
		const month = (today.getMonth() + 1).toString().padStart(2, '0');
		const year = today.getFullYear().toString();
		return {
			name: `${date}/${month}/${year}`,
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
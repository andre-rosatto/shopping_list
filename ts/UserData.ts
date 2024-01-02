import ShoppingListItem from "./utils.js"

const LOCAL_STORAGE = 'shopping-list-data';

export default class UserData {
	static shoppingItems: ShoppingListItem[] = [];

	constructor() {

	}

	static createShoppingListItem(): ShoppingListItem {
		const result: ShoppingListItem = {
			name: '27/12/2023',
			items: []
		};
		this.shoppingItems.unshift(result);
		return result
	}

	static loadData() {

	}

	static saveData() {

	}
}
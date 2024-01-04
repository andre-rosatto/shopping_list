import { List, Product } from "./utils.js"

const LOCAL_STORAGE = 'shopping-list-data';

export default class UserData {
	static lists: List[] = [];
	static copiedProducts: Product[] = [];

	static newProduct(): Product {
		return {
			name: '',
			price: 0,
			bought: false
		};
	}

	static newList(): List {
		const today = new Date();
		const date = today.getDate().toString().padStart(2, '0');
		const month = (today.getMonth() + 1).toString().padStart(2, '0');
		const year = today.getFullYear().toString();
		return {
			name: `${date}/${month}/${year}`,
			products: []
		};
	}

	static loadData() {
		this.lists = JSON.parse(localStorage.getItem(LOCAL_STORAGE)!) || [];
	}

	static saveData() {
		localStorage.setItem(LOCAL_STORAGE, JSON.stringify(this.lists));
	}
}
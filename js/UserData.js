const LOCAL_STORAGE = 'shopping-list-data';
export default class UserData {
    static shoppingItems = [];
    static createListItem() {
        return {
            name: '',
            price: 0,
            bought: false
        };
    }
    static createShoppingListItem() {
        return {
            name: '27/12/2023',
            items: []
        };
    }
    static loadData() {
        this.shoppingItems = JSON.parse(localStorage.getItem(LOCAL_STORAGE)) || [];
    }
    static saveData() {
        localStorage.setItem(LOCAL_STORAGE, JSON.stringify(this.shoppingItems));
    }
}

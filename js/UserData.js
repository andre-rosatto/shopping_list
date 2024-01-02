const LOCAL_STORAGE = 'shopping-list-data';
export default class UserData {
    static shoppingItems = [];
    constructor() {
    }
    static createShoppingListItem() {
        const result = {
            name: '27/12/2023',
            items: []
        };
        this.shoppingItems.unshift(result);
        return result;
    }
    static loadData() {
    }
    static saveData() {
    }
}

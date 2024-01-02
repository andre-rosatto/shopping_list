import UserData from "./UserData.js";
import ShoppingListItem, { formatCurrency } from "./utils.js";


(document.querySelector('#btn-add') as HTMLButtonElement).addEventListener('click', onAddClick);
const ul = document.querySelector('ul')!;

UserData.loadData();
UserData.shoppingItems.forEach(item => {
	addItem(item, false);
});


function onAddClick() {
	const newItem = UserData.createShoppingListItem();
	addItem(newItem, true);
	UserData.shoppingItems.unshift(newItem);
	UserData.saveData();
}

function onItemFocus(e: FocusEvent) {
	(e.target as HTMLInputElement).select();
}

function onItemBlur(li: HTMLLIElement) {
	const idx = Array.from(ul.children).indexOf(li);
	UserData.shoppingItems[idx].name = li.querySelector('input')!.value;
	UserData.saveData();
}

function onNextClick(li: HTMLLIElement) {
	const idx = Array.from(ul.children).indexOf(li);
	window.location.href = `./shopping_list.html?idx=${idx}`;
}

function onDeleteClick(li: HTMLLIElement) {
	const idx = Array.from(ul.children).indexOf(li);
	UserData.shoppingItems.splice(idx, 1);
	li.remove();
	UserData.saveData();
}

function addItem(item: ShoppingListItem, putBefore: boolean) {
	const li = document.createElement('li');
	li.innerHTML = createHTML(item);

	const input = li.querySelector('input')!;
	input.addEventListener('focus', (event: FocusEvent) => onItemFocus(event));
	input.addEventListener('blur', () => onItemBlur(li));

	(li.querySelector('.btn-next') as HTMLButtonElement).addEventListener('click', () => onNextClick(li));
	(li.querySelector('.btn-delete') as HTMLButtonElement).addEventListener('click', () => onDeleteClick(li));
	if (putBefore) {
		ul.insertBefore(li, ul.firstChild);
	} else {
		ul.appendChild(li);
	}
}

function getTotal(item: ShoppingListItem) {
	return item.items.reduce((acc: number, item) => acc + item.price, 0);
}

function getItemsBought(item: ShoppingListItem): number {
	return item.items.filter(item => item.bought).length;
}

function createHTML(item: ShoppingListItem): string {
	return `
		<button class="btn-next"></button>
		<div class="info-wrapper">
			<div class="main-info-wrapper">
				<input type="text" value="${item.name}">
				<p class="total">${formatCurrency(getTotal(item))}</p>
			</div>
			<div class="shopping-info-wrapper">
				<p>Número de itens: <span class="total-itens">${item.items.length}</span></p>
				<p>Itens adquiridos: <span class="bought-items">${getItemsBought(item)} / ${item.items.length}</span></p>
			</div>
		</div>
		<button class="btn-delete"></button>
	`;
}
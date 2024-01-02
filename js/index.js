import UserData from "./UserData.js";
import { formatCurrency } from "./utils.js";
document.querySelector('#btn-add').addEventListener('click', onAddClick);
const ul = document.querySelector('ul');
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
function onItemFocus(e) {
    e.target.select();
}
function onItemBlur(li) {
    const idx = Array.from(ul.children).indexOf(li);
    UserData.shoppingItems[idx].name = li.querySelector('input').value;
    UserData.saveData();
}
function onNextClick(li) {
    const idx = Array.from(ul.children).indexOf(li);
    window.location.href = `./shopping_list.html?idx=${idx}`;
}
function onDeleteClick(li) {
    const idx = Array.from(ul.children).indexOf(li);
    UserData.shoppingItems.splice(idx, 1);
    li.remove();
    UserData.saveData();
}
function addItem(item, putBefore) {
    const li = document.createElement('li');
    li.innerHTML = createHTML(item);
    const input = li.querySelector('input');
    input.addEventListener('focus', (event) => onItemFocus(event));
    input.addEventListener('blur', () => onItemBlur(li));
    li.querySelector('.btn-next').addEventListener('click', () => onNextClick(li));
    li.querySelector('.btn-delete').addEventListener('click', () => onDeleteClick(li));
    if (putBefore) {
        ul.insertBefore(li, ul.firstChild);
    }
    else {
        ul.appendChild(li);
    }
}
function getTotal(item) {
    return item.items.reduce((acc, item) => acc + item.price, 0);
}
function getItemsBought(item) {
    return item.items.filter(item => item.bought).length;
}
function createHTML(item) {
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

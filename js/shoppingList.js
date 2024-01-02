import UserData from "./UserData.js";
import { formatCurrency } from "./utils.js";
const param = (new URLSearchParams(window.location.search)).get('idx');
if (!param) {
    window.location.href = './';
}
const shoppingListIdx = parseInt(param);
const ul = document.querySelector('ul');
UserData.loadData();
document.querySelector('header h2').innerHTML = UserData.shoppingItems[shoppingListIdx].name;
document.querySelector('#btn-add').addEventListener('click', onAddClick);
UserData.shoppingItems[shoppingListIdx].items.forEach(item => {
    addItem(item, false);
});
updateItemCount();
updateTotal();
function onAddClick() {
    const newItem = UserData.createListItem();
    UserData.shoppingItems[shoppingListIdx].items.unshift(newItem);
    addItem(newItem, true);
    updateItemCount();
    updateTotal();
}
function onCheckboxClick(li) {
    li.classList.toggle('checked');
    const itemIdx = Array.from(ul.children).indexOf(li);
    UserData.shoppingItems[shoppingListIdx].items[itemIdx].bought = li.classList.contains('checked');
    UserData.saveData();
}
function onNameBlur(target, li) {
    const itemIdx = Array.from(ul.children).indexOf(li);
    UserData.shoppingItems[shoppingListIdx].items[itemIdx].name = target.value;
    UserData.saveData();
}
function onDeleteClick(li) {
    const itemIdx = Array.from(ul.children).indexOf(li);
    UserData.shoppingItems[shoppingListIdx].items.splice(itemIdx, 1);
    li.remove();
    updateItemCount();
    updateTotal();
    UserData.saveData();
}
function addItem(item, putBefore) {
    const li = document.createElement('li');
    li.innerHTML = createHTML();
    const checkbox = li.querySelector('.checkbox');
    li.className = item.bought ? "checked" : "";
    checkbox.addEventListener('click', () => onCheckboxClick(li));
    const nameInput = li.querySelector('input[type=text]');
    nameInput.value = item.name;
    nameInput.addEventListener('blur', (event) => onNameBlur(event.target, li));
    li.querySelector('.btn-delete').addEventListener('click', () => { onDeleteClick(li); });
    if (putBefore) {
        ul.insertBefore(li, ul.firstChild);
    }
    else {
        ul.appendChild(li);
    }
}
function createHTML() {
    return `
		<div class="checkbox"></div>
		<input type="text" value="">
		<input type="tel" value="R$ 0,00">
		<button class="btn-delete"></button>
	`;
}
function updateItemCount() {
    document.querySelector('#item-count').innerText = UserData.shoppingItems[shoppingListIdx].items.length.toString();
}
function updateTotal() {
    const total = UserData.shoppingItems[shoppingListIdx].items.reduce((acc, item) => acc + item.price, 0);
    document.querySelector('#total-value').innerText = formatCurrency(total);
}

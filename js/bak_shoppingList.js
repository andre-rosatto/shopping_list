"use strict";
/*
import UserData from "./UserData.js";
import { Product, formatCurrency } from "./utils.js";

const SESSION_STORAGE = 'shopping-list-copied-items';

const param = (new URLSearchParams(window.location.search)).get('idx');
if (!param) {
    window.location.href = './';
}
const shoppingListIdx = parseInt(param!);

const ul = document.querySelector('ul')!;

let copiedItems: Product[] = [];
const data = sessionStorage.getItem(SESSION_STORAGE);
if (data) {
    copiedItems = JSON.parse(data);
}

UserData.loadData();
document.querySelector('header h2')!.innerHTML = UserData.lists[shoppingListIdx].name;
document.querySelector('header button')!.addEventListener('click', onBackClick);
(document.querySelector('#btn-add') as HTMLButtonElement).addEventListener('click', onAddClick);
UserData.lists[shoppingListIdx].products.forEach(item => {
    addItem(item, false);
});
(document.querySelector('#btn-copy-unbought') as HTMLButtonElement).addEventListener('click', onCopyUnboughtClick);
(document.querySelector('#btn-copy-all') as HTMLButtonElement).addEventListener('click', onCopyAllClick);
(document.querySelector('#btn-paste') as HTMLButtonElement).addEventListener('click', onPasteClick);

updateItemCount();
updateTotal();
updateFooter();

function onBackClick() {
    sessionStorage.setItem(SESSION_STORAGE, JSON.stringify(copiedItems));
    window.location.href = `./`;
}

function onAddClick() {
    const newItem = UserData.createListItem();
    UserData.lists[shoppingListIdx].products.unshift(newItem);
    UserData.saveData();
    addItem(newItem, true);
    ((ul.firstChild as HTMLLIElement).querySelector('input[type=text]') as HTMLInputElement).focus();
    updateItemCount();
    updateTotal();
    updateFooter();
}

function onCheckboxClick(li: HTMLLIElement) {
    li.classList.toggle('checked');
    const itemIdx = Array.from(ul.children).indexOf(li);
    UserData.lists[shoppingListIdx].products[itemIdx].bought = li.classList.contains('checked');
    updateFooter();
    UserData.saveData();
}

function onNameBlur(target: HTMLInputElement, li: HTMLLIElement) {
    const itemIdx = Array.from(ul.children).indexOf(li);
    UserData.lists[shoppingListIdx].products[itemIdx].name = target.value;
    UserData.saveData();
}

function onPriceFocus(target: HTMLInputElement) {
    setTimeout(() => {
        target.selectionStart = target.value.length;
    }, 10);
}

function onPriceInput(target: HTMLInputElement, li: HTMLLIElement) {
    const itemIdx = Array.from(ul.children).indexOf(li);
    const rawValue = getRawValue(target.value);
    target.value = formatCurrency(rawValue);
    UserData.lists[shoppingListIdx].products[itemIdx].price = rawValue;
    updateTotal();
}

function onPriceBlur() {
    UserData.saveData();
}

function onDeleteClick(li: HTMLLIElement) {
    const itemIdx = Array.from(ul.children).indexOf(li);
    UserData.lists[shoppingListIdx].products.splice(itemIdx, 1);
    li.remove();
    updateItemCount();
    updateTotal();
    updateFooter();
    UserData.saveData();
}

function onCopyUnboughtClick() {
    copiedItems = UserData.lists[shoppingListIdx].products.filter(item => !item.bought);
    updateFooter();
}

function onCopyAllClick() {
    copiedItems = [...UserData.lists[shoppingListIdx].products];
    updateFooter();
}

function onPasteClick() {
    for (let i = copiedItems.length - 1; i >= 0; i--) {
        const newItem = copiedItems[i];
        newItem.bought = false;
        addItem(newItem, true);
        UserData.lists[shoppingListIdx].products.unshift(newItem);
    }
    UserData.saveData();
    updateFooter();
}

function getRawValue(value: string): number {
    const strRawValue = (String(value).match(/[0-9]+/g) ?? ['0']).join('');
    const result = parseInt(strRawValue) / 100;
    return result;
}

function addItem(item: Product, putBefore: boolean) {
    const li = document.createElement('li');
    li.innerHTML = createHTML();

    const checkbox = li.querySelector('.checkbox') as HTMLDivElement;
    li.className = item.bought ? "checked" : "";
    checkbox.addEventListener('click', () => onCheckboxClick(li));

    const nameInput = li.querySelector('input[type=text]') as HTMLInputElement;
    nameInput.value = item.name;
    nameInput.addEventListener('blur', (event: FocusEvent) => onNameBlur((event.target as HTMLInputElement), li));

    (li.querySelector('input[type=tel]') as HTMLInputElement).value = formatCurrency(item.price);

    (li.querySelector('.btn-delete') as HTMLButtonElement).addEventListener('click', () => { onDeleteClick(li) });

    const priceInput = li.querySelector('input[type=tel]') as HTMLInputElement;
    priceInput.addEventListener('focus', (event: FocusEvent) => onPriceFocus(event.target as HTMLInputElement));
    priceInput.addEventListener('input', (event: Event) => onPriceInput(event.target as HTMLInputElement, li));
    priceInput.addEventListener('blur', onPriceBlur);

    if (putBefore) {
        ul.insertBefore(li, ul.firstChild);
    } else {
        ul.appendChild(li);
    }
}

function createHTML() {
    return `
        <div class="checkbox"></div>
        <input type="text" value="">
        <input type="tel" value="">
        <button class="btn-delete"></button>
    `;
}

function updateItemCount() {
    (document.querySelector('#item-count') as HTMLSpanElement).innerText = UserData.lists[shoppingListIdx].products.length.toString();
}

function updateTotal() {
    const total = UserData.lists[shoppingListIdx].products.reduce((acc: number, item) => acc + item.price, 0);
    (document.querySelector('#total-value') as HTMLSpanElement).innerText = formatCurrency(total);
}

function updateFooter() {
    (document.querySelector('#btn-copy-unbought') as HTMLButtonElement).disabled = UserData.lists[shoppingListIdx].products.find(item => !item.bought) === undefined;
    (document.querySelector('#btn-copy-all') as HTMLButtonElement).disabled = UserData.lists[shoppingListIdx].products.length === 0;
    const pasteBtn = document.querySelector('#btn-paste') as HTMLButtonElement;
    pasteBtn.disabled = copiedItems.length === 0;
    pasteBtn.querySelector('span')!.innerText = copiedItems.length.toString();
}
*/ 

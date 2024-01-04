import UserData from "./UserData.js";
import formatCurrency from "./utils.js";
export default class ListScreen {
    nextHandler;
    selectedListIdx = -1;
    constructor(nextHandler) {
        this.nextHandler = nextHandler;
        this.createHTML();
    }
    createHTML() {
        const parent = document.querySelector('#app-wrapper');
        parent.innerHTML += `
			<div id="list-screen" class="screen hidden">
				<header>
					<h2>Listas de compras</h2>
				</header>
				<button class="btn-add">
					<img src="./assets/images/add.svg" alt="adicionar nova lista de compras">
				</button>
				<ul>
				</ul>
			</div>
		`;
    }
    init() {
        document.querySelector('#list-screen .btn-add').addEventListener('click', () => this.onAddClick());
    }
    getRoot() {
        return document.querySelector('#list-screen');
    }
    getUl() {
        return this.getRoot().querySelector('ul');
    }
    show() {
        this.selectedListIdx = -1;
        this.getRoot().classList.remove('hidden');
        this.makeList();
    }
    hide() {
        this.getRoot().classList.add('hidden');
    }
    makeList() {
        this.getUl().innerHTML = '';
        UserData.lists.forEach(list => {
            const li = this.newLi(list);
            this.getUl().appendChild(li);
            this.hookEvents(li);
        });
    }
    newLi(list) {
        const result = document.createElement('li');
        result.innerHTML += `
			<button class="btn-next"></button>
			<div class="info-wrapper">
				<div class="main-info-wrapper">
					<input type="text" value="${list.name}">
					<p class="total">${formatCurrency(this.getTotal(list))}</p>
				</div>
				<div class="shopping-info-wrapper">
					<p>Número de itens: <span class="total-itens">${list.products.length}</span></p>
					<p>Itens adquiridos: <span class="bought-items">${this.getItemsBought(list)} / ${list.products.length}</span></p>
				</div>
			</div>
			<button class="btn-delete"></button>
		`;
        return result;
    }
    hookEvents(li) {
        li.querySelector('.btn-delete').addEventListener('click', () => { this.onDeleteClick(li); });
        li.querySelector('.btn-next').addEventListener('click', () => { this.onNextClick(li); });
        const input = li.querySelector('input');
        input.addEventListener('focus', (e) => this.onInputFocus(e));
        input.addEventListener('blur', () => this.onInputBlur(li));
    }
    getTotal(list) {
        return list.products.reduce((acc, product) => acc + product.price, 0);
    }
    getItemsBought(list) {
        return list.products.filter(product => product.bought).length;
    }
    onAddClick() {
        const newItem = UserData.newList();
        const li = this.newLi(newItem);
        const ul = this.getUl();
        this.hookEvents(li);
        if (ul.children.length > 0) {
            ul.insertBefore(li, ul.children[0]);
        }
        else {
            ul.appendChild(li);
        }
        UserData.lists.unshift(newItem);
        UserData.saveData();
    }
    onInputFocus(e) {
        e.target.select();
    }
    onInputBlur(li) {
        const idx = Array.from(this.getUl().children).indexOf(li);
        UserData.lists[idx].name = li.querySelector('input').value;
        UserData.saveData();
    }
    onNextClick(li) {
        this.selectedListIdx = Array.from(this.getUl().children).indexOf(li);
        this.nextHandler();
    }
    onDeleteClick(li) {
        const idx = Array.from(this.getUl().children).indexOf(li);
        UserData.lists.splice(idx, 1);
        li.remove();
        UserData.saveData();
    }
}

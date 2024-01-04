import UserData from "./UserData.js";
import formatCurrency, { List } from "./utils.js";

export default class ListScreen {
	public selectedListIdx = -1;
	constructor(
		private nextHandler: () => void
	) {
		this.createHTML();
	}

	createHTML() {
		const parent = document.querySelector('#app-wrapper') as HTMLDivElement;
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
		(document.querySelector('#list-screen .btn-add') as HTMLButtonElement).addEventListener('click', () => this.onAddClick())
	}

	getRoot(): HTMLDivElement {
		return document.querySelector('#list-screen') as HTMLDivElement;
	}

	getUl(): HTMLUListElement {
		return this.getRoot().querySelector('ul') as HTMLUListElement;
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

	newLi(list: List): HTMLLIElement {
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

	hookEvents(li: HTMLLIElement) {
		(li.querySelector('.btn-delete') as HTMLButtonElement).addEventListener('click', () => { this.onDeleteClick(li) });
		(li.querySelector('.btn-next') as HTMLButtonElement).addEventListener('click', () => { this.onNextClick(li) });
		const input = li.querySelector('input') as HTMLInputElement;
		input.addEventListener('focus', (e: FocusEvent) => this.onInputFocus(e));
		input.addEventListener('blur', () => this.onInputBlur(li));
	}

	getTotal(list: List): number {
		return list.products.reduce((acc: number, product) => acc + product.price, 0);
	}

	getItemsBought(list: List): number {
		return list.products.filter(product => product.bought).length;
	}

	onAddClick() {
		const newItem = UserData.newList();
		const li = this.newLi(newItem);
		const ul = this.getUl();
		this.hookEvents(li);
		if (ul.children.length > 0) {
			ul.insertBefore(li, ul.children[0]);
		} else {
			ul.appendChild(li);
		}
		UserData.lists.unshift(newItem);
		UserData.saveData();
	}

	onInputFocus(e: FocusEvent) {
		(e.target as HTMLInputElement).select();
	}

	onInputBlur(li: HTMLLIElement) {
		const idx = Array.from(this.getUl().children).indexOf(li);
		UserData.lists[idx].name = li.querySelector('input')!.value;
		UserData.saveData();
	}

	onNextClick(li: HTMLLIElement) {
		this.selectedListIdx = Array.from(this.getUl().children).indexOf(li);
		this.nextHandler();
	}

	onDeleteClick(li: HTMLLIElement) {
		const idx = Array.from(this.getUl().children).indexOf(li);
		UserData.lists.splice(idx, 1);
		li.remove();
		UserData.saveData();
	}
}
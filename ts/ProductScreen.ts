import UserData from "./UserData.js";
import formatCurrency, { List, Product } from "./utils.js";

export default class ProductScreen {
	private list: List | null = null;
	constructor(
		private backHandler: () => void
	) {
		this.createHTML();
	}

	createHTML() {
		const parent = document.querySelector('#app-wrapper') as HTMLDivElement;
		parent.innerHTML += `
			<div id="product-screen" class="screen hidden">
				<header>
					<button></button>
					<div id="header-wrapper">
						<h2></h2>
						<div id="header-info-wrapper">
							<p>Número de itens: <span id="item-count"></span></p>
							<p>Valor total: <span id="total-value"></span></p>
						</div>
					</div>
				</header>
				<button class="btn-add">
					<img src="./assets/images/add.svg" alt="adicionar item à lista">
				</button>
				<ul>
				</ul>
				<footer>
					<button id="btn-copy-unbought">Copiar itens não comprados</button>
					<button id="btn-copy-all">Copiar todos os itens</button>
					<button id="btn-paste">Colar itens (<span>0</span>)</button>
				</footer>
			</div>
		`;
	}

	init() {
		(document.querySelector('#product-screen .btn-add') as HTMLButtonElement).addEventListener('click', () => this.onAddClick());
		(document.querySelector('#product-screen header button') as HTMLButtonElement).addEventListener('click', () => this.onBackClick());
		(document.querySelector('#btn-copy-unbought') as HTMLButtonElement).addEventListener('click', () => this.onCopyUnboughtClick());
		(document.querySelector('#btn-copy-all') as HTMLButtonElement).addEventListener('click', () => this.onCopyAllClick());
		(document.querySelector('#btn-paste') as HTMLButtonElement).addEventListener('click', () => this.onPasteClick());
	}

	getRoot(): HTMLDivElement {
		return document.querySelector('#product-screen') as HTMLDivElement;
	}

	getUl(): HTMLUListElement {
		return this.getRoot().querySelector('ul') as HTMLUListElement;
	}

	show(list: List) {
		this.getUl().innerHTML = '';
		this.list = list;
		const root = this.getRoot();
		root.classList.remove('hidden');
		(root.querySelector('header h2') as HTMLHeadingElement).innerText = list.name;
		this.makeList();
		this.updateHeader();
		this.updateToolbar();
	}

	hide() {
		this.getRoot().classList.add('hidden');
	}

	makeList() {
		this.list!.products.forEach(product => {
			const li = this.newLi(product)
			this.getUl().appendChild(li);
			this.hookEvents(li);
		});
	}

	newLi(product: Product) {
		const result = document.createElement('li');
		if (product.bought) {
			result.classList.add('checked');
		}
		result.innerHTML = `
			<div class="checkbox"></div>
			<input type="text" value="${product.name}">
			<input type="tel" value="${formatCurrency(product.price)}">
			<button class="btn-delete"></button>
		`;
		return result;
	}

	addLi(li: HTMLLIElement, product: Product) {
		const ul = this.getUl();
		this.hookEvents(li);
		if (ul.children.length > 0) {
			ul.insertBefore(li, ul.children[0]);
		} else {
			ul.appendChild(li);
		}
		this.list!.products.unshift(product);
	}

	hookEvents(li: HTMLLIElement) {
		(li.querySelector('.checkbox') as HTMLDivElement).addEventListener('click', () => this.onCheckboxClick(li));
		(li.querySelector('input[type=text]') as HTMLInputElement).addEventListener('blur', (e: FocusEvent) => this.onNameBlur(e.target as HTMLInputElement, li));
		const priceInput = li.querySelector('input[type=tel]') as HTMLInputElement;
		priceInput.addEventListener('focus', (e: FocusEvent) => this.onPriceFocus(e.target as HTMLInputElement));
		priceInput.addEventListener('input', (e: Event) => this.onPriceChange(e.target as HTMLInputElement, li));
		priceInput.addEventListener('blur', () => UserData.saveData());
		(li.querySelector('.btn-delete') as HTMLButtonElement).addEventListener('click', () => this.onDeleteClick(li));
	}

	updateHeader() {
		const root = this.getRoot();
		(root.querySelector('#item-count') as HTMLSpanElement).innerText = this.list!.products.length.toString();
		const total = this.list!.products.reduce((acc: number, product) => acc + product.price, 0);
		(document.querySelector('#total-value') as HTMLSpanElement).innerText = formatCurrency(total);
	}

	updateToolbar() {
		(document.querySelector('#btn-copy-unbought') as HTMLButtonElement).disabled = this.list!.products.find(product => !product.bought) === undefined;
		(document.querySelector('#btn-copy-all') as HTMLButtonElement).disabled = this.list!.products.length === 0;
		const pasteBtn = document.querySelector('#btn-paste') as HTMLButtonElement
		pasteBtn.disabled = UserData.copiedProducts.length === 0;
		pasteBtn.querySelector('span')!.innerText = UserData.copiedProducts.length.toString();
	}

	getRawValue(value: string): number {
		const strRawValue = (String(value).match(/[0-9]+/g) ?? ['0']).join('');
		const result = parseInt(strRawValue) / 100;
		return result;
	}

	onBackClick() {
		this.backHandler();
	}

	onAddClick() {
		const product = UserData.newProduct();
		const li = this.newLi(product);
		this.addLi(li, product);
		UserData.saveData();
		(li.querySelector('input[type=text]') as HTMLInputElement).focus();
	}

	onCheckboxClick(li: HTMLLIElement) {
		li.classList.toggle('checked');
		const itemIdx = Array.from(this.getUl().children).indexOf(li);
		this.list!.products[itemIdx].bought = li.classList.contains('checked');
		UserData.saveData();
		this.updateToolbar();
	}

	onNameBlur(target: HTMLInputElement, li: HTMLLIElement) {
		const itemIdx = Array.from(this.getUl().children).indexOf(li);
		this.list!.products[itemIdx].name = target.value;
		UserData.saveData();
	}

	onPriceFocus(target: HTMLInputElement) {
		setTimeout(() => {
			target.selectionStart = target.value.length;
		}, 10);
	}

	onPriceChange(target: HTMLInputElement, li: HTMLLIElement) {
		const itemIdx = Array.from(this.getUl().children).indexOf(li);
		const rawValue = this.getRawValue(target.value);
		this.list!.products[itemIdx].price = rawValue;
		target.value = formatCurrency(rawValue);
		this.updateHeader();
	}

	onDeleteClick(li: HTMLLIElement) {
		const itemIdx = Array.from(this.getUl().children).indexOf(li);
		this.list!.products.splice(itemIdx, 1);
		li.remove();
		this.updateHeader();
		UserData.saveData();
	}

	onCopyUnboughtClick() {
		UserData.copiedProducts = this.list!.products.filter(product => !product.bought);
		this.updateToolbar();
	}

	onCopyAllClick() {
		UserData.copiedProducts = this.list!.products.map(product => {
			return {
				name: product.name,
				price: product.price,
				bought: false
			};
		});
		this.updateToolbar();
	}

	onPasteClick() {
		[...UserData.copiedProducts].reverse().forEach(product => {
			const li = this.newLi(product);
			this.addLi(li, product);
		});
		this.updateHeader();
		UserData.saveData();
	}
}
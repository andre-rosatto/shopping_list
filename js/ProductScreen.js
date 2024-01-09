import UserData from "./UserData.js";
import formatCurrency from "./utils.js";
export default class ProductScreen {
    backHandler;
    list = null;
    constructor(backHandler) {
        this.backHandler = backHandler;
        this.createHTML();
    }
    createHTML() {
        const parent = document.querySelector('#app-wrapper');
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
        document.querySelector('#product-screen .btn-add').addEventListener('click', () => this.onAddClick());
        document.querySelector('#product-screen header button').addEventListener('click', () => this.onBackClick());
        document.querySelector('#btn-copy-unbought').addEventListener('click', () => this.onCopyUnboughtClick());
        document.querySelector('#btn-copy-all').addEventListener('click', () => this.onCopyAllClick());
        document.querySelector('#btn-paste').addEventListener('click', () => this.onPasteClick());
    }
    getRoot() {
        return document.querySelector('#product-screen');
    }
    getUl() {
        return this.getRoot().querySelector('ul');
    }
    show(list) {
        this.getUl().innerHTML = '';
        this.list = list;
        const root = this.getRoot();
        root.classList.remove('hidden');
        root.querySelector('header h2').innerText = list.name;
        this.makeList();
        this.updateHeader();
        this.updateToolbar();
    }
    hide() {
        this.getRoot().classList.add('hidden');
    }
    makeList() {
        this.list.products.forEach(product => {
            const li = this.newLi(product);
            this.getUl().appendChild(li);
            this.hookEvents(li);
        });
    }
    newLi(product) {
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
    addLi(li, product) {
        const ul = this.getUl();
        this.hookEvents(li);
        if (ul.children.length > 0) {
            ul.insertBefore(li, ul.children[0]);
        }
        else {
            ul.appendChild(li);
        }
        this.list.products.unshift(product);
    }
    hookEvents(li) {
        li.querySelector('.checkbox').addEventListener('click', () => this.onCheckboxClick(li));
        li.querySelector('input[type=text]').addEventListener('blur', (e) => this.onNameBlur(e.target, li));
        const priceInput = li.querySelector('input[type=tel]');
        priceInput.addEventListener('focus', (e) => this.onPriceFocus(e.target));
        priceInput.addEventListener('input', (e) => this.onPriceChange(e.target, li));
        priceInput.addEventListener('blur', () => UserData.saveData());
        li.querySelector('.btn-delete').addEventListener('click', () => this.onDeleteClick(li));
    }
    updateHeader() {
        const root = this.getRoot();
        root.querySelector('#item-count').innerText = this.list.products.length.toString();
        const total = this.list.products.reduce((acc, product) => acc + product.price, 0);
        document.querySelector('#total-value').innerText = formatCurrency(total);
    }
    updateToolbar() {
        document.querySelector('#btn-copy-unbought').disabled = this.list.products.find(product => !product.bought) === undefined;
        document.querySelector('#btn-copy-all').disabled = this.list.products.length === 0;
        const pasteBtn = document.querySelector('#btn-paste');
        pasteBtn.disabled = UserData.copiedProducts.length === 0;
        pasteBtn.querySelector('span').innerText = UserData.copiedProducts.length.toString();
    }
    getRawValue(value) {
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
        this.updateToolbar();
        li.querySelector('input[type=text]').focus();
    }
    onCheckboxClick(li) {
        li.classList.toggle('checked');
        const itemIdx = Array.from(this.getUl().children).indexOf(li);
        this.list.products[itemIdx].bought = li.classList.contains('checked');
        UserData.saveData();
        this.updateToolbar();
    }
    onNameBlur(target, li) {
        const itemIdx = Array.from(this.getUl().children).indexOf(li);
        this.list.products[itemIdx].name = target.value;
        UserData.saveData();
    }
    onPriceFocus(target) {
        setTimeout(() => {
            target.selectionStart = target.value.length;
        }, 10);
    }
    onPriceChange(target, li) {
        const itemIdx = Array.from(this.getUl().children).indexOf(li);
        const rawValue = this.getRawValue(target.value);
        this.list.products[itemIdx].price = rawValue;
        target.value = formatCurrency(rawValue);
        this.updateHeader();
    }
    onDeleteClick(li) {
        const itemIdx = Array.from(this.getUl().children).indexOf(li);
        this.list.products.splice(itemIdx, 1);
        li.remove();
        this.updateHeader();
        this.updateToolbar();
        UserData.saveData();
    }
    onCopyUnboughtClick() {
        UserData.copiedProducts = this.list.products.filter(product => !product.bought);
        this.updateToolbar();
    }
    onCopyAllClick() {
        UserData.copiedProducts = this.list.products.map(product => {
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

export interface Product {
	name: string,
	price: number,
	bought: boolean
};

export interface List {
	name: string,
	products: Product[]
};

export default function formatCurrency(value: number) {
	return new Intl.NumberFormat(
		'pt-BR',
		{
			style: 'currency',
			currency: 'BRL'
		}
	).format(value);
};
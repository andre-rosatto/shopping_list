interface ListItem {
	name: string,
	price: number,
	bought: boolean
};

export default interface ShoppingListItem {
	name: string,
	items: ListItem[]
};

export function formatCurrency(value: number) {
	return new Intl.NumberFormat(
		'pt-BR',
		{
			style: 'currency',
			currency: 'BRL'
		}
	).format(value);
}
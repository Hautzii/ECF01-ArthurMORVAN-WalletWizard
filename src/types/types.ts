export interface Transaction {
    amount: number;
    description: string;
    type: 'expense' | 'income';
    date: Date
}
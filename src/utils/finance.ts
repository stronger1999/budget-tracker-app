import { Transaction } from '../types';

export const totals = (items: Transaction[]) => {
  const income = items.filter((i) => i.type === 'income').reduce((s, i) => s + i.amount, 0);
  const expenses = items.filter((i) => i.type === 'expense').reduce((s, i) => s + i.amount, 0);
  return { income, expenses, balance: income - expenses };
};

export const byCategory = (items: Transaction[]) =>
  Object.values(
    items
      .filter((i) => i.type === 'expense')
      .reduce<Record<string, { category: string; amount: number }>>((acc, t) => {
        acc[t.category] ??= { category: t.category, amount: 0 };
        acc[t.category].amount += t.amount;
        return acc;
      }, {})
  );

export const cashFlowPie = (items: Transaction[]) => {
  const t = totals(items);
  return [
    { name: 'Income', value: t.income },
    { name: 'Expenses', value: t.expenses },
  ].filter((item) => item.value > 0);
};

export const balanceTimeline = (items: Transaction[]) => {
  const sorted = [...items].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  let balance = 0;
  return sorted.map((t) => {
    balance += t.type === 'income' ? t.amount : -t.amount;
    return {
      date: new Date(t.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }),
      balance,
      change: t.type === 'income' ? t.amount : -t.amount,
    };
  });
};

export const formatPLN = (value: number) =>
  new Intl.NumberFormat('pl-PL', { style: 'currency', currency: 'PLN' }).format(value);

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Transaction } from '../../types';
import { load, save } from '../../app/storage';

const demoUserKey = 'demo@budget.app';

const seed: Transaction[] = [
  { id: '1', title: 'Salary', amount: 2900, type: 'income', category: 'salary', date: '2026-05-01' },
  { id: '2', title: 'Rent', amount: 950, type: 'expense', category: 'housing', date: '2026-05-02' },
  { id: '3', title: 'Groceries', amount: 170, type: 'expense', category: 'food', date: '2026-05-03' },
  { id: '4', title: 'Bus ticket', amount: 20, type: 'expense', category: 'transport', date: '2026-05-04' },
];

type State = {
  byUser: Record<string, Transaction[]>;
};

type LegacyState = State | { items: Transaction[] };

const normalizeUserKey = (userKey: string) => userKey.trim().toLowerCase();

const loadInitialState = (): State => {
  const loaded = load<LegacyState>('bt_transactions', { byUser: { [demoUserKey]: seed } });

  if ('byUser' in loaded) {
    return {
      byUser: {
        [demoUserKey]: seed,
        ...loaded.byUser,
      },
    };
  }

  // Migration from the older global storage format.
  return {
    byUser: {
      [demoUserKey]: loaded.items?.length ? loaded.items : seed,
    },
  };
};

const initialState: State = loadInitialState();
const persist = (state: State) => save('bt_transactions', state);

const ensureUserBucket = (state: State, userKey: string) => {
  const key = normalizeUserKey(userKey);
  state.byUser[key] ??= [];
  return key;
};

const slice = createSlice({
  name: 'transactions',
  initialState,
  reducers: {
    addTransaction: (state, action: PayloadAction<{ userKey: string; transaction: Omit<Transaction, 'id'> }>) => {
      const key = ensureUserBucket(state, action.payload.userKey);
      state.byUser[key].unshift({ id: crypto.randomUUID(), ...action.payload.transaction });
      persist(state);
    },
    updateTransaction: (state, action: PayloadAction<{ userKey: string; transaction: Transaction }>) => {
      const key = ensureUserBucket(state, action.payload.userKey);
      const index = state.byUser[key].findIndex((transaction) => transaction.id === action.payload.transaction.id);
      if (index >= 0) state.byUser[key][index] = action.payload.transaction;
      persist(state);
    },
    deleteTransaction: (state, action: PayloadAction<{ userKey: string; id: string }>) => {
      const key = ensureUserBucket(state, action.payload.userKey);
      state.byUser[key] = state.byUser[key].filter((transaction) => transaction.id !== action.payload.id);
      persist(state);
    },
    clearTransactionsForUser: (state, action: PayloadAction<string>) => {
      const key = ensureUserBucket(state, action.payload);
      state.byUser[key] = [];
      persist(state);
    },
  },
});

export const { addTransaction, updateTransaction, deleteTransaction, clearTransactionsForUser } = slice.actions;
export const getTransactionsForUser = (state: State, userKey?: string | null) =>
  userKey ? state.byUser[normalizeUserKey(userKey)] ?? [] : [];
export default slice.reducer;

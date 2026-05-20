export type TransactionType='income'|'expense';export type Category='salary'|'food'|'transport'|'housing'|'shopping'|'education'|'health'|'other';
export interface Transaction{ id:string; title:string; amount:number; type:TransactionType; category:Category; date:string; note?:string }
export interface User{ id:string; name:string; email:string; password:string }

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import Card from '../components/Card';
import { useAppSelector } from '../app/hooks';
import { balanceTimeline, byCategory, cashFlowPie, formatPLN, totals } from '../utils/finance';

const COLORS = ['#2563eb', '#ef4444', '#22c55e', '#f97316', '#8b5cf6', '#14b8a6'];

export default function Dashboard() {
  const user = useAppSelector((s) => s.auth.currentUser);
  const userKey = user?.email?.toLowerCase() ?? '';
  const items = useAppSelector((s) => (userKey ? s.transactions.byUser[userKey] ?? [] : []));
  const t = totals(items);
  const categoryData = byCategory(items);
  const pieData = cashFlowPie(items);
  const timelineData = balanceTimeline(items);

  return (
    <div>
      <h1 className="text-3xl font-black">Dashboard</h1>
      <p className="mb-6 text-slate-500">Overview of your personal finances in Polish złoty (PLN)</p>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <p className="text-slate-500">Balance</p>
          <h2 className="text-3xl font-black">{formatPLN(t.balance)}</h2>
        </Card>
        <Card>
          <p className="text-slate-500">Income</p>
          <h2 className="text-3xl font-black text-green-600">{formatPLN(t.income)}</h2>
        </Card>
        <Card>
          <p className="text-slate-500">Expenses</p>
          <h2 className="text-3xl font-black text-red-600">{formatPLN(t.expenses)}</h2>
        </Card>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <Card>
          <h2 className="mb-4 text-xl font-bold">Cash flow circle</h2>
          <p className="mb-3 text-sm text-slate-500">Income compared with expenses</p>
          <div className="h-80">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={105} label>
                  {pieData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatPLN(Number(value))} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <h2 className="mb-4 text-xl font-bold">Money over time</h2>
          <p className="mb-3 text-sm text-slate-500">Linear curve showing the balance after each transaction</p>
          <div className="h-80">
            <ResponsiveContainer>
              <LineChart data={timelineData} margin={{ top: 10, right: 20, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis tickFormatter={(value) => `${value} zł`} />
                <Tooltip formatter={(value) => formatPLN(Number(value))} />
                <Line type="monotone" dataKey="balance" name="Balance" stroke="#2563eb" strokeWidth={3} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <div className="mt-6">
        <Card>
          <h2 className="mb-4 text-xl font-bold">Expenses by category</h2>
          <div className="h-72">
            <ResponsiveContainer>
              <BarChart data={categoryData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" />
                <YAxis tickFormatter={(value) => `${value} zł`} />
                <Tooltip formatter={(value) => formatPLN(Number(value))} />
                <Bar dataKey="amount" name="Amount">
                  {categoryData.map((_, index) => (
                    <Cell key={`bar-${index}`} fill={COLORS[(index + 2) % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
}

<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Inertia\Inertia;

class FinancialController extends Controller
{
    public function index(Request $request)
    {
        $month = $request->input('month', now()->format('m'));
        $year = $request->input('year', now()->format('Y'));

        // Busca transações do mês selecionado
        $transactions = Transaction::with(['student.user', 'instructor.user'])
            ->whereMonth('due_date', $month)
            ->whereYear('due_date', $year)
            ->orderBy('due_date', 'desc')
            ->get();

        // Totalizadores do mês
        $totalIncome = $transactions->where('type', 'income')->where('status', 'paid')->sum('amount');
        $totalExpense = $transactions->where('type', 'expense')->where('status', 'paid')->sum('amount');
        $pendingIncome = $transactions->where('type', 'income')->where('status', 'pending')->sum('amount');
        $pendingExpense = $transactions->where('type', 'expense')->where('status', 'pending')->sum('amount');

        return Inertia::render('Financial/Index', [
            'transactions' => $transactions->map(fn($t) => [
                'id' => $t->id,
                'type' => $t->type,
                'category' => $t->category,
                'description' => $t->description,
                'amount' => $t->amount,
                'due_date' => $t->due_date->format('d/m/Y'),
                'status' => $t->status,
                'person' => $t->student ? $t->student->user->name : ($t->instructor ? $t->instructor->user->name : null),
            ]),
            'summary' => [
                'balance' => $totalIncome - $totalExpense,
                'totalIncome' => $totalIncome,
                'totalExpense' => $totalExpense,
                'pendingIncome' => $pendingIncome,
                'pendingExpense' => $pendingExpense,
            ],
            'filters' => ['month' => $month, 'year' => $year]
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'type' => 'required|in:income,expense',
            'category' => 'required|string',
            'description' => 'required|string',
            'amount' => 'required|numeric|min:0.01',
            'due_date' => 'required|date',
            'status' => 'required|in:pending,paid',
        ]);

        if ($validated['status'] === 'paid') {
            $validated['paid_at'] = now();
        }

        Transaction::create($validated);

        return redirect()->back()->with('success', 'Movimentação registrada!');
    }

    public function markAsPaid(Transaction $transaction)
    {
        $transaction->update(['status' => 'paid', 'paid_at' => now()]);
        return redirect()->back();
    }
}
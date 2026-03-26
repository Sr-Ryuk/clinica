<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\Transaction;
use App\Models\Enrollment;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

class ReportController extends Controller
{
    public function index(Request $request)
    {
        $year = $request->input('year', now()->format('Y'));

        // DRE Anual (Janeiro a Dezembro)
        $monthlyData = [];
        for ($m = 1; $m <= 12; $m++) {
            $incomes = Transaction::income()->paid()->whereMonth('paid_at', $m)->whereYear('paid_at', $year)->sum('amount');
            $expenses = Transaction::expense()->paid()->whereMonth('paid_at', $m)->whereYear('paid_at', $year)->sum('amount');
            
            $monthlyData[] = [
                'month' => Carbon::create()->month($m)->translatedFormat('M'),
                'income' => $incomes,
                'expense' => $expenses,
                'profit' => $incomes - $expenses
            ];
        }

        // Estatísticas da Clínica (Corrigido para usar 'scheduled_date' e 'realizada')
        $classesGiven = Enrollment::where('status', 'realizada')
                                  ->whereYear('scheduled_date', $year)
                                  ->count();

        return Inertia::render('Reports/Index', [
            'dre' => $monthlyData,
            'stats' => [
                'classesGiven' => $classesGiven,
                'totalAnnualProfit' => collect($monthlyData)->sum('profit'),
            ],
            'year' => $year
        ]);
    }
}
<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\HealthController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\WbsController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::resource('projects', ProjectController::class);
    Route::post('/projects/{project}/wbs', [WbsController::class, 'store'])->name('wbs.store');
    Route::put('/wbs/{workPackage}', [WbsController::class, 'update'])->name('wbs.update');
    Route::patch('/wbs/{workPackage}', [WbsController::class, 'patch'])->name('wbs.patch');
    Route::delete('/wbs/{workPackage}', [WbsController::class, 'destroy'])->name('wbs.destroy');
    Route::post('/projects/{project}/wbs/reorder', [WbsController::class, 'reorder'])->name('wbs.reorder');

    Route::get('/projects/{project}/health', [HealthController::class, 'show'])->name('health.show');
    Route::post('/projects/{project}/health/refresh', [HealthController::class, 'refresh'])->name('health.refresh');
});

require __DIR__.'/auth.php';

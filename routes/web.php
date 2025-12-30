<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return redirect('/login');
});


Route::get('/dashboard', [App\Http\Controllers\DashboardController::class, 'index'])->middleware(['auth', 'verified'])->name('dashboard');


Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Signature photo upload
    Route::post('/signature/upload', [App\Http\Controllers\SignatureController::class, 'uploadPhoto'])->name('signature.upload');

    // Outlook signature ZIP download
    Route::post('/signature/outlook', [App\Http\Controllers\DashboardController::class, 'downloadOutlookSignature'])->name('signature.outlook');

    // Admin Routes
    Route::prefix('admin')->middleware(['auth'])->group(function () {
        Route::get('/dashboard', [App\Http\Controllers\AdminController::class, 'index'])->name('admin.dashboard');
        Route::post('/users', [App\Http\Controllers\AdminController::class, 'storeUser'])->name('admin.users.store');
        Route::patch('/users/{user}', [App\Http\Controllers\AdminController::class, 'updateUser'])->name('admin.users.update');
        Route::delete('/users/{user}', [App\Http\Controllers\AdminController::class, 'deleteUser'])->name('admin.users.destroy');
        Route::post('/companies', [App\Http\Controllers\AdminController::class, 'storeCompany'])->name('admin.companies.store');
        Route::patch('/companies/{company}', [App\Http\Controllers\AdminController::class, 'updateCompany'])->name('admin.companies.update');
        Route::delete('/companies/{company}', [App\Http\Controllers\AdminController::class, 'deleteCompany'])->name('admin.companies.destroy');
    });
});

require __DIR__ . '/auth.php';

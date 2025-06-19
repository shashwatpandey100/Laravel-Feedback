<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\EntryController;
use App\Http\Controllers\QuestionController;
use App\Http\Controllers\FeedbackController;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

// Fix: Using 'auth' instead of 'auth:sanctum'
Route::middleware(['auth', 'verified'])->group(function () {
    // Dashboard - Note: You had this route defined twice
    Route::get('/dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    // Entries routes
    Route::get('/entries', [EntryController::class, 'index'])->name('entries.index');
    Route::post('/entries', [EntryController::class, 'store'])->name('entries.store');
    Route::get('/entries/{slug}/edit', [EntryController::class, 'edit'])->name('entries.edit');
    Route::put('/entries/{slug}', [EntryController::class, 'update'])->name('entries.update');
    Route::delete('/entries/{slug}', [EntryController::class, 'destroy'])->name('entries.destroy');

    // Questions routes 
    Route::get('/entries/{slug}/questions', [QuestionController::class, 'index'])->name('entries.questions.index');
    Route::post('/entries/{slug}/questions', [QuestionController::class, 'store'])->name('entries.questions.store');
    Route::put('/entries/{slug}/questions/{id}', [QuestionController::class, 'update'])->name('entries.questions.update');
    Route::delete('/entries/{slug}/questions/{id}', [QuestionController::class, 'destroy'])->name('entries.questions.destroy');
    Route::post('/entries/{slug}/questions/order', [QuestionController::class, 'updateOrder'])->name('entries.questions.order');

    // Feedback management routes (for logged-in users)
    Route::get('/entries/{slug}/feedback', [FeedbackController::class, 'index'])->name('entries.feedback.index');
    Route::get('/entries/{slug}/feedback/{id}', [FeedbackController::class, 'show'])->name('entries.feedback.show');
    Route::delete('/entries/{slug}/feedback/{id}', [FeedbackController::class, 'destroy'])->name('entries.feedback.destroy');
});

// Public feedback routes 
Route::get('/f/{slug}', [FeedbackController::class, 'create'])->name('feedback.create');
Route::post('/f/{slug}', [FeedbackController::class, 'store'])->name('feedback.store');
Route::get('/f/{slug}/thanks', [FeedbackController::class, 'thanks'])->name('feedback.thanks');

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';

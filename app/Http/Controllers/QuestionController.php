<?php

namespace App\Http\Controllers;

use App\Models\Entry;
use App\Models\Question;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class QuestionController extends Controller
{
    // Display a listing of the questions for an entry.
    public function index($slug)
    {
        $entry = Entry::where('slug', $slug)
            ->where('user_id', Auth::id())
            ->firstOrFail();

        $questions = $entry->questions()->orderBy('order')->get();

        $feedbackCount = 0;
        if (method_exists($entry, 'feedbacks')) {
            $feedbackCount = $entry->feedbacks()->count();
        }

        return Inertia::render('Questions/Index', [
            'entry' => $entry,
            'questions' => $questions,
            'feedbackCount' => $feedbackCount
        ]);
    }

    // Store a newly created question in database.
    public function store(Request $request, $slug)
    {
        $entry = Entry::where('slug', $slug)
            ->where('user_id', Auth::id())
            ->firstOrFail();

        $validated = $request->validate([
            'label' => 'required|string|max:255',
            'type' => 'required|in:rating,text,multiple_choice,name,email',
            'is_required' => 'boolean',
            'options' => 'nullable|array',
            'options.*' => 'string|max:255',
        ]);

        $maxOrder = $entry->questions()->max('order') ?? -1;

        $question = new Question([
            'label' => $validated['label'],
            'type' => $validated['type'],
            'is_required' => $validated['is_required'] ?? false,
            'order' => $maxOrder + 1,
        ]);

        if ($validated['type'] === 'multiple_choice' && !empty($validated['options'])) {
            $question->options = $validated['options'];
        }

        $entry->questions()->save($question);

        if ($entry->status === 'draft') {
            $entry->update(['status' => 'published']);
        }

        if ($request->wantsJson()) {
            return response()->json([
                'message' => 'Question created successfully',
                'question' => $question
            ]);
        }

        return redirect()->route('entries.questions.index', $entry->slug)
            ->with(['success' => 'Question created successfully.', 'reload' => true]);
    }


    // Show the form for editing the specified question.
    public function edit($slug, $id)
    {
        $entry = Entry::where('slug', $slug)
            ->where('user_id', Auth::id())
            ->firstOrFail();

        $question = $entry->questions()->findOrFail($id);

        return Inertia::render('Questions/Edit', [
            'entry' => $entry,
            'question' => $question
        ]);
    }

    // Update the specified question in database.
    public function update(Request $request, $slug, $id)
    {
        $entry = Entry::where('slug', $slug)
            ->where('user_id', Auth::id())
            ->firstOrFail();

        $question = $entry->questions()->findOrFail($id);

        $validated = $request->validate([
            'label' => 'required|string|max:255',
            'type' => 'required|in:rating,text,multiple_choice,name,email',
            'is_required' => 'boolean',
            'options' => 'nullable|array',
            'options.*' => 'string|max:255',
        ]);

        $question->label = $validated['label'];
        $question->type = $validated['type'];
        $question->is_required = $validated['is_required'] ?? false;

        if ($validated['type'] === 'multiple_choice' && !empty($validated['options'])) {
            $question->options = $validated['options'];
        } else {
            $question->options = null;
        }

        $question->save();

        return redirect()->route('entries.questions.index', $entry->slug)
            ->with(['success' => 'Question updated successfully.', 'reload' => true]);
    }

    // Remove the specified question from database.
    public function destroy($slug, $id)
    {
        $entry = Entry::where('slug', $slug)
            ->where('user_id', Auth::id())
            ->firstOrFail();

        $question = $entry->questions()->findOrFail($id);
        $question->delete();

        $questions = $entry->questions()->orderBy('order')->get();
        foreach ($questions as $index => $q) {
            $q->update(['order' => $index]);
        }

        if ($questions->isEmpty()) {
            $entry->update(['status' => 'draft']);
        }

        return redirect()->route('entries.questions.index', $entry->slug)
            ->with('success', 'Question deleted successfully.');
    }

    // Update the order of questions.
    public function updateOrder(Request $request, $slug)
    {
        $entry = Entry::where('slug', $slug)
            ->where('user_id', Auth::id())
            ->firstOrFail();

        $validated = $request->validate([
            'questions' => 'required|array',
            'questions.*' => 'numeric|exists:questions,id',
        ]);

        foreach ($validated['questions'] as $index => $questionId) {
            $question = Question::find($questionId);

            if ($question && $question->entry_id === $entry->id) {
                $question->update(['order' => $index]);
            }
        }

        return redirect()->route('entries.questions.index', $entry->slug)
            ->with('success', 'Question order updated successfully.');
    }
}

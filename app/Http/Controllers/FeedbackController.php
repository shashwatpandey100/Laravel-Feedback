<?php

namespace App\Http\Controllers;

use App\Models\Entry;
use App\Models\Feedback;
use App\Models\Answer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;
use Inertia\Inertia;

class FeedbackController extends Controller
{
    // Show the feedback form for an entry.
    public function create($slug)
    {
        $entry = Entry::where('slug', $slug)->firstOrFail();

        if ($entry->status === 'draft') {
            return abort(404, 'This form is not available yet.');
        }

        $questions = $entry->questions()->orderBy('order')->get();

        if ($questions->isEmpty()) {
            return abort(404, 'This form has no questions yet.');
        }

        return Inertia::render('Feedback/Create', [
            'entry' => $entry,
            'questions' => $questions
        ]);
    }

    // Store a new feedback submission.
    public function store(Request $request, $slug)
    {
        $entry = Entry::where('slug', $slug)->firstOrFail();
        $questions = $entry->questions()->orderBy('order')->get();

        $validationRules = [];
        foreach ($questions as $question) {
            if ($question->is_required) {
                $validationRules["answers.{$question->id}"] = 'required';

                if ($question->type === 'email') {
                    $validationRules["answers.{$question->id}"] .= '|email';
                }
            }
        }

        $validated = $request->validate($validationRules);

        $feedback = new Feedback([
            'entry_id' => $entry->id,
            'submitted_at' => Carbon::now(),
        ]);
        $feedback->save();

        $answers = $request->input('answers', []);
        foreach ($questions as $question) {
            if (isset($answers[$question->id])) {
                $answer = new Answer([
                    'feedback_id' => $feedback->id,
                    'question_id' => $question->id,
                    'value' => $answers[$question->id],
                ]);
                $answer->save();
            }
        }

        return redirect()->route('feedback.thanks', $entry->slug)
            ->with('success', 'Thank you for your feedback!');
    }

    // Show thank you page after submission.
    public function thanks($slug)
    {
        $entry = Entry::where('slug', $slug)->firstOrFail();
        return Inertia::render('Feedback/Thanks', [
            'entry' => $entry
        ]);
    }

    // List all feedback for an entry (for owner).
    public function index($slug)
    {
        $entry = Entry::where('slug', $slug)
            ->where('user_id', Auth::id())
            ->firstOrFail();

        $feedbacks = $entry->feedbacks()
            ->latest('submitted_at')
            ->paginate(10);

        return Inertia::render('Feedback/Index', [
            'entry' => $entry,
            'feedbacks' => $feedbacks
        ]);
    }

    // Show a specific feedback submission (for owner).
    public function show($slug, $id)
    {
        $entry = Entry::where('slug', $slug)
            ->where('user_id', Auth::id())
            ->firstOrFail();

        $feedback = $entry->feedbacks()->findOrFail($id);
        $answers = $feedback->answers()->with('question')->get();

        return Inertia::render('Feedback/Show', [
            'entry' => $entry,
            'feedback' => $feedback,
            'answers' => $answers
        ]);
    }

    // Delete a feedback submission.
    public function destroy($slug, $id)
    {
        $entry = Entry::where('slug', $slug)
            ->where('user_id', Auth::id())
            ->firstOrFail();

        $feedback = $entry->feedbacks()->findOrFail($id);
        $feedback->delete();

        return redirect()->route('entries.feedback.index', $entry->slug)
            ->with('success', 'Feedback deleted successfully.');
    }
}

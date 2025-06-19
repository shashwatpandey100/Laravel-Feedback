<?php

namespace App\Http\Controllers;

use App\Models\Entry;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class EntryController extends Controller
{
    // List all entries for the authenticated user
    public function index(Request $request)
    {
        $query = Entry::where('user_id', Auth::id());

        if ($request->has('search') && !empty($request->search)) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            });
        }

        $query->withCount('feedbacks');

        $sort = $request->input('sort', 'newest');
        switch ($sort) {
            case 'popular':
                $query->orderBy('feedbacks_count', 'desc');
                break;
            case 'oldest':
                $query->oldest('created_at');
                break;
            case 'newest':
            default:
                $query->latest('created_at');
                break;
        }

        $entries = $query->paginate(15)->withQueryString();

        return Inertia::render('Entries/Index', [
            'entries' => $entries,
            'sort' => $sort
        ]);
    }

    // Store a new entry in the database
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        $entry = Entry::create([
            'user_id' => Auth::id(),
            'title' => $validated['title'],
            'slug' => Str::slug($validated['title']) . '-' . Str::random(6),
            'description' => $validated['description'] ?? null,
            'status' => 'draft',
        ]);

        if ($request->wantsJson()) {
            return response()->json([
                'message' => 'Entry created successfully',
                'redirect' => route('entries.index'),
            ]);
        }

        return redirect()->route('entries.index')
            ->with('success', 'Entry created successfully.');
    }

    // Show form to edit an entry
    public function edit($slug)
    {
        $entry = Entry::where('slug', $slug)->where('user_id', Auth::id())->firstOrFail();
        return Inertia::render('Entries/Edit', [
            'entry' => $entry
        ]);
    }

    // Update an existing entry in the database
    public function update(Request $request, $slug)
    {
        $entry = Entry::where('slug', $slug)->where('user_id', Auth::id())->firstOrFail();

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        $entry->update([
            'title' => $validated['title'],
            'slug' => Str::slug($validated['title']) . '-' . Str::random(6),
            'description' => $validated['description'] ?? null,
        ]);

        return redirect()->route('entries.index')
            ->with('success', 'Entry updated successfully.');
    }

    // Delete an entry
    public function destroy($slug)
    {
        $entry = Entry::where('slug', $slug)->where('user_id', Auth::id())->firstOrFail();
        $entry->delete();

        return redirect()->route('entries.index')
            ->with('success', 'Entry deleted successfully.');
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Entry extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'slug',
        'title',
        'description',
        'status',
    ];

    public function hasQuestions()
    {
        return $this->questions()->count() > 0;
    }

    public function updateStatus()
    {
        $this->status = $this->hasQuestions() ? 'published' : 'draft';
        $this->save();

        return $this;
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function questions()
    {
        return $this->hasMany(Question::class);
    }

    public function feedbacks()
    {
        return $this->hasMany(Feedback::class);
    }
}

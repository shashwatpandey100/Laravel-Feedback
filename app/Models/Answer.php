<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Answer extends Model
{
    use HasFactory;

    protected $fillable = [
        'feedback_id',
        'question_id',
        'value',
    ];

    public function feedback()
    {
        return $this->belongsTo(Feedback::class);
    }

    public function question()
    {
        return $this->belongsTo(Question::class);
    }
}

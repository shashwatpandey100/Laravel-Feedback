<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Feedback extends Model
{
    use HasFactory;

    protected $table = 'feedbacks';

    protected $fillable = [
        'entry_id',
        'submitted_at',
    ];

    protected $dates = ['submitted_at'];

    public function entry()
    {
        return $this->belongsTo(Entry::class);
    }

    public function answers()
    {
        return $this->hasMany(Answer::class);
    }
}

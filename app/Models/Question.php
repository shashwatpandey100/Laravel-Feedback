<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Question extends Model
{
    use HasFactory;

    protected $fillable = [
        'entry_id',
        'label',
        'type',
        'is_required',
        'order',
        'options',
    ];

    protected $casts = [
        'options' => 'array',
        'is_required' => 'boolean',
    ];

    public function entry()
    {
        return $this->belongsTo(Entry::class);
    }

    public function answers()
    {
        return $this->hasMany(Answer::class);
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class Like extends Model
{

    use HasUuids;

    protected $fillable = [
        'post_id',
        'user_id',
    ];
}

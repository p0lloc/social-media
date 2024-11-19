<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class Follow extends Model
{

    use HasUuids;

    protected $fillable = [
        'from_id',
        'to_id',
    ];
}

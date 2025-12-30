<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Company extends Model
{
    protected $fillable = ['name', 'template_name', 'signature_html', 'logo'];

    public function users()
    {
        return $this->hasMany(User::class);
    }
}

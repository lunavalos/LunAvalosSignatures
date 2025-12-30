<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

class NoEmojis implements ValidationRule
{
    /**
     * Run the validation rule.
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        // Regex to detect emojis and other Unicode symbols
        $emojiPattern = '/[\x{1F600}-\x{1F64F}]|[\x{1F300}-\x{1F5FF}]|[\x{1F680}-\x{1F6FF}]|[\x{1F1E0}-\x{1F1FF}]|[\x{2600}-\x{26FF}]|[\x{2700}-\x{27BF}]|[\x{1F900}-\x{1F9FF}]|[\x{1F018}-\x{1F270}]|[\x{238C}-\x{2454}]|[\x{20D0}-\x{20FF}]|[\x{FE00}-\x{FE0F}]|[\x{1F000}-\x{1F02F}]|[\x{1F0A0}-\x{1F0FF}]|[\x{E0020}-\x{E007F}]/u';

        if (preg_match($emojiPattern, $value)) {
            $fail('El campo :attribute no puede contener emojis o símbolos especiales.');
        }
    }
}

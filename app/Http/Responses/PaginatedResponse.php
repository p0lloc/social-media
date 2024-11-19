<?php

namespace App\Http\Responses;

class PaginatedResponse
{
    public array $data;
    public int $current_page;
    public int $last_page;

    public function __construct(
        array $data,
        int $current_page,
        int $last_page,
    ) {
        $this->data = $data;
        $this->current_page = $current_page;
        $this->last_page = $last_page;
    }
}

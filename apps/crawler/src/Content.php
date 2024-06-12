<?php

declare(strict_types=1);

namespace App;

final class Content
{
    public function __construct(
        public readonly string $title,
        public readonly ?string $introduction,
        public readonly string $content,
    ) {

    }
}

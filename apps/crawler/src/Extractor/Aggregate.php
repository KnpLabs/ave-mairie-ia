<?php

declare(strict_types=1);

namespace App\Extractor;

use App\Extractor;
use Psr\Http\Message\StreamInterface;
use Psr\Http\Message\UriInterface;
use Symfony\Component\DomCrawler\Crawler;

final class Aggregate extends Extractor
{
    /**
     * @var array<Extractor>
     */
    private readonly array $extractors;

    public function __construct(Extractor ...$extractors)
    {
        $this->extractors = $extractors;
    }

    public function extract(UriInterface $uri, Crawler $body): iterable
    {
        foreach ($this->extractors as $extractor) {
            foreach($extractor->extract($uri, $body) as $content) {
                yield $content;
            }
        }
    }
}

<?php

declare(strict_types=1);

namespace App\Extractor;

use App\Extractor;
use Psr\Http\Message\StreamInterface;
use Psr\Http\Message\UriInterface;

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

    public function support(UriInterface $uri): bool
    {
        return null !== $this->getExtractor($uri);
    }

    private function getExtractor(UriInterface $uri): ?Extractor
    {
        foreach ($this->extractors as $extractor) {
            if ($extractor->support($uri)) {
                return $extractor;
            }
        }

        return null;
    }

    public function extract(UriInterface $uri, StreamInterface $body): iterable
    {
        if (null === $extractor = $this->getExtractor($uri)) {
            throw new \Exception(
                sprintf("No extractor matching %s", $uri)
            );
        }

        yield from $extractor->extract($uri, $body);
    }
}

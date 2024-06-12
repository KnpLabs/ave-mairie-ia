<?php

declare(strict_types=1);

namespace App\Extractor;

use App\Content;
use App\Extractor;
use Psr\Http\Message\StreamInterface;
use Psr\Http\Message\UriInterface;
use Symfony\Component\DomCrawler\Crawler;

final class E002 extends Extractor
{
    public function support(UriInterface $uri): bool
    {
        return fnmatch(
            'https://www.prefailles.fr/*',
            (string) $uri,
        );
    }

    public function extract(UriInterface $uri, StreamInterface $body): iterable
    {
        $crawler = new Crawler((string) $body);

        $title = $crawler->filter('.entry-title')->first()->text();
        try {
            $description = $crawler->filter('.introduction')->first()->text();
        } catch(\InvalidArgumentException) {
            $description = null;
        }

        $content = $this->cleanup(
            $this->convert(
                $this->sanitize(
                    $crawler->filter('.entry-content')->outerHtml()
                ),
            ),
        );

        yield new Content(
            $title,
            $description,
            $content
        );
    }

}

<?php

declare(strict_types=1);

namespace App\Extractor;

use App\Content;
use App\Extractor;
use League\HTMLToMarkdown\HtmlConverter;
use Psr\Http\Message\StreamInterface;
use Psr\Http\Message\UriInterface;
use Symfony\Component\DomCrawler\Crawler;
use Symfony\Component\HtmlSanitizer\HtmlSanitizer;
use Symfony\Component\HtmlSanitizer\HtmlSanitizerConfig;

final class E001 extends Extractor
{
    public function support(UriInterface $uri): bool
    {
        return fnmatch(
            'https://www.prefailles.fr/services-publics/*/?xml=*',
            (string) $uri,
        );
    }

    public function extract(UriInterface $uri, StreamInterface $body): iterable
    {
        $crawler = new Crawler((string) $body);

        $title = $crawler->filter('.entry-title')->first()->text();
        try {
            $description = $crawler->filter('.description')->first()->text();
        } catch(\InvalidArgumentException) {
            $description = null;
        }

        try {
            $body = $crawler->filter('.entry-content .co-content')->outerHtml();
        } catch(\InvalidArgumentException) {
            return [];
        }

        $content = $this->cleanup(
            $this->convert(
                $this->sanitize(
                    $body,
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

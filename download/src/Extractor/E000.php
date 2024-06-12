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

final class E000 extends Extractor
{
    private const URLS = [
        'https://www.prefailles.fr',
        'https://www.prefailles.fr/',
        'https://www.prefailles.fr/categorie-actualites/*',
        'https://www.prefailles.fr/categorie-agenda/*',
        'https://www.prefailles.fr/systeme/*',
    ];

    public function support(UriInterface $uri): bool
    {
        foreach (self::URLS as $url) {
            if (fnmatch($url, (string) $uri)) {
                return true;
            }
        }

        return false;
    }

    public function extract(UriInterface $uri, StreamInterface $body): iterable
    {
        return [];
    }
}

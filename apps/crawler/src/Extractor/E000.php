<?php

declare(strict_types=1);

namespace App\Extractor;

use App\Content;
use App\Extractor;
use Psr\Http\Message\UriInterface;
use Symfony\Component\DomCrawler\Crawler;

final class E000 extends Extractor
{
    public function extract(UriInterface $uri, Crawler $body): iterable
    {
        $title = $body->filter('.entry-title');

        if (0 === count($title)) {
            return;
        }

        $title = $title->text();

        $introduction = $body->filter('.introduction');

        $introduction = 0 === count($introduction)
            ? ''
            : $introduction->text()
        ;

        $article = $body->filter('.entry-content');

        if (0 === count($article)) {
            return;
        }

        $content = [];

        foreach ($article->children() as $child) {
            if ('h2' === $child->tagName) {
                yield new Content(
                    $title,
                    $introduction,
                    $this->cleanup(
                        $this->convert(
                            $this->sanitize(
                                join("\n", $content),
                            )
                        )
                    )
                );

                $content = [];
            }

            $content[] = self::nodeToHtml($child);
        }

        if ([] !== $content) {
            yield new Content(
                $title,
                $introduction,
                $this->cleanup(
                    $this->convert(
                        $this->sanitize(
                            join("\n", $content),
                        )
                    )
                )
            );
        }
    }
}

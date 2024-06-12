<?php

namespace App;

use League\HTMLToMarkdown\HtmlConverter;
use Psr\Http\Message\StreamInterface;
use Psr\Http\Message\UriInterface;
use Symfony\Component\HtmlSanitizer\HtmlSanitizer;
use Symfony\Component\HtmlSanitizer\HtmlSanitizerConfig;

abstract class Extractor
{
    public abstract function support(UriInterface $uri): bool;

    /**
     * @return iterable<Content>
     */
    public abstract function extract(UriInterface $uri, StreamInterface $body): iterable;

    protected function sanitize(string $html): string
    {
        $config = (new HtmlSanitizerConfig)
            ->allowSafeElements()
            ->allowElement('a')
            ->allowElement('button')
            ->allowElement('div')
            ->allowElement('h1')
            ->allowElement('h2')
            ->allowElement('h3')
            ->allowElement('p')
            ->allowElement('span')
            ->withMaxInputLength(-1)
        ;

        return (new HtmlSanitizer($config))->sanitize($html);
    }

    protected function convert(string $html): string
    {
        $config = [
            'strip_tags'              => true,
            'strip_placeholder_links' => true,
        ];

        return (new HtmlConverter($config))->convert($html);
    }

    protected function cleanup(string $html): string
    {
        $lines = explode("\n", $html);
        $lines = array_map(trim(...), $lines);
        $result = [];

        foreach ($lines as $line) {
            if ('' === $line && end($result) === '') {
                continue;
            }

            if (80 >= strlen($line)) {
                $result[] = $line;

                continue;
            }

            $words = explode(" ", $line);
            $buffer = '';

            while($word = array_shift($words)) {
                $nextBuffer = $buffer === ''
                    ? $word
                    : $buffer. ' ' . $word
                ;

                if (80 < strlen($nextBuffer)) {
                    $result[] = $buffer;
                    $buffer = $word;
                } else {
                    $buffer = $nextBuffer;
                }
            }

            if ('' !== $buffer) {
                $result[] = $buffer;
            }
        }

        return join("\n", $result);
    }
}

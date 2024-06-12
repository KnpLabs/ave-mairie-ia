<?php

use App\Content;
use App\Extractor;
use Nyholm\Psr7\Factory\Psr17Factory;

describe(Extractor::class, function() {
    $targets = [
        'https://www.prefailles.fr/services-publics/droits-et-demarches-pour-les-particuliers/?xml=F403',
        'https://www.prefailles.fr/services-publics/droits-et-demarches-pour-les-particuliers/?xml=N120',
        'https://www.prefailles.fr/vos-15-elus-locaux/',
    ];

    $extractor = new Extractor\Aggregate(
        new Extractor\E001,
        new Extractor\E002,
    );

    foreach ($targets as $target) {
        it(sprintf('is able to extract data for "%s"', $target), function() use ($extractor, $target) {
            $factory = new Psr17Factory;
            $parts = explode("/", $target);
            $parts = array_filter($parts, function(string $part): bool {
                return !in_array($part, ['', ':']);
            });

            $directory = join('/', [__DIR__, 'Extractor', 'data', ...array_slice($parts, 1)]);

            `mkdir -p $directory`;

            $bodyFile = $directory . '/source.html';

            if (false === file_exists($bodyFile)) {
                file_put_contents(
                    $bodyFile,
                    file_get_contents($target),
                );
            }

            $dump = function(iterable $contents): string {
                return join(
                    "\n<!-- raw HTML omitted -->\n",
                    array_map(
                        fn(Content $content): string =>
                        join(
                            "\n\n",
                            array_filter(
                                [
                                    '# ' . $content->title,
                                    $content->introduction ? '> ' . $content->introduction : null,
                                    $content->content,
                                ]
                            )
                        ),
                        [...$contents],
                    ),
                );
            };

            $uri = $factory->createUri($target);

            expect($extractor->support($uri))->toBe(true);

            $body = $factory->createStreamFromFile($bodyFile);

            $markdownFile = $directory . '/extract.mkdown';

            if (false === file_exists($markdownFile)) {
                file_put_contents(
                    $markdownFile,
                    $dump($extractor->extract($uri, $body))
                );
            }

            expect($dump($extractor->extract($uri, $body)))
                ->toBe(file_get_contents($markdownFile))
            ;
        });
    }
});

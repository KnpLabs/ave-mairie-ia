<?php

use App\Content;
use App\Extractor;
use App\Extractor\Aggregate;
use App\Extractor\E000;
use App\Extractor\E001;
use App\Extractor\E002;
use GuzzleHttp\Exception\RequestException;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\UriInterface;
use Spatie\Crawler\CrawlObservers\CrawlObserver;
use Spatie\Crawler\CrawlProfiles\CrawlInternalUrls;
use Spatie\Crawler\Crawler;

require __DIR__ . '/../vendor/autoload.php';

$extractor = new Aggregate(
    new E000,
    new E001,
    new E002,
);

file_put_contents(
    __DIR__ . '/../index-dump.json',
    "[\n",
);

$crawler = Crawler::create()
    ->setCrawlProfile(new CrawlInternalUrls('https://www.prefailles.fr'))
    ->setCrawlObserver(new class($extractor) extends CrawlObserver {
        private bool $first = true;

        public function __construct(private readonly Extractor $extractor)
        {
        }

        public function crawled(
            UriInterface $url,
            ResponseInterface $response,
            ?UriInterface $foundOnUrl = null,
            ?string $linkText = null,
        ): void {
            $headers = array_filter(
                $response->getHeader('Content-Type'),
                fn(string $header): bool => str_starts_with($header, 'text/html'),
            );

            if ([] === $headers) {
                return;
            }

            echo "$url\n";

            foreach ($this->extractor->extract($url, $response->getBody()) as $content) {
                $this->write($url, $content);
            }
        }

        public function crawlFailed(
            UriInterface $url,
            RequestException $requestException,
            ?UriInterface $foundOnUrl = null,
            ?string $linkText = null,
        ): void {}

        private function write(UriInterface $uri, Content $content): void{
            if (false === $this->first) {
                file_put_contents(
                    __DIR__ . '/../index-dump.json',
                    ",\n",
                    FILE_APPEND,
                );
            }

            $this->first = false;

            file_put_contents(
                __DIR__ . '/../index-dump.json',
                "  " . json_encode(
                    [
                        'url' => (string) $uri,
                        'title' => $content->title,
                        'introduction' => $content->introduction ?? '',
                        'content' => $content->content,
                    ],
                    JSON_UNESCAPED_SLASHES,
                ),
                FILE_APPEND,
            );
        }
    })
    ->startCrawling('https://www.prefailles.fr/')
;

file_put_contents(
    __DIR__ . '/../index-dump.json',
    "\n]",
    FILE_APPEND,
);

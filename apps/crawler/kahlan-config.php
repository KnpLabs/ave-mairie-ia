<?php

declare(strict_types=1);

require_once __DIR__ . '/vendor/autoload.php';

use App\Kernel;
use App\Tests\Integration\DIC;
use Kahlan\Filter\Filters;
use Symfony\Bundle\FrameworkBundle\Test\TestContainer;

$commandLine = $this->commandLine();
$commandLine->option('spec', 'default', __DIR__ . '/tests/Kahlan');
$commandLine->option('reporter', 'default', 'verbose');

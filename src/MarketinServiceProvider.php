<?php

namespace Marketin\LaravelBridge;

use Illuminate\Support\Facades\Blade;
use Illuminate\Support\ServiceProvider;

class MarketinServiceProvider extends ServiceProvider
{
    /**
     * Register bindings and merge package configuration.
     */
    public function register(): void
    {
        $this->mergeConfigFrom(__DIR__.'/config/marketin.php', 'marketin');
    }

    /**
     * Bootstrap package services.
     */
    public function boot(): void
    {
    $this->registerPublishing();
    $this->registerDirectives();
    }

    /**
     * Register publishable assets for the package.
     */
    protected function registerPublishing(): void
    {
        if (! $this->app->runningInConsole()) {
            return;
        }

        $this->publishes([
            __DIR__.'/config/marketin.php' => config_path('marketin.php'),
        ], 'marketin-config');

        $this->publishes([
            __DIR__.'/../dist' => public_path('vendor/marketin'),
        ], 'marketin-assets');
    }

    /**
     * Register the package's Blade directives.
     */
    protected function registerDirectives(): void
    {
        Blade::directive('marketinScripts', function (?string $expression = null) {
            $expression = $expression ?: '[]';

            return "<?php echo \\Marketin\\LaravelBridge\\Support\\BridgeDirective::scripts({$expression}); ?>";
        });

        Blade::directive('marketinTracking', function (?string $expression = null) {
            $expression = $expression ?: '[]';

            return "<?php echo \\Marketin\\LaravelBridge\\Support\\BridgeDirective::tracking({$expression}); ?>";
        });
    }

}

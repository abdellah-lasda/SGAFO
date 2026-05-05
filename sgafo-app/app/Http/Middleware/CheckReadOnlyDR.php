<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class CheckReadOnlyDR
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Illuminate\Http\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (Auth::check() && Auth::user()->hasRole('DR')) {
            if (!$request->isMethod('GET')) {
                abort(403, 'Action non autorisée : Le rôle Direction Régionale est limité à la consultation seule.');
            }
        }

        return $next($request);
    }
}

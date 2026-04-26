<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckRole
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next, ...$roles): Response
    {
        $hasAccess = false;
        foreach ($roles as $role) {
            if ($request->user() && $request->user()->hasRole(trim($role))) {
                $hasAccess = true;
                break;
            }
        }

        if (!$hasAccess) {
            abort(403, "Accès interdit. Vous n'avez pas le rôle requis pour accéder à cette section.");
        }

        return $next($request);
    }
}

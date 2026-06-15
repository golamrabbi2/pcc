<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Laravel\Socialite\Facades\Socialite;

class GitHubController extends Controller
{
    public function redirect()
    {
        return Socialite::driver('github')
            ->scopes(['repo', 'admin:repo_hook'])
            ->redirect();
    }

    public function callback(Request $request)
    {
        $githubUser = Socialite::driver('github')->user();

        $user = User::updateOrCreate(
            ['github_id' => $githubUser->getId()],
            [
                'name' => $githubUser->getName() ?? $githubUser->getNickname(),
                'email' => $githubUser->getEmail(),
                'github_token' => $githubUser->token,
                'github_avatar' => $githubUser->getAvatar(),
                'password' => bcrypt(Str::password()),
            ]
        );

        Auth::login($user);

        return redirect()->route('dashboard');
    }
}

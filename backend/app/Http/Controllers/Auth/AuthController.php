<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $userData = $request->validate([
            'name' => 'required|string',
            'email' => 'required|string|email|unique:users',
            'password' => 'required|min:8'
        ]);
        $user = User::create([
            'name' => $userData['name'],
            'email' => $userData['email'],
            'password' => Hash::make($userData['password']),
        ]);
        return response()->json([
            'message' => 'User Created ',
        ]);
    }
    public function login(Request $request)
    {
        $userData = $request->validate([
            'email' => 'required|string|email',
            'password' => 'required|min:8'
        ]);
        $user = User::where('email', $userData['email'])->first();
        if (!$user || !Hash::check($userData['password'], $user->password)) {
            return response()->json([
                'message' => 'Invalid Credentials'
            ], 401);
        }
        $token = $user->createToken($user->name . '-AuthToken')->plainTextToken;
        return response()->json([
            'id' => $user->id,
            'access_token' => $token,
        ]);
    }
    public function logout()
    {
        auth()->user()->tokens()->delete();

        return response()->json([
            "message" => "Usuário deslogado com sucesso!"
        ]);
    }
}

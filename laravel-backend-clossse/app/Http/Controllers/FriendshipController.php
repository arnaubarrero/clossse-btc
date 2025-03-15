<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Friendship;
use App\Models\User;

class FriendshipController extends Controller
{
    public function addFriend(Request $request)
    {
        $request->validate([
            'friend_id' => 'required|exists:users,id',
        ]);

        $user = $request->user();
        $friend_id = $request->input('friend_id');

        $exists = Friendship::where(function ($query) use ($user, $friend_id) {
            $query->where('user_id', $user->id)->where('friend_id', $friend_id);
        })
            ->orWhere(function ($query) use ($user, $friend_id) {
                $query->where('user_id', $friend_id)->where('friend_id', $user->id);
            })
            ->exists();

        if ($exists) {
            return response()->json(['message' => 'Ya son amigos'], 400);
        }

        Friendship::create([
            'user_id' => $user->id,
            'friend_id' => $friend_id,
        ]);

        return response()->json(['message' => 'Amigo agregado correctamente']);
    }

    public function getUserInfo($id)
    {
        $user = User::find($id);

        if (!$user) {
            return response()->json(['message' => 'Usuario no encontrado'], 404);
        }

        $publicAddress = $user->wallet ? $user->wallet->public_address : null;

        return response()->json([
            'name' => $user->name,
            'apellidos' => $user->apellidos,
            'email' => $user->email,
            'username' => $user->username,
            'public_address' => $publicAddress,
        ]);
    }

    public function getFriends(Request $request) {
        $user = $request->user();

        $friends = User::whereIn('id', function ($query) use ($user) {
            $query->select('friend_id')
                  ->from('friendships')
                  ->where('user_id', $user->id);
        })
        ->with('wallet')
        ->get(['id', 'name', 'apellidos', 'email', 'username']);

        $formattedFriends = $friends->map(function ($friend) {
            return [
                'id' => $friend->id,
                'name' => $friend->name,
                'apellidos' => $friend->apellidos,
                'email' => $friend->email,
                'username' => $friend->username,
                'public_address' => $friend->wallet ? $friend->wallet->public_address : null,
            ];
        });

        return response()->json($formattedFriends);
    }
}
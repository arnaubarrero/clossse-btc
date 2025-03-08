<?php
    namespace App\Http\Controllers;
    use Illuminate\Http\Request;
    use App\Models\Friendship;

    class FriendshipController extends Controller {
        public function addFriend(Request $request) {
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
    }
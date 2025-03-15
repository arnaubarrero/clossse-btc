<?php
    namespace App\Http\Controllers;
    use App\Models\User;
    use Illuminate\Http\Request;
    use Illuminate\Support\Facades\Http;

    class BtcAddressController extends Controller {
        public function search(Request $request) {
            $request->validate([
                'query' => 'required|string|min:4',
            ]);

            $query = $request->input('query');

            $users = User::where('username', 'like', "%{$query}%")
                ->get(['id', 'name', 'apellidos', 'email', 'username']);

            return response()->json($users);
        }
    }
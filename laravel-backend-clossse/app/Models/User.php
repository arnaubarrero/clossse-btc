<?php
    namespace App\Models;
    use Laravel\Sanctum\HasApiTokens;
    use Illuminate\Notifications\Notifiable;
    use Illuminate\Contracts\Auth\MustVerifyEmail;
    use Illuminate\Database\Eloquent\Factories\HasFactory;
    use Illuminate\Foundation\Auth\User as Authenticatable;

    class User extends Authenticatable implements MustVerifyEmail {
        use HasFactory, Notifiable, HasApiTokens;

        protected $fillable = [
            'name',
            'apellidos',
            'email',
            'password',
            'username',
        ];

        protected $hidden = [
            'password',
            'remember_token',
        ];

        protected function casts(): array {
            return [
                'email_verified_at' => 'datetime',
                'password' => 'hashed',
            ];
        }

        public function wallet() {
            return $this->hasOne(Wallet::class);
        }

        // Amigos añadidos por este usuario
        public function friends() {
            return $this->belongsToMany(User::class, 'friendships', 'user_id', 'friend_id')
                ->withTimestamps();
        }

        // Usuarios que han añadido a este usuario como amigo
        public function friendOf() {
            return $this->belongsToMany(User::class, 'friendships', 'friend_id', 'user_id')
                ->withTimestamps();
        }

        // Todos los amigos (unión de ambas relaciones)
        public function allFriends() {
            return $this->friends->merge($this->friendOf());
        }
    }
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
    }
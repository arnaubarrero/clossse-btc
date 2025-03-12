<?php
    use Illuminate\Database\Migrations\Migration;
    use Illuminate\Database\Schema\Blueprint;
    use Illuminate\Support\Facades\Schema;

    return new class extends Migration {
        public function up(): void {
            Schema::create('wallets', function (Blueprint $table) {
                $table->id();
                $table->foreignId('user_id')->constrained()->onDelete('cascade');
                $table->string('public_address', 62)->nullable();
                $table->string('private_key', 64)->nullable();
                $table->string('wallet', 1000);
                $table->timestamps();
            });
        }

        public function down(): void {
            Schema::dropIfExists('wallets');
        }
    };
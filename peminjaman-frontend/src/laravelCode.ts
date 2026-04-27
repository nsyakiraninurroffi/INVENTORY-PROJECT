export const laravelFiles: { path: string; lang: string; code: string }[] = [
  {
    path: 'database/migrations/2025_01_01_000001_create_users_table.php',
    lang: 'php',
    code: `<?php
use Illuminate\\Database\\Migrations\\Migration;
use Illuminate\\Database\\Schema\\Blueprint;
use Illuminate\\Support\\Facades\\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('username')->unique();
            $table->string('password');
            $table->string('nama');
            $table->string('email')->unique();
            $table->enum('role', ['admin', 'petugas', 'peminjam'])->default('peminjam');
            $table->string('avatar')->nullable();
            $table->text('bio')->nullable();
            $table->rememberToken();
            $table->timestamps();
        });
    }
    public function down(): void { Schema::dropIfExists('users'); }
};`,
  },
  {
    path: 'database/migrations/2025_01_01_000002_create_kategoris_table.php',
    lang: 'php',
    code: `<?php
use Illuminate\\Database\\Migrations\\Migration;
use Illuminate\\Database\\Schema\\Blueprint;
use Illuminate\\Support\\Facades\\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('kategoris', function (Blueprint $table) {
            $table->id();
            $table->string('nama');
            $table->text('deskripsi')->nullable();
            $table->timestamps();
        });
    }
    public function down(): void { Schema::dropIfExists('kategoris'); }
};`,
  },
  {
    path: 'database/migrations/2025_01_01_000003_create_barangs_table.php',
    lang: 'php',
    code: `<?php
use Illuminate\\Database\\Migrations\\Migration;
use Illuminate\\Database\\Schema\\Blueprint;
use Illuminate\\Support\\Facades\\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('barangs', function (Blueprint $table) {
            $table->id();
            $table->string('nama');
            $table->integer('stok')->default(0);
            $table->foreignId('id_kat')->constrained('kategoris')->onDelete('cascade');
            $table->enum('status', ['tersedia', 'habis', 'rusak'])->default('tersedia');
            $table->string('gambar')->nullable();
            $table->longText('deskripsi')->nullable();
            $table->timestamps();
        });
    }
    public function down(): void { Schema::dropIfExists('barangs'); }
};`,
  },
  {
    path: 'database/migrations/2025_01_01_000004_create_peminjamans_table.php',
    lang: 'php',
    code: `<?php
use Illuminate\\Database\\Migrations\\Migration;
use Illuminate\\Database\\Schema\\Blueprint;
use Illuminate\\Support\\Facades\\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('peminjamans', function (Blueprint $table) {
            $table->id();
            $table->foreignId('id_user')->constrained('users')->onDelete('cascade');
            $table->string('nama_peminjam');
            $table->integer('jumlah_item');
            $table->date('tgl_pinjam');
            $table->date('tgl_kembali');
            $table->enum('status', ['aktif', 'selesai', 'terlambat'])->default('aktif');
            $table->text('catatan')->nullable();
            $table->timestamps();
        });
    }
    public function down(): void { Schema::dropIfExists('peminjamans'); }
};`,
  },
  {
    path: 'database/migrations/2025_01_01_000005_create_detail_peminjamans_table.php',
    lang: 'php',
    code: `<?php
use Illuminate\\Database\\Migrations\\Migration;
use Illuminate\\Database\\Schema\\Blueprint;
use Illuminate\\Support\\Facades\\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('detail_peminjamans', function (Blueprint $table) {
            $table->id();
            $table->foreignId('id_pinjam')->constrained('peminjamans')->onDelete('cascade');
            $table->foreignId('id_barang')->constrained('barangs')->onDelete('cascade');
            $table->integer('jumlah')->default(1);
            $table->enum('status', ['dipinjam', 'dikembalikan'])->default('dipinjam');
            $table->timestamps();
        });
    }
    public function down(): void { Schema::dropIfExists('detail_peminjamans'); }
};`,
  },
  {
    path: 'app/Models/User.php',
    lang: 'php',
    code: `<?php
namespace App\\Models;

use Illuminate\\Foundation\\Auth\\User as Authenticatable;
use Illuminate\\Notifications\\Notifiable;

class User extends Authenticatable {
    use Notifiable;

    protected $fillable = ['username', 'password', 'nama', 'email', 'role', 'avatar', 'bio'];
    protected $hidden = ['password', 'remember_token'];

    public function peminjamans() {
        return $this->hasMany(Peminjaman::class, 'id_user');
    }
}`,
  },
  {
    path: 'app/Models/Kategori.php',
    lang: 'php',
    code: `<?php
namespace App\\Models;

use Illuminate\\Database\\Eloquent\\Model;

class Kategori extends Model {
    protected $fillable = ['nama', 'deskripsi'];

    public function barangs() {
        return $this->hasMany(Barang::class, 'id_kat');
    }
}`,
  },
  {
    path: 'app/Models/Barang.php',
    lang: 'php',
    code: `<?php
namespace App\\Models;

use Illuminate\\Database\\Eloquent\\Model;

class Barang extends Model {
    protected $fillable = ['nama', 'stok', 'id_kat', 'status', 'gambar', 'deskripsi'];

    public function kategori() {
        return $this->belongsTo(Kategori::class, 'id_kat');
    }
    public function detailPeminjamans() {
        return $this->hasMany(DetailPeminjaman::class, 'id_barang');
    }
}`,
  },
  {
    path: 'app/Models/Peminjaman.php',
    lang: 'php',
    code: `<?php
namespace App\\Models;

use Illuminate\\Database\\Eloquent\\Model;

class Peminjaman extends Model {
    protected $fillable = ['id_user', 'nama_peminjam', 'jumlah_item', 'tgl_pinjam', 'tgl_kembali', 'status', 'catatan'];

    public function user() {
        return $this->belongsTo(User::class, 'id_user');
    }
    public function details() {
        return $this->hasMany(DetailPeminjaman::class, 'id_pinjam');
    }
}`,
  },
  {
    path: 'app/Models/DetailPeminjaman.php',
    lang: 'php',
    code: `<?php
namespace App\\Models;

use Illuminate\\Database\\Eloquent\\Model;

class DetailPeminjaman extends Model {
    protected $fillable = ['id_pinjam', 'id_barang', 'jumlah', 'status'];

    public function peminjaman() {
        return $this->belongsTo(Peminjaman::class, 'id_pinjam');
    }
    public function barang() {
        return $this->belongsTo(Barang::class, 'id_barang');
    }
}`,
  },
  {
    path: 'database/seeders/DatabaseSeeder.php',
    lang: 'php',
    code: `<?php
namespace Database\\Seeders;

use Illuminate\\Database\\Seeder;
use Illuminate\\Support\\Facades\\Hash;
use App\\Models\\{User, Kategori, Barang};

class DatabaseSeeder extends Seeder {
    public function run(): void {
        // Users
        User::create(['username'=>'admin','password'=>Hash::make('admin'),'nama'=>'Administrator','email'=>'admin@sipinjam.id','role'=>'admin']);
        User::create(['username'=>'petugas','password'=>Hash::make('petugas'),'nama'=>'Budi Petugas','email'=>'budi@sipinjam.id','role'=>'petugas']);
        User::create(['username'=>'siti','password'=>Hash::make('123'),'nama'=>'Siti Nuraini','email'=>'siti@student.id','role'=>'peminjam']);

        // Kategori
        $elektronik = Kategori::create(['nama'=>'Elektronik','deskripsi'=>'Perangkat elektronik untuk lab & multimedia.']);
        $olahraga   = Kategori::create(['nama'=>'Olahraga','deskripsi'=>'Peralatan olahraga indoor & outdoor.']);
        $atk        = Kategori::create(['nama'=>'Alat Tulis','deskripsi'=>'Perlengkapan kerja & seminar.']);
        $furniture  = Kategori::create(['nama'=>'Furniture','deskripsi'=>'Meja, kursi, dan perlengkapan ruangan.']);

        // Barang
        Barang::create(['nama'=>'Proyektor Epson EB-S41','stok'=>5,'id_kat'=>$elektronik->id,'status'=>'tersedia']);
        Barang::create(['nama'=>'Laptop Asus Vivobook','stok'=>3,'id_kat'=>$elektronik->id,'status'=>'tersedia']);
        Barang::create(['nama'=>'Bola Basket Molten','stok'=>8,'id_kat'=>$olahraga->id,'status'=>'tersedia']);
        Barang::create(['nama'=>'Whiteboard Marker','stok'=>25,'id_kat'=>$atk->id,'status'=>'tersedia']);
        Barang::create(['nama'=>'Kursi Lipat','stok'=>40,'id_kat'=>$furniture->id,'status'=>'tersedia']);
    }
}`,
  },
  {
    path: 'app/Http/Controllers/AuthController.php',
    lang: 'php',
    code: `<?php
namespace App\\Http\\Controllers;

use Illuminate\\Http\\Request;
use Illuminate\\Support\\Facades\\Auth;

class AuthController extends Controller {
    public function showLogin() { return view('auth.login'); }

    public function login(Request $r) {
        $cred = $r->validate(['username'=>'required','password'=>'required']);
        if (Auth::attempt($cred)) {
            $r->session()->regenerate();
            return redirect()->intended('/dashboard');
        }
        return back()->withErrors(['username'=>'Login gagal']);
    }

    public function logout(Request $r) {
        Auth::logout();
        $r->session()->invalidate();
        return redirect('/login');
    }
}`,
  },
  {
    path: 'app/Http/Controllers/BarangController.php',
    lang: 'php',
    code: `<?php
namespace App\\Http\\Controllers;

use App\\Models\\Barang;
use App\\Models\\Kategori;
use Illuminate\\Http\\Request;
use Illuminate\\Support\\Facades\\Storage;

class BarangController extends Controller {
    public function index(Request $r) {
        $q = Barang::with('kategori');
        if ($r->search)   $q->where('nama','like','%'.$r->search.'%');
        if ($r->kategori) $q->where('id_kat', $r->kategori);
        if ($r->status)   $q->where('status', $r->status);
        $barangs = $q->latest()->paginate(12);
        $kategoris = Kategori::all();
        return view('barang.index', compact('barangs','kategoris'));
    }

    public function store(Request $r) {
        $data = $r->validate([
            'nama'=>'required','stok'=>'required|integer|min:0',
            'id_kat'=>'required|exists:kategoris,id',
            'status'=>'required|in:tersedia,habis,rusak',
            'deskripsi'=>'nullable',
            'gambar'=>'nullable|image|max:2048',
        ]);
        if ($r->hasFile('gambar')) {
            $data['gambar'] = $r->file('gambar')->store('barang','public');
        }
        Barang::create($data);
        return redirect()->route('barang.index')->with('success','Barang ditambahkan');
    }

    public function update(Request $r, Barang $barang) {
        $data = $r->validate([
            'nama'=>'required','stok'=>'required|integer|min:0',
            'id_kat'=>'required|exists:kategoris,id',
            'status'=>'required','deskripsi'=>'nullable',
            'gambar'=>'nullable|image|max:2048',
        ]);
        if ($r->hasFile('gambar')) {
            if ($barang->gambar) Storage::disk('public')->delete($barang->gambar);
            $data['gambar'] = $r->file('gambar')->store('barang','public');
        }
        $barang->update($data);
        return redirect()->route('barang.index')->with('success','Barang diupdate');
    }

    public function destroy(Barang $barang) {
        if ($barang->gambar) Storage::disk('public')->delete($barang->gambar);
        $barang->delete();
        return back()->with('success','Barang dihapus');
    }

    // Bulk action
    public function bulkDestroy(Request $r) {
        Barang::whereIn('id', $r->ids)->delete();
        return back()->with('success','Bulk delete berhasil');
    }
}`,
  },
  {
    path: 'app/Http/Controllers/PeminjamanController.php',
    lang: 'php',
    code: `<?php
namespace App\\Http\\Controllers;

use App\\Models\\{Peminjaman, DetailPeminjaman, Barang};
use Illuminate\\Http\\Request;
use Illuminate\\Support\\Facades\\DB;

class PeminjamanController extends Controller {
    public function index() {
        $list = Peminjaman::with(['user','details.barang'])->latest()->get();
        $barangs = Barang::where('stok','>',0)->where('status','tersedia')->get();
        return view('peminjaman.index', compact('list','barangs'));
    }

    public function store(Request $r) {
        $r->validate([
            'nama_peminjam'=>'required','tgl_pinjam'=>'required|date',
            'tgl_kembali'=>'required|date|after_or_equal:tgl_pinjam',
            'items'=>'required|array|min:1',
        ]);

        DB::transaction(function() use ($r) {
            $total = collect($r->items)->sum('jumlah');
            $p = Peminjaman::create([
                'id_user'=>auth()->id(),
                'nama_peminjam'=>$r->nama_peminjam,
                'jumlah_item'=>$total,
                'tgl_pinjam'=>$r->tgl_pinjam,
                'tgl_kembali'=>$r->tgl_kembali,
                'catatan'=>$r->catatan,
                'status'=>'aktif',
            ]);
            foreach ($r->items as $it) {
                DetailPeminjaman::create([
                    'id_pinjam'=>$p->id, 'id_barang'=>$it['id_barang'],
                    'jumlah'=>$it['jumlah'], 'status'=>'dipinjam',
                ]);
                $b = Barang::find($it['id_barang']);
                $b->stok -= $it['jumlah'];
                if ($b->stok <= 0) $b->status = 'habis';
                $b->save();
            }
        });
        return redirect()->route('peminjaman.index')->with('success','Peminjaman berhasil');
    }

    public function kembalikan(Peminjaman $peminjaman) {
        DB::transaction(function() use ($peminjaman) {
            foreach ($peminjaman->details as $d) {
                if ($d->status === 'dipinjam') {
                    $b = Barang::find($d->id_barang);
                    $b->stok += $d->jumlah;
                    $b->status = 'tersedia';
                    $b->save();
                    $d->update(['status'=>'dikembalikan']);
                }
            }
            $peminjaman->update(['status'=>'selesai']);
        });
        return back()->with('success','Pengembalian berhasil');
    }
}`,
  },
  {
    path: 'app/Http/Controllers/LaporanController.php',
    lang: 'php',
    code: `<?php
namespace App\\Http\\Controllers;

use App\\Models\\Peminjaman;
use Illuminate\\Http\\Request;
use Maatwebsite\\Excel\\Facades\\Excel;
use Barryvdh\\DomPDF\\Facade\\Pdf;
use App\\Exports\\PeminjamanExport;

class LaporanController extends Controller {
    public function index(Request $r) {
        $from = $r->from ?? now()->startOfMonth()->toDateString();
        $to   = $r->to   ?? now()->endOfMonth()->toDateString();
        $list = Peminjaman::with('details.barang')
            ->whereBetween('tgl_pinjam', [$from, $to])->get();
        return view('laporan.index', compact('list','from','to'));
    }

    public function exportExcel(Request $r) {
        return Excel::download(new PeminjamanExport($r->from, $r->to), 'laporan.xlsx');
    }

    public function exportPdf(Request $r) {
        $list = Peminjaman::with('details.barang')
            ->whereBetween('tgl_pinjam', [$r->from, $r->to])->get();
        $pdf = Pdf::loadView('laporan.pdf', compact('list'));
        return $pdf->download('laporan.pdf');
    }
}`,
  },
  {
    path: 'app/Exports/PeminjamanExport.php',
    lang: 'php',
    code: `<?php
namespace App\\Exports;

use App\\Models\\Peminjaman;
use Maatwebsite\\Excel\\Concerns\\{FromCollection, WithHeadings, WithMapping};

class PeminjamanExport implements FromCollection, WithHeadings, WithMapping {
    public function __construct(public $from, public $to) {}

    public function collection() {
        return Peminjaman::with('user')
            ->whereBetween('tgl_pinjam', [$this->from, $this->to])->get();
    }

    public function headings(): array {
        return ['ID', 'Peminjam', 'Tgl Pinjam', 'Tgl Kembali', 'Jumlah Item', 'Status'];
    }

    public function map($p): array {
        return ['PJM-'.str_pad($p->id,4,'0',STR_PAD_LEFT), $p->nama_peminjam,
            $p->tgl_pinjam, $p->tgl_kembali, $p->jumlah_item, $p->status];
    }
}`,
  },
  {
    path: 'routes/web.php',
    lang: 'php',
    code: `<?php
use Illuminate\\Support\\Facades\\Route;
use App\\Http\\Controllers\\{AuthController, DashboardController, KategoriController,
    BarangController, PeminjamanController, LaporanController, AkunController, ProfilController};

Route::get('/login', [AuthController::class,'showLogin'])->name('login');
Route::post('/login', [AuthController::class,'login']);

Route::middleware('auth')->group(function() {
    Route::post('/logout', [AuthController::class,'logout'])->name('logout');
    Route::get('/dashboard', [DashboardController::class,'index'])->name('dashboard');

    Route::resource('kategori', KategoriController::class);
    Route::resource('barang', BarangController::class);
    Route::post('barang/bulk-destroy', [BarangController::class,'bulkDestroy']);

    Route::resource('peminjaman', PeminjamanController::class);
    Route::post('peminjaman/{peminjaman}/kembalikan', [PeminjamanController::class,'kembalikan'])
        ->name('peminjaman.kembalikan');

    Route::middleware('role:admin')->group(function() {
        Route::resource('akun', AkunController::class);
    });

    Route::get('/laporan', [LaporanController::class,'index'])->name('laporan.index');
    Route::get('/laporan/excel', [LaporanController::class,'exportExcel'])->name('laporan.excel');
    Route::get('/laporan/pdf', [LaporanController::class,'exportPdf'])->name('laporan.pdf');

    Route::get('/profil', [ProfilController::class,'edit'])->name('profil.edit');
    Route::put('/profil', [ProfilController::class,'update'])->name('profil.update');
});`,
  },
  {
    path: 'resources/views/layouts/app.blade.php',
    lang: 'blade',
    code: `<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>{{ config('app.name','SiPinjam') }} - @yield('title')</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="{{ asset('css/app.css') }}">
</head>
<body class="bg-light">
    @auth
    <nav class="navbar navbar-dark bg-dark">
        <div class="container-fluid">
            <a class="navbar-brand" href="{{ route('dashboard') }}">SiPinjam</a>
            <form action="{{ route('logout') }}" method="POST">@csrf
                <button class="btn btn-sm btn-outline-light">Logout</button>
            </form>
        </div>
    </nav>
    <div class="d-flex">
        @include('partials.sidebar')
        <main class="flex-grow-1 p-4">
            @if(session('success'))
                <div class="alert alert-success">{{ session('success') }}</div>
            @endif
            @yield('content')
        </main>
    </div>
    @else
        @yield('content')
    @endauth
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
</body>
</html>`,
  },
  {
    path: 'resources/views/dashboard.blade.php',
    lang: 'blade',
    code: `@extends('layouts.app')
@section('title','Dashboard')
@section('content')
<h2 class="mb-4">Dashboard</h2>
<div class="row g-3 mb-4">
    <div class="col-md-3"><div class="card p-3"><small>Total Barang</small><h3>{{ $totalBarang }}</h3></div></div>
    <div class="col-md-3"><div class="card p-3"><small>Kategori</small><h3>{{ $totalKategori }}</h3></div></div>
    <div class="col-md-3"><div class="card p-3"><small>Peminjaman Aktif</small><h3>{{ $aktif }}</h3></div></div>
    <div class="col-md-3"><div class="card p-3"><small>User</small><h3>{{ $totalUser }}</h3></div></div>
</div>

<div class="card p-3"><canvas id="chartPinjam"></canvas></div>

<script>
new Chart(document.getElementById('chartPinjam'), {
    type:'bar',
    data: {
        labels: @json($labels),
        datasets: [{ label:'Peminjaman', data: @json($data), backgroundColor:'#8b5cf6' }]
    }
});
</script>
@endsection`,
  },
  {
    path: 'app/Http/Middleware/RoleMiddleware.php',
    lang: 'php',
    code: `<?php
namespace App\\Http\\Middleware;

use Closure;
use Illuminate\\Http\\Request;

class RoleMiddleware {
    public function handle(Request $request, Closure $next, ...$roles) {
        if (!auth()->check() || !in_array(auth()->user()->role, $roles)) {
            abort(403, 'Unauthorized');
        }
        return $next($request);
    }
}`,
  },
  {
    path: 'composer.json (dependencies penting)',
    lang: 'json',
    code: `{
  "require": {
    "php": "^8.2",
    "laravel/framework": "^11.0",
    "laravel/sanctum": "^4.0",
    "maatwebsite/excel": "^3.1",
    "barryvdh/laravel-dompdf": "^3.0",
    "intervention/image": "^3.0"
  }
}

# Setelah composer install, jalankan:
# php artisan migrate
# php artisan db:seed
# php artisan storage:link
# php artisan serve`,
  },

  // === REST API + SANCTUM ===
  {
    path: 'routes/api.php (REST API untuk React frontend)',
    lang: 'php',
    code: `<?php
use Illuminate\\Support\\Facades\\Route;
use App\\Http\\Controllers\\Api\\AuthController;
use App\\Http\\Controllers\\Api\\KategoriController;
use App\\Http\\Controllers\\Api\\BarangController;
use App\\Http\\Controllers\\Api\\PeminjamanController;
use App\\Http\\Controllers\\Api\\LaporanController;
use App\\Http\\Controllers\\Api\\UserController;

// Public
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);

// Protected (butuh token Sanctum)
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::put('/profile', [AuthController::class, 'updateProfile']);

    // Resource API standar (CRUD)
    Route::apiResource('kategori', KategoriController::class);
    Route::apiResource('barang', BarangController::class);
    Route::apiResource('peminjaman', PeminjamanController::class);

    // Aksi khusus
    Route::post('/peminjaman/{id}/kembalikan', [PeminjamanController::class, 'kembalikan']);
    Route::delete('/bulk/kategori', [KategoriController::class, 'bulkDelete']);
    Route::delete('/bulk/barang', [BarangController::class, 'bulkDelete']);

    // User management (admin)
    Route::middleware('role:admin')->group(function () {
        Route::apiResource('users', UserController::class);
    });

    // Laporan
    Route::get('/laporan', [LaporanController::class, 'index']);
    Route::get('/laporan/excel', [LaporanController::class, 'exportExcel']);
    Route::get('/laporan/pdf', [LaporanController::class, 'exportPdf']);
    Route::get('/dashboard/stats', [LaporanController::class, 'dashboardStats']);
});`,
  },
  {
    path: 'app/Http/Controllers/Api/AuthController.php',
    lang: 'php',
    code: `<?php
namespace App\\Http\\Controllers\\Api;

use App\\Http\\Controllers\\Controller;
use App\\Models\\User;
use Illuminate\\Http\\Request;
use Illuminate\\Support\\Facades\\Hash;
use Illuminate\\Validation\\ValidationException;

class AuthController extends Controller
{
    public function login(Request $request) {
        $request->validate([
            'username' => 'required|string',
            'password' => 'required|string',
        ]);

        $user = User::where('username', $request->username)->first();
        if (!$user || !Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'username' => ['Username atau password salah.'],
            ]);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Login berhasil',
            'user'    => $user,
            'token'   => $token,
        ]);
    }

    public function register(Request $request) {
        $data = $request->validate([
            'username' => 'required|string|unique:users',
            'email'    => 'required|email|unique:users',
            'nama'     => 'required|string',
            'password' => 'required|string|min:6',
        ]);
        $data['password'] = Hash::make($data['password']);
        $data['role']     = 'peminjam';

        $user  = User::create($data);
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json(['user' => $user, 'token' => $token], 201);
    }

    public function me(Request $request) {
        return response()->json($request->user());
    }

    public function logout(Request $request) {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Logout berhasil']);
    }

    public function updateProfile(Request $request) {
        $user = $request->user();
        $data = $request->validate([
            'nama'   => 'sometimes|string',
            'email'  => 'sometimes|email|unique:users,email,' . $user->id,
            'bio'    => 'nullable|string',
            'avatar' => 'nullable|image|max:2048',
        ]);

        if ($request->hasFile('avatar')) {
            $data['avatar'] = $request->file('avatar')->store('avatars', 'public');
        }

        $user->update($data);
        return response()->json($user);
    }
}`,
  },
  {
    path: 'app/Http/Controllers/Api/KategoriController.php',
    lang: 'php',
    code: `<?php
namespace App\\Http\\Controllers\\Api;

use App\\Http\\Controllers\\Controller;
use App\\Models\\Kategori;
use Illuminate\\Http\\Request;

class KategoriController extends Controller
{
    public function index(Request $request) {
        $q = Kategori::query()->withCount('barangs');
        if ($search = $request->q) {
            $q->where('nama', 'like', "%$search%");
        }
        return response()->json($q->latest()->paginate($request->per_page ?? 15));
    }

    public function store(Request $request) {
        $data = $request->validate([
            'nama'      => 'required|string|max:100|unique:kategoris',
            'deskripsi' => 'nullable|string',
        ]);
        return response()->json(Kategori::create($data), 201);
    }

    public function show(Kategori $kategori) {
        return response()->json($kategori->load('barangs'));
    }

    public function update(Request $request, Kategori $kategori) {
        $data = $request->validate([
            'nama'      => 'required|string|max:100|unique:kategoris,nama,' . $kategori->id,
            'deskripsi' => 'nullable|string',
        ]);
        $kategori->update($data);
        return response()->json($kategori);
    }

    public function destroy(Kategori $kategori) {
        $kategori->delete();
        return response()->json(['message' => 'Kategori dihapus']);
    }

    public function bulkDelete(Request $request) {
        $request->validate(['ids' => 'required|array']);
        Kategori::whereIn('id', $request->ids)->delete();
        return response()->json(['message' => 'Bulk delete berhasil']);
    }
}`,
  },
  {
    path: 'app/Http/Controllers/Api/BarangController.php',
    lang: 'php',
    code: `<?php
namespace App\\Http\\Controllers\\Api;

use App\\Http\\Controllers\\Controller;
use App\\Models\\Barang;
use Illuminate\\Http\\Request;
use Illuminate\\Support\\Facades\\Storage;

class BarangController extends Controller
{
    public function index(Request $request) {
        $q = Barang::with('kategori');

        if ($s = $request->q)        $q->where('nama', 'like', "%$s%");
        if ($k = $request->kategori) $q->where('id_kat', $k);
        if ($st = $request->status)  $q->where('status', $st);

        return response()->json($q->latest()->paginate($request->per_page ?? 15));
    }

    public function store(Request $request) {
        $data = $request->validate([
            'nama'      => 'required|string|max:150',
            'stok'      => 'required|integer|min:0',
            'id_kat'    => 'required|exists:kategoris,id',
            'status'    => 'required|in:tersedia,habis,rusak',
            'deskripsi' => 'nullable|string',
            'gambar'    => 'nullable|image|max:2048',
        ]);

        if ($request->hasFile('gambar')) {
            $data['gambar'] = $request->file('gambar')->store('barang', 'public');
        }

        return response()->json(Barang::create($data), 201);
    }

    public function show(Barang $barang) {
        return response()->json($barang->load('kategori'));
    }

    public function update(Request $request, Barang $barang) {
        $data = $request->validate([
            'nama'      => 'required|string|max:150',
            'stok'      => 'required|integer|min:0',
            'id_kat'    => 'required|exists:kategoris,id',
            'status'    => 'required|in:tersedia,habis,rusak',
            'deskripsi' => 'nullable|string',
            'gambar'    => 'nullable|image|max:2048',
        ]);

        if ($request->hasFile('gambar')) {
            if ($barang->gambar) Storage::disk('public')->delete($barang->gambar);
            $data['gambar'] = $request->file('gambar')->store('barang', 'public');
        }

        $barang->update($data);
        return response()->json($barang);
    }

    public function destroy(Barang $barang) {
        if ($barang->gambar) Storage::disk('public')->delete($barang->gambar);
        $barang->delete();
        return response()->json(['message' => 'Barang dihapus']);
    }

    public function bulkDelete(Request $request) {
        $request->validate(['ids' => 'required|array']);
        Barang::whereIn('id', $request->ids)->delete();
        return response()->json(['message' => 'Bulk delete berhasil']);
    }
}`,
  },
  {
    path: 'app/Services/PeminjamanService.php (Service Layer untuk Transaksi)',
    lang: 'php',
    code: `<?php
namespace App\\Services;

use App\\Models\\Barang;
use App\\Models\\Peminjaman;
use App\\Models\\DetailPeminjaman;
use Illuminate\\Support\\Facades\\DB;
use Exception;

class PeminjamanService
{
    /**
     * Buat transaksi peminjaman baru.
     * Atomic: stok berkurang + detail dibuat dalam satu transaksi DB.
     */
    public function pinjam(array $data): Peminjaman {
        return DB::transaction(function () use ($data) {

            // 1. Validasi & lock stok
            foreach ($data['items'] as $item) {
                $barang = Barang::lockForUpdate()->findOrFail($item['id_barang']);
                if ($barang->stok < $item['jumlah']) {
                    throw new Exception("Stok '{$barang->nama}' tidak cukup (tersisa {$barang->stok})");
                }
            }

            // 2. Buat header peminjaman
            $peminjaman = Peminjaman::create([
                'id_user'       => $data['id_user'],
                'nama_peminjam' => $data['nama_peminjam'],
                'jumlah_item'   => collect($data['items'])->sum('jumlah'),
                'tgl_pinjam'    => $data['tgl_pinjam'],
                'tgl_kembali'   => $data['tgl_kembali'],
                'status'        => 'dipinjam',
                'catatan'       => $data['catatan'] ?? null,
            ]);

            // 3. Buat detail + kurangi stok
            foreach ($data['items'] as $item) {
                DetailPeminjaman::create([
                    'id_pinjam' => $peminjaman->id,
                    'id_barang' => $item['id_barang'],
                    'jumlah'    => $item['jumlah'],
                    'status'    => 'dipinjam',
                ]);

                $barang = Barang::find($item['id_barang']);
                $barang->stok -= $item['jumlah'];
                if ($barang->stok === 0) $barang->status = 'habis';
                $barang->save();
            }

            return $peminjaman->load('details.barang', 'user');
        });
    }

    /**
     * Proses pengembalian — kembalikan stok dan ubah status.
     */
    public function kembalikan(int $id): Peminjaman {
        return DB::transaction(function () use ($id) {
            $peminjaman = Peminjaman::with('details.barang')->lockForUpdate()->findOrFail($id);

            if ($peminjaman->status === 'dikembalikan') {
                throw new Exception('Peminjaman ini sudah dikembalikan.');
            }

            foreach ($peminjaman->details as $det) {
                if ($det->status === 'dipinjam') {
                    $barang = Barang::lockForUpdate()->find($det->id_barang);
                    $barang->stok  += $det->jumlah;
                    $barang->status = 'tersedia';
                    $barang->save();

                    $det->status = 'dikembalikan';
                    $det->save();
                }
            }

            $peminjaman->status = 'dikembalikan';
            $peminjaman->save();

            return $peminjaman;
        });
    }
}`,
  },
  {
    path: 'app/Http/Controllers/Api/PeminjamanController.php',
    lang: 'php',
    code: `<?php
namespace App\\Http\\Controllers\\Api;

use App\\Http\\Controllers\\Controller;
use App\\Models\\Peminjaman;
use App\\Services\\PeminjamanService;
use Illuminate\\Http\\Request;

class PeminjamanController extends Controller
{
    public function __construct(protected PeminjamanService $service) {}

    public function index(Request $request) {
        $q = Peminjaman::with('user', 'details.barang')->latest();

        if ($status = $request->status)         $q->where('status', $status);
        if ($from   = $request->from)           $q->whereDate('tgl_pinjam', '>=', $from);
        if ($to     = $request->to)             $q->whereDate('tgl_pinjam', '<=', $to);
        if ($s      = $request->q)              $q->where('nama_peminjam', 'like', "%$s%");

        // Peminjam hanya lihat data sendiri
        if ($request->user()->role === 'peminjam') {
            $q->where('id_user', $request->user()->id);
        }

        return response()->json($q->paginate($request->per_page ?? 15));
    }

    public function store(Request $request) {
        $data = $request->validate([
            'id_user'        => 'required|exists:users,id',
            'nama_peminjam'  => 'required|string',
            'tgl_pinjam'     => 'required|date',
            'tgl_kembali'    => 'required|date|after_or_equal:tgl_pinjam',
            'catatan'        => 'nullable|string',
            'items'          => 'required|array|min:1',
            'items.*.id_barang' => 'required|exists:barangs,id',
            'items.*.jumlah'    => 'required|integer|min:1',
        ]);

        try {
            $peminjaman = $this->service->pinjam($data);
            return response()->json($peminjaman, 201);
        } catch (\\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 422);
        }
    }

    public function show(Peminjaman $peminjaman) {
        return response()->json($peminjaman->load('user', 'details.barang'));
    }

    public function update(Request $request, Peminjaman $peminjaman) {
        $data = $request->validate([
            'tgl_kembali' => 'sometimes|date',
            'catatan'     => 'nullable|string',
            'status'      => 'sometimes|in:dipinjam,dikembalikan,terlambat',
        ]);
        $peminjaman->update($data);
        return response()->json($peminjaman);
    }

    public function destroy(Peminjaman $peminjaman) {
        $peminjaman->delete();
        return response()->json(['message' => 'Peminjaman dihapus']);
    }

    public function kembalikan(int $id) {
        try {
            $peminjaman = $this->service->kembalikan($id);
            return response()->json([
                'message'    => 'Pengembalian berhasil',
                'peminjaman' => $peminjaman,
            ]);
        } catch (\\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 422);
        }
    }
}`,
  },
  {
    path: 'app/Http/Controllers/Api/LaporanController.php',
    lang: 'php',
    code: `<?php
namespace App\\Http\\Controllers\\Api;

use App\\Http\\Controllers\\Controller;
use App\\Models\\Peminjaman;
use App\\Models\\Barang;
use App\\Models\\DetailPeminjaman;
use App\\Exports\\PeminjamanExport;
use Illuminate\\Http\\Request;
use Illuminate\\Support\\Facades\\DB;
use Maatwebsite\\Excel\\Facades\\Excel;
use Barryvdh\\DomPDF\\Facade\\Pdf;

class LaporanController extends Controller
{
    public function index(Request $request) {
        $q = Peminjaman::with('user', 'details.barang');
        if ($from = $request->from) $q->whereDate('tgl_pinjam', '>=', $from);
        if ($to   = $request->to)   $q->whereDate('tgl_pinjam', '<=', $to);
        if ($st   = $request->status) $q->where('status', $st);
        return response()->json($q->latest()->get());
    }

    public function dashboardStats() {
        // Top 5 barang paling sering dipinjam
        $topBarang = DetailPeminjaman::select('id_barang', DB::raw('SUM(jumlah) as total'))
            ->with('barang')
            ->groupBy('id_barang')
            ->orderByDesc('total')
            ->limit(5)
            ->get();

        // Peminjaman per bulan (6 bulan terakhir)
        $perBulan = Peminjaman::select(
                DB::raw('DATE_FORMAT(tgl_pinjam, "%Y-%m") as bulan'),
                DB::raw('COUNT(*) as total')
            )
            ->whereDate('tgl_pinjam', '>=', now()->subMonths(6))
            ->groupBy('bulan')
            ->orderBy('bulan')
            ->get();

        // Stok tersedia vs dipinjam
        $stokTersedia = Barang::sum('stok');
        $stokDipinjam = DetailPeminjaman::where('status', 'dipinjam')->sum('jumlah');

        return response()->json([
            'top_barang'    => $topBarang,
            'per_bulan'     => $perBulan,
            'stok_tersedia' => $stokTersedia,
            'stok_dipinjam' => $stokDipinjam,
            'total_pinjam'  => Peminjaman::count(),
            'aktif'         => Peminjaman::where('status', 'dipinjam')->count(),
        ]);
    }

    public function exportExcel(Request $request) {
        return Excel::download(new PeminjamanExport($request->all()), 'laporan-peminjaman.xlsx');
    }

    public function exportPdf(Request $request) {
        $data = Peminjaman::with('user', 'details.barang')
            ->when($request->from, fn($q) => $q->whereDate('tgl_pinjam', '>=', $request->from))
            ->when($request->to,   fn($q) => $q->whereDate('tgl_pinjam', '<=', $request->to))
            ->latest()->get();

        $pdf = Pdf::loadView('exports.peminjaman-pdf', ['data' => $data]);
        return $pdf->download('laporan-peminjaman.pdf');
    }
}`,
  },
  {
    path: 'app/Http/Middleware/RoleMiddleware.php (terbaru)',
    lang: 'php',
    code: `<?php
namespace App\\Http\\Middleware;

use Closure;
use Illuminate\\Http\\Request;

class RoleMiddleware
{
    public function handle(Request $request, Closure $next, ...$roles) {
        if (!$request->user() || !in_array($request->user()->role, $roles)) {
            return response()->json(['message' => 'Akses ditolak. Role tidak sesuai.'], 403);
        }
        return $next($request);
    }
}

// Daftarkan di bootstrap/app.php (Laravel 11+):
//
// ->withMiddleware(function (Middleware $middleware) {
//     $middleware->alias([
//         'role' => \\App\\Http\\Middleware\\RoleMiddleware::class,
//     ]);
// })`,
  },
  {
    path: 'config/cors.php (untuk akses dari React)',
    lang: 'php',
    code: `<?php
return [
    'paths' => ['api/*', 'sanctum/csrf-cookie'],
    'allowed_methods' => ['*'],
    'allowed_origins' => [
        'http://localhost:5173',
        'http://localhost:3000',
    ],
    'allowed_origins_patterns' => [],
    'allowed_headers' => ['*'],
    'exposed_headers' => [],
    'max_age' => 0,
    'supports_credentials' => true,
];`,
  },
  {
    path: 'app/Models/User.php (dengan Sanctum HasApiTokens)',
    lang: 'php',
    code: `<?php
namespace App\\Models;

use Illuminate\\Database\\Eloquent\\Factories\\HasFactory;
use Illuminate\\Foundation\\Auth\\User as Authenticatable;
use Illuminate\\Notifications\\Notifiable;
use Laravel\\Sanctum\\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'username', 'email', 'nama', 'password', 'role', 'avatar', 'bio',
    ];

    protected $hidden = ['password', 'remember_token'];

    protected $casts = [
        'password' => 'hashed',
    ];

    public function peminjamans() {
        return $this->hasMany(Peminjaman::class, 'id_user');
    }

    // Helper role check
    public function isAdmin(): bool   { return $this->role === 'admin'; }
    public function isPetugas(): bool { return $this->role === 'petugas'; }
}`,
  },
  {
    path: 'resources/views/exports/peminjaman-pdf.blade.php',
    lang: 'php',
    code: `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Laporan Peminjaman</title>
    <style>
        body { font-family: 'Helvetica', sans-serif; font-size: 11px; color: #333; }
        h1 { color: #ec4899; margin: 0; }
        .header { border-bottom: 3px solid #a855f7; padding-bottom: 10px; margin-bottom: 16px; }
        table { width: 100%; border-collapse: collapse; margin-top: 10px; }
        th { background: linear-gradient(135deg, #ec4899, #a855f7); color: white; padding: 8px; text-align: left; }
        td { padding: 7px 8px; border-bottom: 1px solid #f0e6f5; }
        tr:nth-child(even) td { background: #fdf6fb; }
        .status { padding: 2px 8px; border-radius: 10px; font-size: 10px; font-weight: bold; }
        .aktif { background: #fef3c7; color: #92400e; }
        .selesai { background: #d1fae5; color: #065f46; }
    </style>
</head>
<body>
    <div class="header">
        <h1>📊 Laporan Peminjaman Barang</h1>
        <p>Tanggal cetak: {{ now()->format('d F Y H:i') }}</p>
    </div>

    <table>
        <thead>
            <tr>
                <th>#</th>
                <th>Peminjam</th>
                <th>Tgl Pinjam</th>
                <th>Tgl Kembali</th>
                <th>Item</th>
                <th>Status</th>
            </tr>
        </thead>
        <tbody>
            @foreach($data as $i => $p)
                <tr>
                    <td>{{ $i + 1 }}</td>
                    <td>{{ $p->nama_peminjam }}</td>
                    <td>{{ $p->tgl_pinjam }}</td>
                    <td>{{ $p->tgl_kembali }}</td>
                    <td>{{ $p->jumlah_item }}</td>
                    <td><span class="status {{ $p->status }}">{{ ucfirst($p->status) }}</span></td>
                </tr>
            @endforeach
        </tbody>
    </table>

    <p style="margin-top: 30px; color: #666; font-size: 10px;">
        Dihasilkan otomatis oleh sistem SiPinjam · Total: {{ $data->count() }} peminjaman
    </p>
</body>
</html>`,
  },
  {
    path: '.env (template)',
    lang: 'bash',
    code: `APP_NAME=SiPinjam
APP_ENV=local
APP_KEY=
APP_DEBUG=true
APP_URL=http://localhost:8000

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=peminjaman_barang
DB_USERNAME=root
DB_PASSWORD=

# Sanctum SPA
SANCTUM_STATEFUL_DOMAINS=localhost:5173,localhost:3000
SESSION_DOMAIN=localhost
SESSION_DRIVER=database

FILESYSTEM_DISK=public

# Setelah copy file ini ke .env, jalankan:
# php artisan key:generate
# php artisan migrate:fresh --seed
# php artisan storage:link
# php artisan serve`,
  },
];

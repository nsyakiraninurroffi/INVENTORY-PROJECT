@extends('layouts.app')
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
@endsection
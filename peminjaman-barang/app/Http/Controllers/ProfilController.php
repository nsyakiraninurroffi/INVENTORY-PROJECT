<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;

class ProfilController extends Controller
{
    public function edit()
    {
        return view('profil.edit');
    }

    public function update(Request $request)
    {
        return back()->with('success', 'Profil diupdate');
    }
}

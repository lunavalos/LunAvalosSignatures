<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Company;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class AdminController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Dashboard', [
            'users' => User::with('company')->get(),
            'companies' => Company::all(),
        ]);
    }

    public function storeUser(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'username' => 'required|string|max:255|unique:users',
            'password' => 'required|string|min:6',
            'role' => 'required|in:admin,user',
            'company_id' => 'required_if:role,user|nullable|exists:companies,id',
        ]);


        User::create([
            'name' => $request->name,
            'username' => $request->username,
            'password' => Hash::make($request->password),
            'role' => $request->role,
            'company_id' => $request->role === 'admin' ? null : $request->company_id,
        ]);

        return back()->with('success', 'Usuario creado correctamente.');
    }

    public function updateUser(Request $request, User $user)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'username' => 'required|string|max:255|unique:users,username,' . $user->id,
            'password' => 'nullable|string|min:6',
            'role' => 'required|in:admin,user',
            'company_id' => 'required_if:role,user|nullable|exists:companies,id',
        ]);

        $data = [
            'name' => $request->name,
            'username' => $request->username,
            'role' => $request->role,
            'company_id' => $request->role === 'admin' ? null : $request->company_id,
        ];

        if ($request->filled('password')) {
            $data['password'] = Hash::make($request->password);
        }

        $user->update($data);

        return back()->with('success', 'Usuario actualizado correctamente.');
    }

    public function deleteUser(User $user)
    {
        if ($user->id === auth()->id()) {
            return back()->with('error', 'No puedes eliminarte a ti mismo.');
        }
        $user->delete();
        return back()->with('success', 'Usuario eliminado.');
    }

    public function storeCompany(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'template_name' => 'nullable|string|max:255',
            'signature_html' => 'nullable|string',
            'logo' => 'nullable|image|max:1024', // max 1MB
        ]);

        $data = $request->except('logo');

        if ($request->hasFile('logo')) {
            $path = $request->file('logo')->store('companies', 'public');
            $data['logo'] = '/storage/' . $path;
        }

        Company::create($data);

        return back()->with('success', 'Empresa creada.');
    }

    public function updateCompany(Request $request, Company $company)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'template_name' => 'nullable|string|max:255',
            'signature_html' => 'nullable|string',
            'logo' => 'nullable|image|max:1024',
        ]);

        $data = $request->except('logo');

        if ($request->hasFile('logo')) {
            $path = $request->file('logo')->store('companies', 'public');
            $data['logo'] = '/storage/' . $path;
        }

        $company->update($data);

        return back()->with('success', 'Empresa actualizada.');
    }

    public function deleteCompany(Company $company)
    {
        // Prevent deleting company if it has users
        if ($company->users()->count() > 0) {
            return back()->with('error', 'No se puede eliminar una empresa que tiene usuarios asociados.');
        }
        $company->delete();
        return back()->with('success', 'Empresa eliminada.');
    }
}

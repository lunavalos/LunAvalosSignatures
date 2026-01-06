import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage, useForm } from '@inertiajs/react';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import InputError from '@/Components/InputError';
import CompanySelect from '@/Components/CompanySelect';
import { useState } from 'react';

export default function AdminDashboard({ users, companies }) {
    const { auth, flash } = usePage().props;
    const [activeTab, setActiveTab] = useState('users');

    const { data: userData, setData: setUserData, post: postUser, patch: patchUser, delete: destroyUser, processing: processingUser, errors: userErrors, reset: resetUser } = useForm({
        id: null,
        name: '',
        username: '',
        password: '',
        role: 'user',
        company_id: '',
    });

    // Form for Company creation/edit
    const companyForm = useForm({
        id: null,
        name: '',
        template_name: '',
        signature_html: '',
        logo: null,
    });

    const [editingUser, setEditingUser] = useState(null);
    const [editingCompany, setEditingCompany] = useState(null);
    const [filterCompanyId, setFilterCompanyId] = useState('');

    const submitUser = (e) => {
        e.preventDefault();
        if (editingUser) {
            patchUser(route('admin.users.update', editingUser.id), {
                onSuccess: () => {
                    setEditingUser(null);
                    resetUser();
                },
            });
        } else {
            postUser(route('admin.users.store'), {
                onSuccess: () => resetUser(),
            });
        }
    };

    const handleEdit = (user) => {
        setEditingUser(user);
        setUserData({
            name: user.name,
            username: user.username,
            password: '', // Leave empty if not changing
            role: user.role,
            company_id: user.company_id || '',
        });
    };

    const deleteUser = (id) => {
        if (confirm('¿Estás seguro de eliminar este usuario?')) {
            destroyUser(route('admin.users.destroy', id));
        }
    };

    const submitCompany = (e) => {
        e.preventDefault();
        if (editingCompany) {
            if (companyForm.data.logo) {
                // If updating logo: POST with _method: 'patch' (Multipart)
                companyForm.transform(data => ({
                    ...data,
                    _method: 'patch'
                })).post(route('admin.companies.update', editingCompany.id), {
                    onSuccess: () => {
                        setEditingCompany(null);
                        companyForm.reset();
                    },
                });
            } else {
                // If NOT updating logo: Standard PATCH (JSON)
                companyForm.patch(route('admin.companies.update', editingCompany.id), {
                    onSuccess: () => {
                        setEditingCompany(null);
                        companyForm.reset();
                    },
                });
            }
        } else {
            companyForm.post(route('admin.companies.store'), {
                onSuccess: () => companyForm.reset(),
            });
        }
    };

    const handleEditCompany = (company) => {
        setEditingCompany(company);
        companyForm.setData({
            name: company.name,
            template_name: company.template_name || '',
            signature_html: company.signature_html || '',
            logo: null, // Reset logo input
        });
    };

    const deleteCompany = (id) => {
        if (confirm('¿Estás seguro de eliminar esta empresa?')) {
            companyForm.delete(route('admin.companies.destroy', id));
        }
    };

    const filteredUsers = filterCompanyId
        ? users.filter(user => user.company_id == filterCompanyId)
        : users;

    return (
        <AuthenticatedLayout
            header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Panel de Administración</h2>}
        >
            <Head title="Panel Admin" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">


                    {/* Flash Messages */}
                    {flash.success && (
                        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
                            <strong className="font-bold">¡Éxito! </strong>
                            <span className="block sm:inline">{flash.success}</span>
                        </div>
                    )}
                    {flash.error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                            <strong className="font-bold">Error: </strong>
                            <span className="block sm:inline">{flash.error}</span>
                        </div>
                    )}

                    {/* Tabs */}
                    <div className="flex space-x-4 mb-6">
                        <button
                            onClick={() => setActiveTab('users')}
                            className={`px-4 py-2 rounded-lg font-medium transition ${activeTab === 'users' ? 'bg-primary text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                        >
                            Gestión de Usuarios
                        </button>
                        <button
                            onClick={() => setActiveTab('companies')}
                            className={`px-4 py-2 rounded-lg font-medium transition ${activeTab === 'companies' ? 'bg-primary text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                        >
                            Gestión de Empresas
                        </button>
                    </div>

                    {activeTab === 'users' && (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                            {/* User Form */}
                            <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-fit">
                                <h3 className="text-lg font-bold text-gray-900 mb-6">{editingUser ? 'Editar Usuario' : 'Registrar Nuevo Usuario'}</h3>
                                <form onSubmit={submitUser} className="space-y-4">
                                    <div>
                                        <InputLabel htmlFor="user_name" value="Nombre del Empleado" />
                                        <TextInput
                                            id="user_name"
                                            value={userData.name}
                                            onChange={e => setUserData('name', e.target.value)}
                                            className="mt-1 block w-full"
                                            placeholder="Nombre completo"
                                        />
                                        <InputError message={userErrors.name} className="mt-2" />
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="user_username" value="Nombre de Usuario" />
                                        <TextInput
                                            id="user_username"
                                            value={userData.username}
                                            onChange={e => setUserData('username', e.target.value)}
                                            className="mt-1 block w-full"
                                            placeholder="Ej. rvelez"
                                        />
                                        <InputError message={userErrors.username} className="mt-2" />
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="user_password" value={editingUser ? 'Contraseña (Dejar en blanco para mantener)' : 'Contraseña'} />
                                        <TextInput
                                            id="user_password"
                                            type="password"
                                            value={userData.password}
                                            onChange={e => setUserData('password', e.target.value)}
                                            className="mt-1 block w-full"
                                            placeholder="Mínimo 6 caracteres"
                                        />
                                        <InputError message={userErrors.password} className="mt-2" />
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="user_role" value="Rol en el sistema" />
                                        <select
                                            id="user_role"
                                            value={userData.role}
                                            onChange={e => setUserData('role', e.target.value)}
                                            className="mt-1 block w-full border-gray-300 focus:border-primary focus:ring-primary rounded-md shadow-sm"
                                        >
                                            <option value="user">Usuario (Firma)</option>
                                            <option value="admin">Administrador (Todo)</option>
                                        </select>
                                        <InputError message={userErrors.role} className="mt-2" />
                                    </div>

                                    {userData.role === 'user' && (
                                        <div className="relative z-50">
                                            <InputLabel htmlFor="user_company" value="Empresa Asignada" />
                                            <div className="relative">
                                                <CompanySelect
                                                    value={userData.company_id}
                                                    onChange={id => setUserData('company_id', id)}
                                                    companies={companies}
                                                />
                                            </div>
                                            <InputError message={userErrors.company_id} className="mt-2" />
                                        </div>
                                    )}

                                    <div className="pt-4 flex gap-2">
                                        <PrimaryButton className="flex-1 justify-center" disabled={processingUser}>
                                            {editingUser ? 'Actualizar' : 'Crear Usuario'}
                                        </PrimaryButton>
                                        {editingUser && (
                                            <button
                                                type="button"
                                                onClick={() => { setEditingUser(null); resetUser(); }}
                                                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                                            >
                                                Cancelar
                                            </button>
                                        )}
                                    </div>
                                </form>
                            </div>

                            {/* Users Table */}
                            <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100 overflow-x-auto">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-lg font-bold text-gray-900">Lista de Usuarios</h3>

                                    {/* Company Filter */}
                                    <div className="flex items-center gap-2 relative z-40">
                                        <InputLabel htmlFor="filter_company" value="Filtrar por Empresa:" className="whitespace-nowrap" />
                                        <div className="w-64">
                                            <CompanySelect
                                                value={filterCompanyId}
                                                onChange={id => setFilterCompanyId(id)}
                                                companies={[{ id: '', name: 'Todas las empresas' }, ...companies]}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="border-b border-gray-100 text-gray-400 text-sm">
                                            <th className="pb-4 font-medium">Nombre</th>
                                            <th className="pb-4 font-medium">Usuario</th>
                                            <th className="pb-4 font-medium">Rol</th>
                                            <th className="pb-4 font-medium">Empresa</th>
                                            <th className="pb-4 font-medium text-right">Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {filteredUsers.map(user => (
                                            <tr key={user.id} className="text-gray-700">
                                                <td className="py-4 font-medium">{user.name}</td>
                                                <td className="py-4">{user.username}</td>
                                                <td className="py-4">
                                                    <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${user.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                                                        {user.role}
                                                    </span>
                                                </td>
                                                <td className="py-4 text-sm">{user.company?.name || '-'}</td>
                                                <td className="py-4 text-right">
                                                    <button
                                                        onClick={() => handleEdit(user)}
                                                        className="text-primary hover:text-[#122355] font-medium mr-3"
                                                    >
                                                        Editar
                                                    </button>
                                                    <button
                                                        onClick={() => deleteUser(user.id)}
                                                        className="text-red-600 hover:text-red-800 font-medium"
                                                        disabled={user.id === auth.user.id}
                                                    >
                                                        Eliminar
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {activeTab === 'companies' && (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Company Form */}
                            <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-fit">
                                <h3 className="text-lg font-bold text-gray-900 mb-6">{editingCompany ? 'Editar Empresa' : 'Registrar Nueva Empresa'}</h3>
                                <form onSubmit={submitCompany} className="space-y-4">
                                    <div>
                                        <InputLabel htmlFor="company_name" value="Nombre de la Empresa" />
                                        <TextInput
                                            id="company_name"
                                            value={companyForm.data.name}
                                            onChange={e => companyForm.setData('name', e.target.value)}
                                            className="mt-1 block w-full"
                                            placeholder="Nombre comercial"
                                        />
                                        <InputError message={companyForm.errors.name} className="mt-2" />
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="company_logo" value="Logo de la Empresa" />
                                        <input
                                            id="company_logo"
                                            type="file"
                                            className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                            onChange={e => companyForm.setData('logo', e.target.files[0])}
                                            accept="image/*"
                                        />
                                        <InputError message={companyForm.errors.logo} className="mt-2" />
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="template_name" value="Nombre de la Plantilla" />
                                        <TextInput
                                            id="template_name"
                                            value={companyForm.data.template_name}
                                            onChange={e => companyForm.setData('template_name', e.target.value)}
                                            className="mt-1 block w-full"
                                            placeholder="Ej. Formato Navidad 2024"
                                        />
                                        <InputError message={companyForm.errors.template_name} className="mt-2" />
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="signature_html" value="HTML de la Firma" />
                                        <textarea
                                            id="signature_html"
                                            value={companyForm.data.signature_html}
                                            onChange={e => companyForm.setData('signature_html', e.target.value)}
                                            className="mt-1 block w-full border-gray-300 focus:border-primary focus:ring-primary rounded-md shadow-sm font-mono text-sm"
                                            rows="10"
                                            placeholder="Pega aquí el código HTML con {{name}}, {{position}}, {{phone}}, {{email}}, {{photo}}"
                                        ></textarea>
                                        <p className="mt-2 text-xs text-gray-500">
                                            Variables soportadas: <code className="bg-gray-100 px-1">{"{{name}}"}</code>, <code className="bg-gray-100 px-1">{"{{position}}"}</code>, <code className="bg-gray-100 px-1">{"{{phone}}"}</code>, <code className="bg-gray-100 px-1">{"{{email}}"}</code>, <code className="bg-gray-100 px-1">{"{{photo}}"}</code>
                                        </p>
                                        <InputError message={companyForm.errors.signature_html} className="mt-2" />
                                    </div>

                                    <div className="pt-4 flex gap-2">
                                        <PrimaryButton className="flex-1 justify-center" disabled={companyForm.processing}>
                                            {editingCompany ? 'Actualizar Empresa ahora' : 'Crear Empresa'}
                                        </PrimaryButton>
                                        {editingCompany && (
                                            <button
                                                type="button"
                                                onClick={() => { setEditingCompany(null); companyForm.reset(); }}
                                                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                                            >
                                                Cancelar
                                            </button>
                                        )}
                                    </div>
                                </form>
                            </div>

                            {/* Companies Table */}
                            <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100 overflow-x-auto">
                                <h3 className="text-lg font-bold text-gray-900 mb-6">Lista de Empresas</h3>
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="border-b border-gray-100 text-gray-400 text-sm">
                                            <th className="pb-4 font-medium">Empresa</th>
                                            <th className="pb-4 font-medium">Plantilla</th>
                                            <th className="pb-4 font-medium">Estado HTML</th>
                                            <th className="pb-4 font-medium text-right">Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {companies.map(company => (
                                            <tr key={company.id} className="text-gray-700 hover:bg-gray-50 transition">
                                                <td className="py-4 font-bold text-primary flex items-center gap-3">
                                                    {company.logo && (
                                                        <img src={company.logo} alt="logo" className="w-8 h-8 object-contain bg-gray-100 rounded" />
                                                    )}
                                                    {company.name}
                                                </td>
                                                <td className="py-4 text-sm">{company.template_name || 'N/A'}</td>
                                                <td className="py-4">
                                                    {company.signature_html ? (
                                                        <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-bold uppercase">Personalizado</span>
                                                    ) : (
                                                        <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs font-bold uppercase">Predeterminado</span>
                                                    )}
                                                </td>
                                                <td className="py-4 text-right">
                                                    <button
                                                        onClick={() => handleEditCompany(company)}
                                                        className="text-primary hover:text-[#122355] font-medium mr-3"
                                                    >
                                                        Editar
                                                    </button>
                                                    <button
                                                        onClick={() => deleteCompany(company.id)}
                                                        className="text-red-600 hover:text-red-800 font-medium"
                                                    >
                                                        Eliminar
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

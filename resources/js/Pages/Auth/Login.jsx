import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        username: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <div className="min-h-screen flex font-sans">
            <Head title="Iniciar Sesión" />

            {/* Left Panel - Branding */}
            <div className="hidden lg:flex w-1/3 bg-primary flex-col justify-center items-center text-white p-12 relative overflow-hidden">
                <div className="z-10 text-center">
                    <img src="/images/logo-lunavalos.png" alt="LunAvalos" className="w-56 mb-6 mx-auto bg-white rounded-lg p-6" />
                    <h1 className="text-3xl font-bold mb-2">Bienvenido a LunAvalos</h1>
                    <p className="text-white/80">Digital House • Generador de Firmas</p>
                </div>
                {/* Decorative circles/shapes */}
                <div className="absolute -bottom-24 -left-24 w-64 h-64 rounded-full bg-white/10"></div>
                <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full bg-white/10"></div>
            </div>

            {/* Right Panel - Form */}
            <div className="w-full lg:w-2/3 flex items-center justify-center bg-lightbg p-8">
                <div className="w-full max-w-md bg-white p-10 rounded-2xl shadow-xl">
                    <div className="text-center mb-8 lg:hidden">
                        <img src="/images/logo-lunavalos.png" alt="LunAvalos" className="h-16 mx-auto mb-4" />
                    </div>

                    <h2 className="text-2xl font-bold text-text mb-6 text-center">Inicia sesión en tu cuenta</h2>

                    {status && (
                        <div className="mb-4 text-sm font-medium text-green-600 border border-green-200 bg-green-50 p-3 rounded">
                            {status}
                        </div>
                    )}

                    <form onSubmit={submit}>
                        <div>
                            <InputLabel htmlFor="username" value="Nombre de Usuario" className="text-gray-700" />

                            <TextInput
                                id="username"
                                type="text"
                                name="username"
                                value={data.username}
                                className="mt-1 block w-full border-gray-200 bg-gray-50 focus:bg-white focus:border-primary focus:ring-primary rounded-lg"
                                autoComplete="username"
                                isFocused={true}
                                placeholder="Ingresa tu usuario"
                                onChange={(e) => setData('username', e.target.value)}
                            />

                            <InputError message={errors.username} className="mt-2" />
                        </div>

                        <div className="mt-4">
                            <InputLabel htmlFor="password" value="Contraseña" className="text-secondary" />

                            <TextInput
                                id="password"
                                type="password"
                                name="password"
                                value={data.password}
                                className="mt-1 block w-full border-gray-200 bg-gray-50 focus:bg-white focus:border-primary focus:ring-primary rounded-lg"
                                autoComplete="current-password"
                                placeholder="Ingresa tu contraseña"
                                onChange={(e) => setData('password', e.target.value)}
                            />

                            <InputError message={errors.password} className="mt-2" />
                        </div>

                        <div className="mt-4 block">
                            <label className="flex items-center">
                                <Checkbox
                                    name="remember"
                                    checked={data.remember}
                                    onChange={(e) =>
                                        setData('remember', e.target.checked)
                                    }
                                    className="text-primary focus:ring-primary border-gray-300 rounded"
                                />
                                <span className="ms-2 text-sm text-gray-600">
                                    Recuérdame
                                </span>
                            </label>
                        </div>

                        <div className="mt-8">
                            <PrimaryButton
                                className="w-full justify-center py-3 bg-primary hover:bg-[#122355] text-white font-bold rounded-lg text-lg transition-all duration-200 shadow-lg"
                                disabled={processing}
                            >
                                Iniciar Sesión
                            </PrimaryButton>
                        </div>

                        {/* Registro eliminado según instrucciones */}
                    </form>
                </div>
            </div>
        </div>
    );
}

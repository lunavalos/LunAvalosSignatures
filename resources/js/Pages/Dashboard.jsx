import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import CompanySelect from '@/Components/CompanySelect';
import AbsoluteSignature from '@/Components/Signatures/AbsoluteSignature';
import SyacsaSignature from '@/Components/Signatures/SyacsaSignature';
import DynamicSignature from '@/Components/Signatures/DynamicSignature';
import { useState, useRef, useEffect } from 'react';
import { usePage } from '@inertiajs/react';

export default function Dashboard({ userCompany, companies }) {
    const { auth } = usePage().props;
    const userRole = auth.user.role;

    const [selectedCompany, setSelectedCompany] = useState(userCompany?.id || null);
    const [form, setForm] = useState({
        name: '',
        position: '',
        phone: '',
        email: '',
        photo: null,
        photoUrl: null
    });

    const [previewData, setPreviewData] = useState(null);
    const [uploading, setUploading] = useState(false);
    const previewRef = useRef(null);
    const [copied, setCopied] = useState(false);
    const fileInputRef = useRef(null);

    // Emoji detection regex - same as backend
    const emojiRegex = /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]|[\u{1F900}-\u{1F9FF}]|[\u{1F018}-\u{1F270}]|[\u{238C}-\u{2454}]|[\u{20D0}-\u{20FF}]|[\u{FE00}-\u{FE0F}]|[\u{1F000}-\u{1F02F}]|[\u{1F0A0}-\u{1F0FF}]|[\u{E0020}-\u{E007F}]/u;

    useEffect(() => {
        if (userRole === 'user' && userCompany) {
            setSelectedCompany(userCompany.id);
        }
    }, [userRole, userCompany]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        // Phone validation: only numbers, max 12 digits
        if (name === 'phone') {
            const numericValue = value.replace(/\D/g, ''); // Remove non-digits
            if (numericValue.length <= 12) {
                setForm(prev => ({ ...prev, [name]: numericValue }));
            }
            return;
        }

        // Check for emojis in all text fields
        if (emojiRegex.test(value)) {
            alert('No se permiten emojis o símbolos especiales en este campo.');
            return;
        }

        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handlePaste = (e) => {
        const pastedText = e.clipboardData.getData('text');

        // Check for emojis in pasted content
        if (emojiRegex.test(pastedText)) {
            e.preventDefault();
            alert('No se permiten emojis o símbolos especiales.');
            return;
        }
    };

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Enforce client-side 2MB limit as well
            if (file.size > 2 * 1024 * 1024) {
                alert('La imagen no debe pesar más de 2MB.');
                return;
            }

            // Just store the file object and a local preview URL
            // We don't upload yet
            setForm(prev => ({
                ...prev,
                photo: file,
                photoUrl: URL.createObjectURL(file)
            }));
        }
    };

    const handleGeneratePreview = async (e) => {
        if (e) e.preventDefault();

        if (!selectedCompany) {
            alert('Por favor selecciona una empresa.');
            return;
        }

        let finalPhotoUrl = form.photoUrl;

        // If there's a new file selected (instance of File), we upload it now
        if (form.photo instanceof File) {
            setUploading(true);

            const formData = new FormData();
            formData.append('photo', form.photo);

            try {
                const response = await window.axios.post(route('signature.upload'), formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });

                if (response.data.success) {
                    finalPhotoUrl = response.data.url;
                    // Update form state with the persistent cloud/base64 URL
                    setForm(prev => ({
                        ...prev,
                        photo: null, // Clear the File object since it's uploaded
                        photoUrl: finalPhotoUrl
                    }));
                } else {
                    alert(response.data.message || 'Error al subir la imagen.');
                    setUploading(false);
                    return;
                }
            } catch (error) {
                console.error('Upload failed:', error);
                const message = error.response?.data?.message || 'Error al subir la imagen. Por favor intenta de nuevo.';
                alert(message);
                setUploading(false);
                return;
            } finally {
                setUploading(false);
            }
        }

        // Update the preview data
        setPreviewData({
            ...form,
            photoUrl: finalPhotoUrl,
            companyId: selectedCompany
        });
    };

    const copyToClipboard = () => {
        if (!previewRef.current) return;

        const range = document.createRange();
        range.selectNode(previewRef.current);
        window.getSelection().removeAllRanges();
        window.getSelection().addRange(range);

        try {
            document.execCommand('copy');
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy', err);
        }

        window.getSelection().removeAllRanges();
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    {userRole === 'admin' ? 'Panel de Control' : 'Generador de Firmas'}
                </h2>
            }
        >
            <Head title="Generador de Firmas" />

            <div className="py-12 bg-lightbg min-h-screen">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                        {/* Panel for Admins */}
                        {userRole === 'admin' && (
                            <div className="lg:col-span-2 bg-primary/5 border border-primary/20 rounded-xl p-8 text-center">
                                <h3 className="text-2xl font-bold text-primary mb-4">Bienvenido Administrador</h3>
                                <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                                    Como administrador, tienes acceso a la gestión de usuarios y empresas.
                                    Para generar tu firma, puedes elegir una empresa o gestionar los datos de otros empleados.
                                </p>
                                <div className="flex justify-center gap-4">
                                    <PrimaryButton onClick={() => router.get(route('admin.dashboard'))}>
                                        Ir al Panel de Administración
                                    </PrimaryButton>
                                </div>
                            </div>
                        )}

                        {/* Left Panel: Form (Always visible for now, but company fixed for users) */}
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-8">
                            <h3 className="text-lg font-bold text-gray-900 mb-6 border-b pb-2">Información del Empleado</h3>

                            <div className="space-y-6">
                                {/* Company Selector - Only for Admin */}
                                {userRole === 'admin' ? (
                                    <div>
                                        <InputLabel htmlFor="company" value="Selecciona la Empresa" />
                                        <div className="mt-1">
                                            <CompanySelect
                                                value={selectedCompany}
                                                onChange={setSelectedCompany}
                                                companies={companies}
                                            />
                                        </div>
                                    </div>
                                ) : (
                                    <div className="bg-gray-50 p-4 rounded-lg flex items-center gap-4 border border-gray-100 italic text-gray-600">
                                        Empresa asignada: <span className="font-bold text-primary uppercase">{userCompany?.name || 'Ninguna'}</span>
                                    </div>
                                )}
                                <div>
                                    <InputLabel htmlFor="name" value="Nombre Completo" />
                                    <TextInput
                                        id="name"
                                        name="name"
                                        value={form.name}
                                        onChange={handleChange}
                                        onPaste={handlePaste}
                                        className="mt-1 block w-full"
                                        placeholder="Ej. Nombre del empleado"
                                    />
                                </div>

                                <div>
                                    <InputLabel htmlFor="position" value="Puesto / Cargo" />
                                    <TextInput
                                        id="position"
                                        name="position"
                                        value={form.position}
                                        onChange={handleChange}
                                        onPaste={handlePaste}
                                        className="mt-1 block w-full"
                                        placeholder="Ej. Ventas & Marketing"
                                    />
                                </div>

                                <div>
                                    <InputLabel htmlFor="phone" value="Teléfono" />
                                    <TextInput
                                        id="phone"
                                        type="tel"
                                        name="phone"
                                        value={form.phone}
                                        onChange={handleChange}
                                        className="mt-1 block w-full"
                                        placeholder="Ej. 1234567890"
                                        maxLength={12}
                                        pattern="[0-9]*"
                                        inputMode="numeric"
                                    />
                                </div>

                                <div>
                                    <InputLabel htmlFor="email" value="Correo Electrónico" />
                                    <TextInput
                                        id="email"
                                        type="email"
                                        name="email"
                                        value={form.email}
                                        onChange={handleChange}
                                        onPaste={handlePaste}
                                        className="mt-1 block w-full"
                                        placeholder="Ej. nombre@empresa.com"
                                    />
                                </div>

                                <div>
                                    <InputLabel htmlFor="photo" value="Foto de Perfil" />
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/*"
                                        onChange={handlePhotoChange}
                                        className="hidden"
                                        id="photo"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => fileInputRef.current?.click()}
                                        disabled={uploading}
                                        className="mt-1 w-full px-4 py-2 bg-primary/5 text-primary rounded-lg border border-primary/20 hover:bg-primary/10 font-semibold text-sm transition-colors disabled:opacity-50"
                                    >
                                        {uploading ? 'Subiendo...' : (form.photoUrl ? 'Cambiar Foto' : 'Seleccionar Archivo')}
                                    </button>
                                    {form.photoUrl && (
                                        <p className="text-xs text-green-600 mt-1">✓ Foto seleccionada</p>
                                    )}
                                    <p className="text-xs text-gray-400 mt-1">Tamaño recomendado: 70x70px o cuadrado.</p>
                                </div>

                                <div className="pt-4">
                                    <PrimaryButton
                                        type="button"
                                        onClick={handleGeneratePreview}
                                        className="w-full justify-center py-4 text-lg bg-green-600 hover:bg-green-700 h-auto"
                                        disabled={uploading}
                                    >
                                        {uploading ? (
                                            <span className="flex items-center gap-2">
                                                <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Subiendo foto...
                                            </span>
                                        ) : 'Generar Firma'}
                                    </PrimaryButton>
                                </div>
                            </div>
                        </div>

                        {/* Right Panel: Preview */}
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-8 sticky top-6 self-start">
                            <div className="flex justify-between items-center mb-6 border-b pb-2">
                                <h3 className="text-lg font-bold text-gray-900">Vista Previa</h3>
                                {selectedCompany && (
                                    <PrimaryButton
                                        onClick={copyToClipboard}
                                        className="transition-colors bg-primary hover:bg-blue-600"
                                    >
                                        {copied ? '¡Copiado!' : 'Copiar Firma'}
                                    </PrimaryButton>
                                )}
                            </div>

                            <div className="border border-gray-200 rounded p-4 bg-white overflow-auto flex flex-col items-center min-h-[200px] justify-center">
                                {selectedCompany ? (
                                    <div ref={previewRef}>
                                        {(() => {
                                            const company = companies?.find(c => c.id === selectedCompany);
                                            const currentPreviewData = { ...form, companyId: selectedCompany };

                                            // If company has custom HTML template, use DynamicSignature
                                            if (company?.signature_html) {
                                                return (
                                                    <DynamicSignature
                                                        html={company.signature_html}
                                                        data={currentPreviewData}
                                                    />
                                                );
                                            }

                                            // Otherwise use hardcoded components based on company ID
                                            if (company?.id === 4) {
                                                return <SyacsaSignature {...currentPreviewData} />;
                                            } else if (company?.id === 2) {
                                                return <AbsoluteSignature {...currentPreviewData} />;
                                            }

                                            // Fallback for unknown companies
                                            return (
                                                <div className="text-gray-400 text-center italic py-10">
                                                    No hay plantilla disponible para esta empresa
                                                </div>
                                            );
                                        })()}
                                    </div>
                                ) : (
                                    <div className="text-gray-400 text-center italic py-10">
                                        Selecciona una empresa para ver la vista previa
                                    </div>
                                )}
                            </div>

                            {selectedCompany && (
                                <>
                                    <p className="mt-4 text-sm text-gray-500 text-center">
                                        Haz clic en "Copiar Firma" y pégala (Ctrl+V) en la configuración de tu correo.
                                    </p>

                                </>
                            )}
                        </div>
                    </div>

                    {/* Video Tutorial Stripe */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-8 mt-8">
                        <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">¿Cómo usar este generador?</h3>
                        <div className="w-full max-w-4xl mx-auto bg-gray-100 rounded-xl overflow-hidden shadow-inner border border-gray-200">
                            <video
                                className="w-full aspect-video"
                                controls
                                poster="https://absolute-fi.com/wp-content/uploads/absolute-group-cover.jpg"
                            >
                                <source src="/tutorial.webm" type="video/webm" />
                                Tu navegador no soporta el formato de video.
                            </video>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

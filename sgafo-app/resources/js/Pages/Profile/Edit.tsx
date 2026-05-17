import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PageProps } from '@/types';
import { Head, useForm, usePage, Link } from '@inertiajs/react';
import { FormEventHandler, useRef, useState } from 'react';
import { Transition } from '@headlessui/react';
import {
    User, Mail, Lock, Eye, EyeOff,
    CheckCircle, AlertTriangle, Shield, Settings,
    ChevronRight, Camera, Save
} from 'lucide-react';

// --- Sub-component: Avatar with initials ---
function UserAvatar({ prenom, nom, size = 'lg' }: { prenom?: string; nom?: string; size?: 'sm' | 'lg' }) {
    const initials = ((prenom?.[0] || '') + (nom?.[0] || '')).toUpperCase() || 'U';
    const sizeClasses = size === 'lg' ? 'w-24 h-24 text-3xl' : 'w-10 h-10 text-sm';
    return (
        <div className={`${sizeClasses} rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-black shadow-lg shadow-blue-500/30 flex-shrink-0`}>
            {initials}
        </div>
    );
}

// --- Sub-component: Section Card ---
function SectionCard({ title, description, icon: Icon, children, danger = false }: {
    title: string; description: string; icon: any; children: React.ReactNode; danger?: boolean;
}) {
    return (
        <div className={`bg-white rounded-2xl border ${danger ? 'border-red-100' : 'border-slate-200/60'} shadow-sm overflow-hidden`}>
            <div className={`px-8 py-6 border-b ${danger ? 'border-red-100 bg-red-50/50' : 'border-slate-100 bg-slate-50/50'}`}>
                <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${danger ? 'bg-red-100' : 'bg-blue-50'}`}>
                        <Icon className={`w-5 h-5 ${danger ? 'text-red-500' : 'text-blue-600'}`} />
                    </div>
                    <div>
                        <h3 className={`text-base font-bold ${danger ? 'text-red-700' : 'text-slate-900'}`}>{title}</h3>
                        <p className="text-sm text-slate-500 mt-0.5">{description}</p>
                    </div>
                </div>
            </div>
            <div className="px-8 py-8">
                {children}
            </div>
        </div>
    );
}

// --- Sub-component: Form Field ---
function FormField({ label, children, error }: { label: string; children: React.ReactNode; error?: string }) {
    return (
        <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-slate-700">{label}</label>
            {children}
            {error && (
                <p className="text-xs text-red-500 flex items-center gap-1 mt-1">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    {error}
                </p>
            )}
        </div>
    );
}

// --- Sub-component: Input Field ---
function InputField({ type = 'text', value, onChange, autoComplete, id, ref: refProp, placeholder }: any) {
    return (
        <input
            id={id}
            ref={refProp}
            type={type}
            value={value}
            onChange={onChange}
            autoComplete={autoComplete}
            placeholder={placeholder}
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm font-medium placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
        />
    );
}

// --- Sub-component: Password Input ---
function PasswordInput({ value, onChange, autoComplete, id, ref: refProp, placeholder }: any) {
    const [show, setShow] = useState(false);
    return (
        <div className="relative">
            <input
                id={id}
                ref={refProp}
                type={show ? 'text' : 'password'}
                value={value}
                onChange={onChange}
                autoComplete={autoComplete}
                placeholder={placeholder || '••••••••'}
                className="w-full px-4 py-3 pr-12 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm font-medium placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
            <button
                type="button"
                onClick={() => setShow(!show)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
            >
                {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
        </div>
    );
}

// ==================== PROFILE INFO FORM ====================
function ProfileInfoSection({ mustVerifyEmail, status }: { mustVerifyEmail: boolean; status?: string }) {
    const user = usePage().props.auth.user;
    const fullName = `${user.prenom || ''} ${user.nom || ''}`.trim();
    const { data, setData, patch, errors, processing, recentlySuccessful } = useForm({
        name: fullName,
        email: user.email,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        patch(route('profile.update'));
    };

    return (
        <SectionCard
            title="Informations Personnelles"
            description="Mettez à jour votre nom et votre adresse e-mail institutionnelle."
            icon={User}
        >
            {/* Avatar Header */}
            <div className="flex items-center gap-6 pb-8 mb-8 border-b border-slate-100">
                <div className="relative group">
                    <UserAvatar prenom={user.prenom} nom={user.nom} size="lg" />
                </div>
                <div>
                    <h4 className="text-xl font-black text-slate-900">{user.prenom} {user.nom}</h4>
                    <p className="text-sm text-slate-500 mt-1">{user.email}</p>
                    <div className="flex items-center gap-2 mt-3">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 border border-emerald-200 rounded-full text-xs font-bold text-emerald-700">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            Compte Actif
                        </span>
                    </div>
                </div>
            </div>

            <form onSubmit={submit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField label="Nom Complet" error={errors.name}>
                        <InputField
                            id="name"
                            value={data.name}
                            onChange={(e: any) => setData('name', e.target.value)}
                            autoComplete="name"
                        />
                    </FormField>

                    <FormField label="Adresse E-mail" error={errors.email}>
                        <div className="relative">
                            <InputField
                                id="email"
                                type="email"
                                value={data.email}
                                onChange={(e: any) => setData('email', e.target.value)}
                                autoComplete="username"
                            />
                            <Mail className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                        </div>
                    </FormField>
                </div>

                {mustVerifyEmail && user.email_verified_at === null && (
                    <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl">
                        <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                        <div>
                            <p className="text-sm font-semibold text-amber-800">Email non vérifié</p>
                            <p className="text-sm text-amber-700 mt-1">
                                Votre adresse email n'est pas vérifiée.{' '}
                                <Link href={route('verification.send')} method="post" as="button" className="underline font-bold hover:text-amber-900">
                                    Renvoyer le lien de vérification.
                                </Link>
                            </p>
                            {status === 'verification-link-sent' && (
                                <p className="text-sm font-medium text-emerald-600 mt-2">✓ Lien envoyé avec succès.</p>
                            )}
                        </div>
                    </div>
                )}

                <div className="flex items-center gap-4 pt-2">
                    <button
                        type="submit"
                        disabled={processing}
                        className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white text-sm font-bold rounded-xl hover:bg-blue-600 hover:shadow-lg hover:shadow-blue-600/25 hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
                    >
                        <Save className="w-4 h-4" />
                        Enregistrer
                    </button>

                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-out duration-300"
                        enterFrom="opacity-0 translate-y-1"
                        enterTo="opacity-100 translate-y-0"
                        leave="transition ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <span className="flex items-center gap-2 text-sm font-semibold text-emerald-600">
                            <CheckCircle className="w-4 h-4" />
                            Modifications enregistrées !
                        </span>
                    </Transition>
                </div>
            </form>
        </SectionCard>
    );
}

// ==================== PASSWORD FORM ====================
function PasswordSection() {
    const passwordInput = useRef<HTMLInputElement>(null);
    const currentPasswordInput = useRef<HTMLInputElement>(null);

    const { data, setData, errors, put, reset, processing, recentlySuccessful } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const updatePassword: FormEventHandler = (e) => {
        e.preventDefault();
        put(route('password.update'), {
            preserveScroll: true,
            onSuccess: () => reset(),
            onError: (errs) => {
                if (errs.password) { reset('password', 'password_confirmation'); passwordInput.current?.focus(); }
                if (errs.current_password) { reset('current_password'); currentPasswordInput.current?.focus(); }
            },
        });
    };

    const strength = data.password.length === 0 ? 0 : data.password.length < 6 ? 1 : data.password.length < 10 ? 2 : 3;
    const strengthLabels = ['', 'Faible', 'Moyen', 'Fort'];
    const strengthColors = ['', 'bg-red-400', 'bg-amber-400', 'bg-emerald-400'];

    return (
        <SectionCard
            title="Sécurité du Compte"
            description="Utilisez un mot de passe long et aléatoire pour renforcer la sécurité."
            icon={Lock}
        >
            <form onSubmit={updatePassword} className="space-y-6">
                <FormField label="Mot de passe actuel" error={errors.current_password}>
                    <PasswordInput
                        id="current_password"
                        ref={currentPasswordInput}
                        value={data.current_password}
                        onChange={(e: any) => setData('current_password', e.target.value)}
                        autoComplete="current-password"
                    />
                </FormField>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <FormField label="Nouveau mot de passe" error={errors.password}>
                            <PasswordInput
                                id="password"
                                ref={passwordInput}
                                value={data.password}
                                onChange={(e: any) => setData('password', e.target.value)}
                                autoComplete="new-password"
                            />
                        </FormField>
                        {data.password.length > 0 && (
                            <div className="mt-3 space-y-1.5">
                                <div className="flex gap-1.5">
                                    {[1, 2, 3].map(i => (
                                        <div key={i} className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${i <= strength ? strengthColors[strength] : 'bg-slate-200'}`} />
                                    ))}
                                </div>
                                <p className={`text-xs font-semibold ${strength === 1 ? 'text-red-500' : strength === 2 ? 'text-amber-500' : 'text-emerald-500'}`}>
                                    Force : {strengthLabels[strength]}
                                </p>
                            </div>
                        )}
                    </div>

                    <FormField label="Confirmer le nouveau mot de passe" error={errors.password_confirmation}>
                        <PasswordInput
                            id="password_confirmation"
                            value={data.password_confirmation}
                            onChange={(e: any) => setData('password_confirmation', e.target.value)}
                            autoComplete="new-password"
                        />
                        {data.password && data.password_confirmation && data.password === data.password_confirmation && (
                            <p className="text-xs font-semibold text-emerald-600 mt-2 flex items-center gap-1">
                                <CheckCircle className="w-3.5 h-3.5" />
                                Les mots de passe correspondent
                            </p>
                        )}
                    </FormField>
                </div>

                <div className="flex items-center gap-4 pt-2">
                    <button
                        type="submit"
                        disabled={processing}
                        className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white text-sm font-bold rounded-xl hover:bg-blue-600 hover:shadow-lg hover:shadow-blue-600/25 hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
                    >
                        <Shield className="w-4 h-4" />
                        Mettre à jour
                    </button>

                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="transition ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <span className="flex items-center gap-2 text-sm font-semibold text-emerald-600">
                            <CheckCircle className="w-4 h-4" />
                            Mot de passe mis à jour !
                        </span>
                    </Transition>
                </div>
            </form>
        </SectionCard>
    );
}

// (DeleteSection removed)

// ==================== MAIN PAGE ====================
export default function Edit({ mustVerifyEmail, status }: PageProps<{ mustVerifyEmail: boolean; status?: string }>) {
    const user = usePage().props.auth.user;
    const [activeTab, setActiveTab] = useState<'profile' | 'security'>('profile');

    const tabs = [
        { id: 'profile' as const, label: 'Mon Profil', icon: User },
        { id: 'security' as const, label: 'Sécurité', icon: Shield },
    ];

    return (
        <AuthenticatedLayout header={<span className="text-slate-900 font-bold">Mon Profil</span>}>
            <Head title="Mon Profil" />

            <div className="min-h-screen bg-slate-50/50">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

                    {/* Page Header */}
                    <div className="mb-10 flex items-center gap-6">
                        <UserAvatar prenom={user.prenom} nom={user.nom} size="lg" />
                        <div>
                            <h1 className="text-3xl font-black text-slate-900 tracking-tight">{user.prenom} {user.nom}</h1>
                            <p className="text-slate-500 mt-1 font-medium">{user.email}</p>
                            <nav className="flex items-center gap-1.5 mt-2 text-xs text-slate-400 font-medium">
                                <Link href={route('dashboard')} className="hover:text-blue-600 transition-colors">Tableau de bord</Link>
                                <ChevronRight className="w-3 h-3" />
                                <span className="text-slate-700">Mon Profil</span>
                            </nav>
                        </div>
                    </div>

                    {/* Tab Navigation */}
                    <div className="flex gap-1 p-1 bg-white border border-slate-200 rounded-2xl mb-8 w-fit shadow-sm">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 ${
                                    activeTab === tab.id
                                        ? tab.id === 'danger'
                                            ? 'bg-red-50 text-red-600 shadow-sm'
                                            : 'bg-slate-900 text-white shadow-sm'
                                        : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                                }`}
                            >
                                <tab.icon className="w-4 h-4" />
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* Tab Content */}
                    <div className="space-y-6">
                        {activeTab === 'profile' && (
                            <ProfileInfoSection mustVerifyEmail={mustVerifyEmail} status={status} />
                        )}
                        {activeTab === 'security' && (
                            <PasswordSection />
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

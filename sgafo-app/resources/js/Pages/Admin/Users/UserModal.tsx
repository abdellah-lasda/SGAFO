import { useState, useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import Modal from '@/Components/Modal';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import Checkbox from '@/Components/Checkbox';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';

export default function UserModal({ isOpen, onClose, user, roles, regions, instituts, secteurs, cdcs }: any) {
    const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm({
        nom: '',
        prenom: '',
        email: '',
        password: '',
        statut: 'actif',
        is_externe: false,
        roles: [] as number[],
        regions: [] as number[],
        instituts: [] as number[],
        secteurs: [] as number[],
        cdcs: [] as number[],
    });

    useEffect(() => {
        if (isOpen) {
            clearErrors();
            if (user) {
                setData({
                    nom: user.nom,
                    prenom: user.prenom,
                    email: user.email,
                    password: '',
                    statut: user.statut,
                    is_externe: user.is_externe ? true : false,
                    roles: user.roles?.map((r: any) => r.id) || [],
                    regions: user.regions?.map((r: any) => r.id) || [],
                    instituts: user.instituts?.map((i: any) => i.id) || [],
                    secteurs: user.secteurs?.map((s: any) => s.id) || [],
                    cdcs: user.cdcs?.map((c: any) => c.id) || [],
                });
            } else {
                reset();
            }
        }
    }, [isOpen, user]);

    const isEdit = !!user;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (isEdit) {
            put(route('admin.users.update', user.id), {
                onSuccess: () => onClose(),
            });
        } else {
            post(route('admin.users.store'), {
                onSuccess: () => onClose(),
            });
        }
    };

    // Logic for conditional fields
    const hasRole = (roleCode: string) => {
        const selectedRoleIds = data.roles;
        const roleObj = roles.find((r: any) => r.code === roleCode);
        return roleObj && selectedRoleIds.includes(roleObj.id);
    };

    const isDR = hasRole('DR');
    const isCDC = hasRole('CDC');
    const isFormateur = hasRole('FORMATEUR');

    return (
        <Modal show={isOpen} onClose={onClose} maxWidth="2xl">
            <form onSubmit={handleSubmit}>
                <div className="p-6 border-b border-gray-100">
                    <h2 className="text-lg font-medium text-gray-900">
                        {isEdit ? 'Modifier l\'utilisateur' : 'Créer un nouvel utilisateur'}
                    </h2>
                </div>

                {/* Zone Scrollable */}
                <div className="p-6 overflow-y-auto max-h-[70vh] scrollbar-thin scrollbar-thumb-gray-300">
                    <div className="space-y-6">
                        {/* Section 1: Identité */}
                        <div className="bg-gray-50/50 p-4 rounded-xl border border-gray-100">
                            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center">
                                <span className="w-6 h-px bg-gray-200 mr-2"></span>
                                Informations Personnelles
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <InputLabel htmlFor="prenom" value="Prénom" />
                                    <TextInput id="prenom" className="mt-1 block w-full bg-white" value={data.prenom} onChange={e => setData('prenom', e.target.value)} required />
                                    <InputError message={errors.prenom} className="mt-2" />
                                </div>
                                <div>
                                    <InputLabel htmlFor="nom" value="Nom" />
                                    <TextInput id="nom" className="mt-1 block w-full bg-white" value={data.nom} onChange={e => setData('nom', e.target.value)} required />
                                    <InputError message={errors.nom} className="mt-2" />
                                </div>
                            </div>
                        </div>

                        {/* Section 2: Identifiants & Statut */}
                        <div className="bg-gray-50/50 p-4 rounded-xl border border-gray-100">
                            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center">
                                <span className="w-6 h-px bg-gray-200 mr-2"></span>
                                Compte & Sécurité
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="md:col-span-2">
                                    <InputLabel htmlFor="email" value="Email professionnel" />
                                    <TextInput id="email" type="email" className="mt-1 block w-full bg-white" value={data.email} onChange={e => setData('email', e.target.value)} required />
                                    <InputError message={errors.email} className="mt-2" />
                                </div>
                                <div>
                                    <InputLabel htmlFor="statut" value="État du compte" />
                                    <select 
                                        id="statut"
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-ofppt-500 focus:ring-ofppt-500"
                                        value={data.statut}
                                        onChange={e => setData('statut', e.target.value)}
                                    >
                                        <option value="actif">Actif</option>
                                        <option value="inactif">Inactif</option>
                                        <option value="suspendu">Suspendu</option>
                                    </select>
                                </div>

                                <div className="md:col-span-3">
                                    <InputLabel htmlFor="password" value={isEdit ? "Changer le mot de passe (optionnel)" : "Mot de passe initial"} />
                                    <TextInput id="password" type="text" className="mt-1 block w-full bg-white font-mono" value={data.password} onChange={e => setData('password', e.target.value)} required={!isEdit} placeholder={isEdit ? "••••••••" : ""} />
                                    <InputError message={errors.password} className="mt-2" />
                                </div>
                            </div>
                        </div>

                        {/* Section 3: Rôle & Affectation */}
                        <div className="bg-ofppt-50/30 p-4 rounded-xl border border-ofppt-100">
                            <h3 className="text-xs font-bold text-ofppt-400 uppercase tracking-widest mb-4 flex items-center">
                                <span className="w-6 h-px bg-ofppt-200 mr-2"></span>
                                Rôle & Affectation Administrative
                            </h3>
                            
                            <div>
                                <InputLabel htmlFor="role" value="Sélectionnez le rôle principal" className="font-semibold" />
                                <select 
                                    id="role"
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-ofppt-500 focus:ring-ofppt-500"
                                    value={data.roles[0] ? String(data.roles[0]) : ''}
                                    onChange={(e) => setData('roles', [parseInt(e.target.value)])}
                                    required
                                >
                                    <option value="">-- Choisir le rôle --</option>
                                    {roles.map((role: any) => (
                                        <option key={role.id} value={role.id}>{role.libelle}</option>
                                    ))}
                                </select>
                                <InputError message={errors.roles as string} className="mt-2" />
                            </div>

                            {/* Blocs Conditionnels */}
                            <div className="mt-4 space-y-4">
                                {isDR && (
                                    <div className="p-4 border-l-4 border-blue-500 bg-white shadow-sm rounded-r-lg">
                                        <div className="flex items-center gap-2 mb-3">
                                            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                            </div>
                                            <span className="font-bold text-blue-900">Rattaché à la Direction Régionale</span>
                                        </div>
                                        <select 
                                            className="block w-full rounded-md border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                                            value={data.regions[0] ? String(data.regions[0]) : ''}
                                            onChange={e => setData('regions', [parseInt(e.target.value)])}
                                        >
                                            <option value="">Sélectionnez une Région</option>
                                            {regions.map((r: any) => (
                                                <option key={r.id} value={r.id}>{r.nom}</option>
                                            ))}
                                        </select>
                                    </div>
                                )}

                                {isCDC && (
                                    <div className="p-4 border-l-4 border-purple-500 bg-white shadow-sm rounded-r-lg">
                                        <div className="flex items-center gap-2 mb-3">
                                            <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                                            </div>
                                            <span className="font-bold text-purple-900">Responsable du Centre national (CDC)</span>
                                        </div>
                                        <select 
                                            className="block w-full rounded-md border-gray-300 focus:ring-purple-500 focus:border-purple-500"
                                            value={data.cdcs[0] ? String(data.cdcs[0]) : ''}
                                            onChange={e => setData('cdcs', [parseInt(e.target.value)])}
                                        >
                                            <option value="">Sélectionnez un Centre (CDC)</option>
                                            {cdcs.map((c: any) => (
                                                <option key={c.id} value={c.id}>{c.nom} ({c.code})</option>
                                            ))}
                                        </select>
                                    </div>
                                )}

                                {isFormateur && (
                                    <div className="p-4 border-l-4 border-orange-500 bg-white shadow-sm rounded-r-lg">
                                        <div className="flex items-center gap-2 mb-3">
                                            <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                                            </div>
                                            <span className="font-bold text-orange-900">Spécialité & Lieu physique</span>
                                        </div>
                                        
                                        <div className="space-y-4">
                                            <select 
                                                className="block w-full rounded-md border-gray-300 focus:ring-orange-500 focus:border-orange-500"
                                                value={data.secteurs[0] ? String(data.secteurs[0]) : ''}
                                                onChange={e => setData('secteurs', [parseInt(e.target.value)])}
                                            >
                                                <option value="">Sélectionnez le Métier / Secteur</option>
                                                {secteurs.map((s: any) => (
                                                    <option key={s.id} value={s.id}>{s.nom}</option>
                                                ))}
                                            </select>

                                            <div className="flex items-center gap-4 py-2 border-t border-gray-100">
                                                <label className="flex items-center">
                                                    <Checkbox checked={data.is_externe} onChange={e => setData('is_externe', e.target.checked)} />
                                                    <span className="ml-2 text-sm text-gray-600">Formateur Externe</span>
                                                </label>
                                            </div>

                                            {!data.is_externe && (
                                                <select 
                                                    className="block w-full rounded-md border-gray-300 focus:ring-orange-500 focus:border-orange-500"
                                                    value={data.instituts[0] ? String(data.instituts[0]) : ''}
                                                    onChange={e => setData('instituts', [parseInt(e.target.value)])}
                                                >
                                                    <option value="">Sélectionnez l'Institut de rattachement</option>
                                                    {instituts.map((inst: any) => (
                                                        <option key={inst.id} value={inst.id}>{inst.nom}</option>
                                                    ))}
                                                </select>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Fixe */}
                <div className="p-6 border-t border-gray-100 flex justify-end gap-3 bg-gray-50/50">
                    <SecondaryButton onClick={onClose} className="px-6 py-2.5">Annuler</SecondaryButton>
                    <PrimaryButton disabled={processing} className="px-8 py-2.5 bg-ofppt-600 hover:bg-ofppt-700">
                        {isEdit ? 'Enregistrer les modifications' : 'Créer l\'utilisateur'} 
                    </PrimaryButton>
                </div>
            </form>
        </Modal>
    );
}

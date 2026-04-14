import { useState, useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import Modal from '@/Components/Modal';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import Checkbox from '@/Components/Checkbox';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';

export default function UserModal({ isOpen, onClose, user, roles, regions, instituts }: any) {
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

    const needsRegion = hasRole('DR') || hasRole('CDC');
    const isFormateur = hasRole('FORMATEUR');

    const handleRoleChange = (roleId: number, checked: boolean) => {
        if (checked) {
            setData('roles', [...data.roles, roleId]);
        } else {
            setData('roles', data.roles.filter((id: number) => id !== roleId));
        }
    };

    return (
        <Modal show={isOpen} onClose={onClose} maxWidth="2xl">
            <form onSubmit={handleSubmit} className="p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-6">
                    {isEdit ? 'Modifier l\'utilisateur' : 'Créer un nouvel utilisateur'}
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Identité */}
                    <div>
                        <InputLabel htmlFor="prenom" value="Prénom" />
                        <TextInput id="prenom" className="mt-1 block w-full" value={data.prenom} onChange={e => setData('prenom', e.target.value)} required />
                        <InputError message={errors.prenom} className="mt-2" />
                    </div>
                    <div>
                        <InputLabel htmlFor="nom" value="Nom" />
                        <TextInput id="nom" className="mt-1 block w-full" value={data.nom} onChange={e => setData('nom', e.target.value)} required />
                        <InputError message={errors.nom} className="mt-2" />
                    </div>

                    <div className="md:col-span-2">
                        <InputLabel htmlFor="email" value="Email professionnel" />
                        <TextInput id="email" type="email" className="mt-1 block w-full" value={data.email} onChange={e => setData('email', e.target.value)} required />
                        <InputError message={errors.email} className="mt-2" />
                    </div>

                    {!isEdit && (
                        <div className="md:col-span-2">
                            <InputLabel htmlFor="password" value="Mot de passe initial" />
                            <TextInput id="password" type="text" className="mt-1 block w-full" value={data.password} onChange={e => setData('password', e.target.value)} required={!isEdit} />
                            <InputError message={errors.password} className="mt-2" />
                            <p className="text-xs text-gray-500 mt-1">L'utilisateur devra changer son mot de passe lors de sa première connexion.</p>
                        </div>
                    )}
                    
                    {isEdit && (
                        <div className="md:col-span-2">
                            <InputLabel htmlFor="password" value="Nouveau mot de passe (laisser vide pour ne pas modifier)" />
                            <TextInput id="password" type="text" className="mt-1 block w-full" value={data.password} onChange={e => setData('password', e.target.value)} />
                            <InputError message={errors.password} className="mt-2" />
                        </div>
                    )}

                    {/* Statut & Roles */}
                    <div className="md:col-span-2 mt-4 pt-4 border-t border-gray-100">
                        <h3 className="text-sm font-semibold text-gray-700 mb-3">Rôles et Accès</h3>
                        <div className="flex flex-wrap gap-4">
                            {roles.map((role: any) => (
                                <label key={role.id} className="flex items-center">
                                    <Checkbox 
                                        checked={data.roles.includes(role.id)}
                                        onChange={(e) => handleRoleChange(role.id, e.target.checked)}
                                    />
                                    <span className="ms-2 text-sm text-gray-600">{role.libelle}</span>
                                </label>
                            ))}
                        </div>
                        <InputError message={errors.roles as string} className="mt-2" />
                    </div>

                    {/* Conditional Logic */}
                    {needsRegion && (
                        <div className="md:col-span-2 p-4 bg-blue-50 rounded-lg border border-blue-100 mt-2">
                            <InputLabel value="A quelle(s) région(s) ce DR/CDC est-il affecté ?" className="text-blue-900" />
                            <select 
                                multiple 
                                className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-ofppt-500 focus:ring-ofppt-500 sm:text-sm h-32"
                                value={data.regions.map(String)}
                                onChange={e => {
                                    const options = Array.from(e.target.selectedOptions);
                                    setData('regions', options.map(o => parseInt(o.value)));
                                }}
                            >
                                {regions.map((r: any) => (
                                    <option key={r.id} value={r.id}>{r.nom}</option>
                                ))}
                            </select>
                            <p className="text-xs text-blue-600 mt-1">Maintenez CTRL cliqué pour sélectionner plusieurs régions si besoin.</p>
                        </div>
                    )}

                    {isFormateur && (
                        <div className="md:col-span-2 p-4 bg-gray-50 rounded-lg border border-gray-200 mt-2">
                            <label className="flex items-center mb-4">
                                <Checkbox 
                                    checked={data.is_externe}
                                    onChange={(e) => {
                                        setData('is_externe', e.target.checked);
                                        if (e.target.checked) setData('instituts', []); // Reset instituts if external
                                    }}
                                />
                                <span className="ms-2 text-sm font-medium text-orange-600">Il s'agit d'un Formateur Externe (Hors OFPPT)</span>
                            </label>

                            {!data.is_externe && (
                                <div>
                                    <InputLabel value="Institut(s) de rattachement" />
                                    <div className="max-h-40 overflow-y-auto mt-2 border border-gray-300 rounded-md p-2 bg-white">
                                        {instituts.length === 0 ? (
                                            <p className="text-sm text-gray-500 italic p-2">Aucun institut créé dans la base de données.</p>
                                        ) : (
                                            instituts.map((inst: any) => (
                                                <label key={inst.id} className="flex items-center py-1">
                                                    <Checkbox 
                                                        checked={data.instituts.includes(inst.id)}
                                                        onChange={(e) => {
                                                            if (e.target.checked) {
                                                                setData('instituts', [...data.instituts, inst.id]);
                                                            } else {
                                                                setData('instituts', data.instituts.filter((id) => id !== inst.id));
                                                            }
                                                        }}
                                                    />
                                                    <span className="ms-2 text-xs text-gray-700">{inst.nom} ({inst.code || 'Sans code'})</span>
                                                </label>
                                            ))
                                        )}
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1">Un formateur interne peut enseigner dans plusieurs établissements.</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <div className="mt-6 flex justify-end gap-3 border-t border-gray-100 pt-4">
                    <SecondaryButton onClick={onClose}>Annuler</SecondaryButton>
                    <PrimaryButton disabled={processing}>
                        {isEdit ? 'Enregistrer' : 'Créer'} 
                    </PrimaryButton>
                </div>
            </form>
        </Modal>
    );
}

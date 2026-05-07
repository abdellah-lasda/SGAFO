import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { Building2, Users, MapPin, Phone, Info } from 'lucide-react';

interface Institut {
    id: number;
    nom: string;
    code: string;
    ville: string;
    adresse: string;
    formateurs_count: number;
}

interface Props {
    instituts: Institut[];
}

export default function Index({ instituts }: Props) {
    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center gap-2 text-sm">
                    <span className="font-black text-slate-900 uppercase tracking-widest text-[11px]">Répertoire des Établissements</span>
                </div>
            }
        >
            <Head title="Répertoire des Établissements" />

            <div className="max-w-[1600px] mx-auto p-6 space-y-8 pb-32">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 italic mb-2">Répertoire Régional</h1>
                    <p className="text-slate-500 font-medium">Consultez la liste des établissements de formation professionnelle de votre région</p>
                </div>

                <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] bg-slate-50/30">
                                    <th className="px-8 py-5">Établissement</th>
                                    <th className="px-8 py-5">Localisation</th>
                                    <th className="px-8 py-5">Effectif</th>
                                    <th className="px-8 py-5 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {instituts.map((inst) => (
                                    <tr key={inst.id} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-white transition-all">
                                                    <Building2 className="w-6 h-6" />
                                                </div>
                                                <div>
                                                    <h3 className="text-sm font-black text-slate-900">{inst.nom}</h3>
                                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{inst.code}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-2 text-slate-600">
                                                <MapPin className="w-4 h-4 text-emerald-500" />
                                                <span className="text-sm font-bold">{inst.ville}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-2 text-slate-500">
                                                <Users className="w-4 h-4 text-slate-400" />
                                                <span className="text-sm font-black text-slate-900">{inst.formateurs_count} <span className="font-medium text-slate-400">formateurs</span></span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <Link 
                                                href={route('dr.formateurs.index', { search: inst.nom })}
                                                className="inline-flex items-center gap-2 px-6 py-2.5 bg-slate-50 text-slate-900 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all shadow-sm"
                                            >
                                                Voir Formateurs
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {instituts.length === 0 && (
                    <div className="text-center py-20 bg-slate-50/50 rounded-[3rem] border-2 border-dashed border-slate-200">
                        <Building2 className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                        <h3 className="text-xl font-black text-slate-900 italic">Aucun établissement répertorié</h3>
                        <p className="text-slate-500 font-medium">Cette région ne semble pas encore avoir d'instituts rattachés.</p>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}

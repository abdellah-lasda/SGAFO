import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router, useForm } from '@inertiajs/react';
import {
    Award, CheckCircle, Clock, Sparkles, Building2,
    Users, ChevronRight, Save, Play, FileText,
    ArrowLeft, HelpCircle, Code, Settings, Eye, Check, Cpu, Send
} from 'lucide-react';
import { useState } from 'react';
import { motion } from 'framer-motion';

interface UserRow {
    id: number;
    nom_complet: string;
    email: string;
    has_attestation: boolean;
}

interface Props {
    plan: {
        id: number;
        titre: string;
        statut: string;
        date_debut: string;
        date_fin: string;
        entite: string;
        duree_heures: number;
        nom_rf: string;
    };
    participants: UserRow[];
    animateurs: UserRow[];
    templates: {
        participant: { html: string; css: string };
        animateur: { html: string; css: string };
    };
    already_generated: boolean;
}

const TEMPLATE_DESIGNS = [
    {
        key: 'royal',
        name: 'Classique Royal',
        desc: 'Bleu Royal officiel, doubles bordures dorées et sceaux traditionnels.',
        gradient: 'from-blue-900 via-blue-800 to-amber-700',
        badgeColor: 'bg-amber-500 text-white',
        borderStyle: 'border-amber-400'
    },
    {
        key: 'emerald',
        name: 'Moderne Émeraude',
        desc: 'Vert émeraude luxueux, lignes épurées et design contemporain.',
        gradient: 'from-emerald-950 via-emerald-800 to-emerald-600',
        badgeColor: 'bg-emerald-500 text-white',
        borderStyle: 'border-emerald-500'
    },
    {
        key: 'minimalist',
        name: 'Chic Minimaliste',
        desc: 'Bordures fines fusain, typographies de luxe et espaces aérés raffinés.',
        gradient: 'from-slate-900 via-slate-800 to-slate-700',
        badgeColor: 'bg-slate-900 text-white',
        borderStyle: 'border-slate-800'
    },
    {
        key: 'indigo',
        name: 'Technologique Indigo',
        desc: 'Fond sombre cyberpunk, dégradés néon indigo et badges numériques.',
        gradient: 'from-indigo-950 via-indigo-900 to-purple-800',
        badgeColor: 'bg-indigo-600 text-white',
        borderStyle: 'border-indigo-500'
    }
];

export default function AttestationIndex({ plan, participants, animateurs, templates, already_generated }: Props) {
    const [activeTab, setActiveTab] = useState<'participant' | 'animateur'>('participant');
    const [selectedTemplateKey, setSelectedTemplateKey] = useState<{ participant: string; animateur: string }>({
        participant: 'royal',
        animateur: 'royal'
    });
    const [expertMode, setExpertMode] = useState(false);

    // Form for custom HTML/CSS editing
    const participantForm = useForm({
        type: 'participant',
        key: '',
        html_content: templates.participant.html,
        css_content: templates.participant.css,
    });

    const animateurForm = useForm({
        type: 'animateur',
        key: '',
        html_content: templates.animateur.html,
        css_content: templates.animateur.css,
    });

    const [isGenerating, setIsGenerating] = useState(false);

    // Apply template choice
    const handleSelectTemplate = (type: 'participant' | 'animateur', key: string) => {
        setSelectedTemplateKey(prev => ({ ...prev, [type]: key }));
        const form = type === 'participant' ? participantForm : animateurForm;
        form.setData('key', key);
    };

    // Save Selection / Edits
    const handleSave = (type: 'participant' | 'animateur') => {
        const form = type === 'participant' ? participantForm : animateurForm;
        form.post(route('admin.attestations.save-template', plan.id), {
            preserveScroll: true,
            onSuccess: () => {
                alert('Modèle enregistré avec succès ! Vous pouvez passer à l\'étape 2.');
            }
        });
    };

    // Test specific design
    const handleTest = (type: 'participant' | 'animateur', designKey?: string) => {
        const form = type === 'participant' ? participantForm : animateurForm;
        const keyToUse = designKey || selectedTemplateKey[type];

        const hiddenForm = document.createElement('form');
        hiddenForm.method = 'POST';
        hiddenForm.action = route('admin.attestations.test-template', plan.id);
        hiddenForm.target = '_blank';

        const csrfToken = (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || '';
        const csrfInput = document.createElement('input');
        csrfInput.type = 'hidden';
        csrfInput.name = '_token';
        csrfInput.value = csrfToken;
        hiddenForm.appendChild(csrfInput);

        const typeInput = document.createElement('input');
        typeInput.type = 'hidden';
        typeInput.name = 'type';
        typeInput.value = type;
        hiddenForm.appendChild(typeInput);

        const keyInput = document.createElement('input');
        keyInput.type = 'hidden';
        keyInput.name = 'key';
        keyInput.value = expertMode ? '' : keyToUse;
        hiddenForm.appendChild(keyInput);

        if (expertMode) {
            const htmlInput = document.createElement('input');
            htmlInput.type = 'hidden';
            htmlInput.name = 'html_content';
            htmlInput.value = form.data.html_content;
            hiddenForm.appendChild(htmlInput);

            const cssInput = document.createElement('input');
            cssInput.type = 'hidden';
            cssInput.name = 'css_content';
            cssInput.value = form.data.css_content;
            hiddenForm.appendChild(cssInput);
        }

        document.body.appendChild(hiddenForm);
        hiddenForm.submit();
        document.body.removeChild(hiddenForm);
    };

    // Generate all
    const handleGenerateAll = () => {
        if (confirm('Voulez-vous générer et envoyer toutes les attestations pour cette formation ? Chaque bénéficiaire recevra son attestation par mail et notification.')) {
            setIsGenerating(true);
            router.post(route('admin.attestations.generate', plan.id), {}, {
                onFinish: () => setIsGenerating(false)
            });
        }
    };

    const activeForm = activeTab === 'participant' ? participantForm : animateurForm;
    const currentSelectedKey = selectedTemplateKey[activeTab];

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center gap-2 text-sm text-slate-500">
                    <Link href={route('admin.attestations.list')} className="hover:text-blue-600">
                        Attestations
                    </Link>
                    <ChevronRight className="w-4 h-4" />
                    <span className="text-slate-900 font-semibold">{plan.titre}</span>
                </div>
            }
        >
            <Head title={`Modèles d'Attestations — ${plan.titre}`} />

            <div className="min-h-screen bg-slate-50/50 p-6 lg:p-10">
                <div className="max-w-6xl mx-auto space-y-8">
                    
                    {/* Top Back Action */}
                    <div className="flex items-center justify-between">
                        <Link
                            href={route('admin.attestations.list')}
                            className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-500 hover:text-slate-900 transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4" /> Retour à la liste
                        </Link>
                    </div>

                    {/* Plan Details Summary */}
                    <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-50/50 rounded-full -mr-16 -mt-16" />
                        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                            <div className="space-y-2">
                                <span className="px-2.5 py-1 bg-amber-100 text-amber-800 text-[10px] font-black uppercase tracking-widest rounded-md">
                                    Formation Validée
                                </span>
                                <h1 className="text-xl font-black text-slate-900 tracking-tight">{plan.titre}</h1>
                                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 font-medium">
                                    <span className="flex items-center gap-1.5"><Building2 className="w-4 h-4" /> {plan.entite}</span>
                                    <span>•</span>
                                    <span>Période : <strong>{plan.date_debut}</strong> au <strong>{plan.date_fin}</strong></span>
                                    <span>•</span>
                                    <span>Volume : <strong>{plan.duree_heures} heures</strong></span>
                                </div>
                            </div>

                            <div className="flex items-center gap-6 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                <div className="text-center">
                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Participants</p>
                                    <p className="text-lg font-black text-slate-800">{participants.length}</p>
                                </div>
                                <div className="w-px h-8 bg-slate-200" />
                                <div className="text-center">
                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Animateurs</p>
                                    <p className="text-lg font-black text-slate-800">{animateurs.length}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Step Visual Flow Progress */}
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
                        <div className="flex items-center gap-3">
                            <span className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-black">1</span>
                            <div>
                                <p className="text-xs font-black text-slate-900">Étape 1 : Choix des Modèles</p>
                                <p className="text-[10px] text-slate-400 font-medium">Sélectionner et tester les templates</p>
                            </div>
                        </div>
                        <div className="hidden md:block w-12 h-px bg-slate-200" />
                        <div className="flex items-center gap-3">
                            <span className="w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center text-xs font-black">2</span>
                            <div>
                                <p className="text-xs font-black text-slate-900">Étape 2 : Destinataires & Envoi</p>
                                <p className="text-[10px] text-slate-400 font-medium">Générer les PDFs et notifier les bénéficiaires</p>
                            </div>
                        </div>
                    </div>

                    {/* STEP 1: TEMPLATE CHOOSER */}
                    <div className="bg-white rounded-3xl border-2 border-blue-600 shadow-sm overflow-hidden">
                        <div className="px-6 py-5 border-b border-slate-100 bg-blue-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2">
                                    <span className="px-2 py-0.5 bg-blue-600 text-white text-[9px] font-black rounded-md uppercase tracking-wider">
                                        Étape 1
                                    </span>
                                    <h3 className="text-sm font-black text-slate-900">Choix du Modèle Graphique</h3>
                                </div>
                                
                                <button
                                    onClick={() => setExpertMode(!expertMode)}
                                    className={`px-3 py-1 rounded-md text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-1.5 ${
                                        expertMode 
                                            ? 'bg-purple-100 text-purple-700 border border-purple-200' 
                                            : 'bg-slate-100 text-slate-500 border border-slate-200 hover:text-slate-900'
                                    }`}
                                >
                                    <Cpu className="w-3.5 h-3.5" /> Personnaliser le code
                                </button>
                            </div>
                            
                            <div className="flex rounded-lg bg-slate-200/60 p-1 border border-slate-200">
                                <button
                                    onClick={() => setActiveTab('participant')}
                                    className={`px-4 py-1.5 rounded-md text-xs font-black uppercase tracking-wider transition-all ${
                                        activeTab === 'participant'
                                            ? 'bg-white text-slate-900 shadow-sm'
                                            : 'text-slate-500 hover:text-slate-900'
                                    }`}
                                >
                                    Modèle Participants
                                </button>
                                <button
                                    onClick={() => setActiveTab('animateur')}
                                    className={`px-4 py-1.5 rounded-md text-xs font-black uppercase tracking-wider transition-all ${
                                        activeTab === 'animateur'
                                            ? 'bg-white text-slate-900 shadow-sm'
                                            : 'text-slate-500 hover:text-slate-900'
                                    }`}
                                >
                                    Modèle Animateurs
                                </button>
                            </div>
                        </div>

                        {!expertMode ? (
                            <div className="p-6 space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {TEMPLATE_DESIGNS.map((design) => {
                                        const isSelected = currentSelectedKey === design.key;
                                        return (
                                            <div
                                                key={design.key}
                                                onClick={() => handleSelectTemplate(activeTab, design.key)}
                                                className={`group relative rounded-3xl overflow-hidden border-2 cursor-pointer transition-all duration-300 ${
                                                    isSelected 
                                                        ? 'border-blue-600 shadow-lg shadow-blue-500/10 scale-[1.01]' 
                                                        : 'border-slate-200 hover:border-slate-300 hover:scale-[1.005]'
                                                }`}
                                            >
                                                <div className={`h-24 bg-gradient-to-r ${design.gradient} p-4 flex flex-col justify-between relative`}>
                                                    <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest w-fit ${design.badgeColor}`}>
                                                        {design.key === 'indigo' ? 'Digital Tech' : design.key === 'minimalist' ? 'Minimal' : 'Official'}
                                                    </span>
                                                    
                                                    {isSelected && (
                                                        <div className="absolute top-4 right-4 bg-blue-600 text-white p-1 rounded-full">
                                                            <Check className="w-4 h-4" />
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="p-5 space-y-2 bg-white">
                                                    <h4 className="text-sm font-black text-slate-900">{design.name}</h4>
                                                    <p className="text-xs text-slate-400 font-medium leading-relaxed">{design.desc}</p>
                                                    
                                                    <div className="pt-3 flex items-center justify-between border-t border-slate-50">
                                                        <span className="text-[10px] font-bold text-slate-400">Format A4</span>
                                                        <button
                                                            type="button"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleTest(activeTab, design.key);
                                                            }}
                                                            className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-slate-600 hover:text-slate-900"
                                                        >
                                                            <Play className="w-3.5 h-3.5 text-blue-500" /> Tester & Voir le rendu (PDF)
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                <div className="flex gap-4 pt-4 border-t border-slate-100">
                                    <button
                                        onClick={() => handleSave(activeTab)}
                                        className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3.5 bg-blue-600 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-blue-500 transition-all shadow-md active:scale-95"
                                    >
                                        <Save className="w-4 h-4" />
                                        Valider et Sauvegarder ce modèle
                                    </button>
                                </div>
                            </div>
                        ) : (
                            /* Expert HTML/CSS Editor Mode */
                            <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
                                <div className="lg:col-span-2 space-y-6">
                                    <div>
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">
                                            Structure HTML
                                        </label>
                                        <textarea
                                            value={activeForm.data.html_content}
                                            onChange={(e) => activeForm.setData('html_content', e.target.value)}
                                            rows={12}
                                            className="w-full font-mono text-xs p-4 bg-slate-900 text-slate-200 rounded-2xl leading-relaxed resize-y"
                                        />
                                    </div>

                                    <div>
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">
                                            Styles personnalisés (CSS)
                                        </label>
                                        <textarea
                                            value={activeForm.data.css_content}
                                            onChange={(e) => activeForm.setData('css_content', e.target.value)}
                                            rows={8}
                                            className="w-full font-mono text-xs p-4 bg-slate-900 text-slate-200 rounded-2xl leading-relaxed resize-y"
                                        />
                                    </div>

                                    <div className="flex gap-4">
                                        <button
                                            onClick={() => handleSave(activeTab)}
                                            className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3.5 bg-blue-600 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-blue-500 transition-all shadow-md active:scale-95"
                                        >
                                            <Save className="w-4 h-4" /> Sauvegarder le code
                                        </button>
                                        <button
                                            onClick={() => handleTest(activeTab)}
                                            className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3.5 bg-slate-900 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-slate-800 transition-all active:scale-95"
                                        >
                                            <Play className="w-4 h-4" /> Tester le rendu (PDF)
                                        </button>
                                    </div>
                                </div>

                                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200/60 space-y-4">
                                    <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                                        <HelpCircle className="w-4 h-4 text-blue-500" />
                                        Balises dynamiques
                                    </h4>
                                    <p className="text-xs text-slate-400 font-medium leading-relaxed">
                                        Copiez ces variables et insérez-les dans votre structure HTML :
                                    </p>
                                    <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
                                        {[
                                            { code: '{{nom_complet}}', desc: 'Nom complet' },
                                            { code: '{{titre_formation}}', desc: 'Titre de formation' },
                                            { code: '{{date_debut}}', desc: 'Date début' },
                                            { code: '{{date_fin}}', desc: 'Date fin' },
                                            { code: '{{duree_heures}}', desc: 'Volume horaire' },
                                            { code: '{{entite}}', desc: 'Établissement' },
                                            { code: '{{nom_rf}}', desc: 'Nom du RF' },
                                            { code: '{{reference}}', desc: 'Référence unique' },
                                            { code: '{{date_emission}}', desc: "Date d'émission" },
                                        ].map((v) => (
                                            <div key={v.code} className="p-2.5 bg-white border border-slate-200 rounded-lg">
                                                <span className="font-mono text-xs font-black text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">
                                                    {v.code}
                                                </span>
                                                <p className="text-[10px] text-slate-400 font-bold mt-1">{v.desc}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* STEP 2: RECIPIENTS & GENERATE */}
                    <div className="bg-white rounded-3xl border-2 border-orange-500 shadow-sm overflow-hidden">
                        <div className="px-6 py-5 border-b border-slate-100 bg-orange-50/50 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <span className="px-2 py-0.5 bg-orange-500 text-white text-[9px] font-black rounded-md uppercase tracking-wider">
                                    Étape 2
                                </span>
                                <h3 className="text-sm font-black text-slate-900">Destinataires & Envoi</h3>
                            </div>

                            <button
                                onClick={handleGenerateAll}
                                disabled={isGenerating}
                                className="inline-flex items-center gap-2 px-5 py-2.5 bg-orange-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-orange-700 transition-all active:scale-95"
                            >
                                <Send className="w-3.5 h-3.5" />
                                {isGenerating ? 'Envoi...' : 'Générer & Envoyer'}
                            </button>
                        </div>

                        <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* Participants List */}
                            <div className="border border-slate-200/80 rounded-2xl overflow-hidden">
                                <div className="px-4 py-3 bg-slate-50/50 border-b border-slate-100 flex items-center justify-between">
                                    <h4 className="text-xs font-black text-slate-950 uppercase tracking-wider flex items-center gap-1.5">
                                        <Users className="w-4 h-4 text-emerald-500" />
                                        Participants ({participants.length})
                                    </h4>
                                </div>
                                <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto">
                                    {participants.map((p) => (
                                        <div key={p.id} className="p-3.5 flex items-center justify-between hover:bg-slate-50/50">
                                            <div>
                                                <p className="text-xs font-black text-slate-800">{p.nom_complet}</p>
                                                <p className="text-[10px] text-slate-400 font-bold">{p.email}</p>
                                            </div>
                                            <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                                                p.has_attestation
                                                    ? 'bg-emerald-100 text-emerald-700'
                                                    : 'bg-slate-100 text-slate-500'
                                            }`}>
                                                {p.has_attestation ? 'Envoyé' : 'En attente'}
                                            </span>
                                        </div>
                                    ))}
                                    {participants.length === 0 && (
                                        <p className="p-8 text-center text-xs font-bold text-slate-400 italic">Aucun participant inscrit.</p>
                                    )}
                                </div>
                            </div>

                            {/* Animateurs List */}
                            <div className="border border-slate-200/80 rounded-2xl overflow-hidden">
                                <div className="px-4 py-3 bg-slate-50/50 border-b border-slate-100 flex items-center justify-between">
                                    <h4 className="text-xs font-black text-slate-950 uppercase tracking-wider flex items-center gap-1.5">
                                        <Award className="w-4 h-4 text-indigo-500" />
                                        Animateurs ({animateurs.length})
                                    </h4>
                                </div>
                                <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto">
                                    {animateurs.map((a) => (
                                        <div key={a.id} className="p-3.5 flex items-center justify-between hover:bg-slate-50/50">
                                            <div>
                                                <p className="text-xs font-black text-slate-800">{a.nom_complet}</p>
                                                <p className="text-[10px] text-slate-400 font-bold">{a.email}</p>
                                            </div>
                                            <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                                                a.has_attestation
                                                    ? 'bg-emerald-100 text-emerald-700'
                                                    : 'bg-slate-100 text-slate-500'
                                            }`}>
                                                {a.has_attestation ? 'Envoyé' : 'En attente'}
                                            </span>
                                        </div>
                                    ))}
                                    {animateurs.length === 0 && (
                                        <p className="p-8 text-center text-xs font-bold text-slate-400 italic">Aucun animateur assigné.</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}

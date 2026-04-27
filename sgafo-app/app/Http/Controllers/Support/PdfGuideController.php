<?php

namespace App\Http\Controllers\Support;

use App\Http\Controllers\Controller;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;

class PdfGuideController extends Controller
{
    public function download()
    {
        $docs = [
            'introduction' => [
                'title' => "Introduction & Vision",
                'content' => "Le Système de Gestion de l'Apprentissage et de la Formation Continue (SGAFO) est l'outil central de digitalisation du workflow de formation au sein de l'OFPPT. Il permet de fluidifier les échanges entre les Directions Régionales, les Complexes de Formation et les Formateurs.",
                'steps' => [
                    "Centralisation du catalogue national pour une meilleure visibilité",
                    "Automatisation de la planification logistique et des réservations",
                    "Suivi pédagogique en temps réel et évaluation par QCM",
                    "Dématérialisation des feuilles d'émargement et des attestations"
                ]
            ],
            'cdc' => [
                'title' => "Guide Chef de Complexe (CDC)",
                'content' => "En tant que CDC, vous êtes le garant de l'ingénierie et de la planification opérationnelle des formations de votre complexe.",
                'sections' => [
                    [
                        'subtitle' => "1. Initialisation du Plan de Formation",
                        'text' => "Depuis votre dashboard, cliquez sur 'Nouveau Plan'. Saisissez l'entité bénéficiaire, le titre du plan et les dates globales prévisionnelles. Un plan commence toujours à l'état 'Brouillon'."
                    ],
                    [
                        'subtitle' => "2. Ingénierie des Thèmes (Modules)",
                        'text' => "Ajoutez chaque module en précisant le volume horaire, les objectifs SMART et les animateurs pressentis. Le système vérifie en temps réel que l'animateur n'a pas d'autre séance programmée sur la même période."
                    ],
                    [
                        'subtitle' => "3. Gestion des Participants",
                        'text' => "Sélectionnez les formateurs participants. Vous pouvez filtrer par établissement, spécialité ou secteur. Le système bloquera l'ajout si le participant dépasse son quota d'heures annuel de formation."
                    ],
                    [
                        'subtitle' => "4. Réservation Logistique",
                        'text' => "Une fois le plan 'Soumis', vous devez finaliser la logistique : choix du site de formation (Interne/Externe) et sélection des hôtels partenaires pour les participants venant hors-ville."
                    ]
                ]
            ],
            'rf' => [
                'title' => "Guide Responsable Formation (RF)",
                'content' => "Le RF (Direction Régionale) assure le pilotage stratégique et la validation finale des plans au niveau régional.",
                'sections' => [
                    [
                        'subtitle' => "1. Validation Administrative (Confirmation)",
                        'text' => "Examinez les plans soumis par les CDC. Vérifiez l'adéquation avec le plan de développement régional. Si conforme, passez le statut à 'Confirmé'. En cas de rejet, saisissez un motif précis pour guider le CDC."
                    ],
                    [
                        'subtitle' => "2. Validation Technique (Mise en Production)",
                        'text' => "Après confirmation, le plan doit être planifié (séances). Une fois le planning complet, le RF effectue la validation finale pour injection dans le Catalogue National et ouverture des sessions."
                    ],
                    [
                        'subtitle' => "3. Pilotage & Tableaux de Bord",
                        'text' => "Utilisez l'onglet 'Pilotage' pour suivre le taux de réalisation des formations, le budget consommé (hôtellerie/transport) et le taux de satisfaction des participants."
                    ]
                ]
            ],
            'animateur' => [
                'title' => "Guide Animateur (Expert)",
                'content' => "L'animateur est un expert métier chargé de la transmission des compétences lors des sessions de formation.",
                'sections' => [
                    [
                        'subtitle' => "1. Préparation Pédagogique",
                        'text' => "Accédez à vos thèmes assignés et déposez vos ressources (PDF, supports, liens). Ces documents seront visibles par les participants inscrits à vos modules."
                    ],
                    [
                        'subtitle' => "2. Gestion des Séances & Émargement",
                        'text' => "Pour chaque séance, validez la présence numérique des participants. En fin de module, vous devez confirmer l'assiduité pour permettre la génération des attestations."
                    ],
                    [
                        'subtitle' => "3. Rapport d'Animation",
                        'text' => "Après la clôture d'un module, saisissez votre bilan pédagogique : points forts, difficultés rencontrées et recommandations pour les sessions futures."
                    ]
                ]
            ],
            'participant' => [
                'title' => "Guide Participant (Apprenant)",
                'content' => "Le participant utilise le système pour suivre son parcours de montée en compétences et accéder aux ressources.",
                'sections' => [
                    [
                        'subtitle' => "1. Consultation du Catalogue National",
                        'text' => "Découvrez l'offre de formation disponible. Vous pouvez consulter les programmes validés et voir les dates prévues pour les prochaines sessions."
                    ],
                    [
                        'subtitle' => "2. Évaluations & QCM",
                        'text' => "Répondez aux tests de positionnement avant le démarrage et passez l'évaluation finale. Vos scores sont enregistrés dans votre dossier de formation personnel."
                    ],
                    [
                        'subtitle' => "3. Documents & Attestations",
                        'text' => "Téléchargez vos attestations de réussite une fois la formation clôturée. Vous avez également accès à l'historique complet de vos formations passées."
                    ]
                ]
            ]
        ];

        $pdf = Pdf::loadView('pdf.guide', compact('docs'));
        
        return $pdf->download('guide_integral_sgafo.pdf');
    }
}

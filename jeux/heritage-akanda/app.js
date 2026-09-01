// ========================================================
// 1. ÉTAT DU JEU & INVENTAIRE
// ========================================================
let inventaire = [];
let musiqueActive = false;

const bgMusic = document.getElementById("bg-music");
const musicToggleBtn = document.getElementById("music-toggle-btn");

if (musicToggleBtn && bgMusic) {
  musicToggleBtn.addEventListener("click", () => {
    if (musiqueActive) {
      bgMusic.pause();
      musicToggleBtn.textContent = "🎵 Musique : OFF";
      musiqueActive = false;
    } else {
      bgMusic.play().then(() => {
        musicToggleBtn.textContent = "🎵 Musique : ON";
        musiqueActive = true;
      }).catch(err => console.log("Erreur audio :", err));
    }
  });
}

function ajouterIndice(indice) {
  if (!inventaire.includes(indice)) {
    inventaire.push(indice);
    mettreAJourInventaireUI();
  }
}

function possedeIndice(indice) {
  return inventaire.includes(indice);
}

function reinitialiserInventaire() {
  inventaire = [];
  mettreAJourInventaireUI();
}

function mettreAJourInventaireUI() {
  const listeInventaire = document.getElementById("inventory-list");
  const indicesCount = document.getElementById("indices-count");

  if (indicesCount) indicesCount.textContent = inventaire.length;
  if (!listeInventaire) return;

  listeInventaire.innerHTML = "";
  if (inventaire.length === 0) {
    listeInventaire.innerHTML = '<li class="empty">Aucun indice collecté pour l\'instant.</li>';
  } else {
    inventaire.forEach((item) => {
      const li = document.createElement("li");
      li.textContent = item;
      listeInventaire.appendChild(li);
    });
  }
}

function recommencerJeu() {
  reinitialiserInventaire();
  chargerNoeud("depart");
}

// ========================================================
// 2. SCÉNARIO GLOBAL DES ENQUÊTES
// ========================================================
const histoire = {

  // ======================================================
  // ENQUÊTE N°1 : LE MASQUE MBOULI
  // ======================================================

  // ------------------------------------------------------
  // CHAPITRE 1 : LA SCÈNE DU CRIME AU MUSÉE
  // ------------------------------------------------------
  depart: {
    lieu: "Musée National - Enquête 1/10",
    image: "Inspecteur Ndong.png",
    texte: "08h15 — Musée National du Gabon, Libreville.\n\nLe Masque Mbouli, chef-d'œuvre inestimable du patrimoine, a disparu de sa vitrine pendant la nuit. La vitrine n'a pas été brisée : elle a été déverrouillée proprement.\n\nLe conservateur, M. Ondo, est effondré sur une chaise, le visage grave. L'agent de sécurité de nuit, Karl, a abandonné son poste et reste introuvable.",
    choix: [
      { texte: "🗣️ Interroger le conservateur M. Ondo", noeudSuivant: "ondo_intro" },
      { texte: "🔍 Inspecter la vitrine du masque", noeudSuivant: "vitrine_detail" },
      { texte: "📋 Fouiller le bureau des gardiens (poste de Karl)", noeudSuivant: "bureau_karl" },
      { texte: "🚪 Examiner la porte de sortie de secours", noeudSuivant: "sortie_secours" }
    ]
  },

  ondo_intro: {
    lieu: "Musée National",
    image: "M.Ondo.png",
    texte: "M. Ondo s'exprime d'une voix posée mais marquée par la peine : 'Inspecteur Ndong, ce masque est le cœur de notre collection. C'est un sacrilège... J'étais présent hier jusqu'à 22h00 pour consigner le registre d'inventaire avec Karl avant de fermer l'aile principale et de rentrer chez moi à Louis.'",
    choix: [
      { texte: "❓ 'Qui possédait l'accès aux doubles des clés ?'", noeudSuivant: "ondo_cles" },
      { texte: "❓ 'Avez-vous remarqué un comportement étrange chez Karl ?'", noeudSuivant: "ondo_karl_info" },
      { texte: "🔙 Enquêter ailleurs dans la salle", noeudSuivant: "choix_salle_musee" }
    ]
  },

  ondo_cles: {
    lieu: "Musée National",
    image: "M.Ondo.png",
    texte: "M. Ondo : 'Seuls deux doubles existent. Le mien est scellé dans le coffre de la direction. L'autre clé de service est conservée au poste de garde par le veilleur de nuit. Ce matin, le coffre du poste de garde était ouvert sans trace d'effraction.'",
    choix: [
      { 
        texte: "📝 Noter l'utilisation de la clé de service du garde", 
        action: () => ajouterIndice("Indice : Clé de service du garde utilisée sans effraction"),
        noeudSuivant: "ondo_intro" 
      }
    ]
  },

  ondo_karl_info: {
    lieu: "Musée National",
    image: "M.Ondo.png",
    texte: "M. Ondo réfléchit : 'Karl était un employé dévoué, mais ces derniers temps, il avait des fréquentations douteuses à Nkembo. Il recevait aussi de nombreux appels masqués.'",
    choix: [
      { 
        texte: "📝 Noter la piste du quartier Nkembo", 
        action: () => ajouterIndice("Piste : Karl fréquente le quartier Nkembo"),
        noeudSuivant: "ondo_intro" 
      }
    ]
  },

  vitrine_detail: {
    lieu: "Musée National",
    image: "Inspecteur Ndong.png",
    texte: "La serrure de la vitrine est intacte. Au sol, sous le socle, votre lampe de poche révèle une fine pellicule de poussière de charbon et une trace d'argile séchée laissée par une semelle de botte de travail.",
    choix: [
      { 
        texte: "🧪 Prélever la trace d'argile et de charbon", 
        action: () => ajouterIndice("Preuve : Traces d'argile et poussière de charbon au sol"),
        noeudSuivant: "choix_salle_musee" 
      }
    ]
  },

  bureau_karl: {
    lieu: "Musée National",
    image: "Inspecteur Ndong.png",
    texte: "Sur le bureau de Karl, le registre des présences confirme la signature de M. Ondo à 22h00. Dans le dossier du personnel déposé dans le tiroir, la fiche de Karl indique son adresse résidentielle : **Quartier Kinguélé, impasse 4**.\n\nDans la corbeille, un morceau de papier déchiré porte une inscription manuscrite.",
    choix: [
      { 
        texte: "📝 Récupérer l'adresse de Karl (Kinguélé)", 
        action: () => ajouterIndice("Adresse : Karl habite à Kinguélé (impasse 4)"),
        noeudSuivant: "bureau_karl_suite" 
      }
    ]
  },

  bureau_karl_suite: {
    lieu: "Musée National",
    image: "Inspecteur Ndong.png",
    texte: "Sur le morceau de papier déchiré dans la corbeille, vous déchiffrez : 'Rdv 14h30 - Port Môle'.",
    choix: [
      { 
        texte: "📝 Conserver le mot déchiré", 
        action: () => ajouterIndice("Papier déchiré : 'Rdv 14h30 - Port Môle'"),
        noeudSuivant: "choix_salle_musee" 
      }
    ]
  },

  sortie_secours: {
    lieu: "Musée National",
    image: "Inspecteur Ndong.png",
    texte: "La porte arrière donne sur une ruelle non goudronnée. Des empreintes de pas mènent vers la voie principale et un lambeau de tissu à carreaux rouges et noirs est resté accroché à la serrure extérieure.",
    choix: [
      { 
        texte: "🧵 Récolter le fragment de tissu à carreaux", 
        action: () => ajouterIndice("Preuve : Tissu à carreaux rouge et noir"),
        noeudSuivant: "choix_salle_musee" 
      }
    ]
  },

  choix_salle_musee: {
    lieu: "Musée National",
    image: "Inspecteur Ndong.png",
    texte: "Vous êtes au centre de la salle du musée. En fonction des éléments recueillis, où souhaitez-vous poursuivre vos recherches ?",
    choix: [
      { 
        texte: "🗣️ Interroger à nouveau le conservateur M. Ondo", 
        noeudSuivant: "ondo_intro" 
      },
      { 
        texte: "📋 Inspecter à nouveau le bureau du garde ou la vitrine", 
        noeudSuivant: "bureau_karl" 
      },
      { 
        texte: "🏠 Aller vérifier le domicile de Karl à Kinguélé", 
        condition: () => possedeIndice("Adresse : Karl habite à Kinguélé (impasse 4)"),
        noeudSuivant: "maison_karl" 
      },
      { 
        texte: "🚖 Partir enquêter dans le quartier de Nkembo", 
        condition: () => possedeIndice("Piste : Karl fréquente le quartier Nkembo"),
        noeudSuivant: "depart_nkembo" 
      }
    ]
  },

  // ------------------------------------------------------
  // CHAPITRE 2 : ENQUÊTE SUR LE TERRAIN (KINGUÉLÉ ET NKEMBO)
  // ------------------------------------------------------
  maison_karl: {
    lieu: "Quartier Kinguélé",
    image: "Inspecteur Ndong.png",
    texte: "10h30 — Domicile de Karl à Kinguélé.\n\nLa porte est entrouverte. La maison a été abandonnée à la hâte : une valise vide est posée sur le lit. Un voisin vous aperçoit et s'approche.",
    choix: [
      { texte: "🗣️ Interroger le voisin sur les faits récents", noeudSuivant: "voisin_kinguele" }
    ]
  },

  voisin_kinguele: {
    lieu: "Quartier Kinguélé",
    image: "Inspecteur Ndong.png",
    texte: "Le voisin : 'Karl est parti ce matin vers 06h avec un grand sac de sport bleu. Il avait l'air terrifié. Je l'ai entendu dire au chauffeur de taxi qu'il se rendait au Maquis VIP à Nkembo pour retrouver son contact.'",
    choix: [
      { 
        texte: "📝 Noter la destination (Maquis VIP à Nkembo)", 
        action: () => ajouterIndice("Piste : Karl vu se dirigeant vers le Maquis VIP à Nkembo"),
        noeudSuivant: "depart_nkembo" 
      }
    ]
  },

  depart_nkembo: {
    lieu: "Maquis VIP (Nkembo)",
    image: "Barman.png",
    texte: "11h45 — Maquis VIP de Nkembo.\n\nLe barman Christian essuie ses verres. L'ambiance est calme en ce milieu de journée.",
    choix: [
      { texte: "🗣️ Montrer la photo de Karl au barman", noeudSuivant: "barman_karl" },
      { 
        texte: "🗣️ Questionner le barman sur le tissu à carreaux", 
        condition: () => possedeIndice("Preuve : Tissu à carreaux rouge et noir"),
        noeudSuivant: "barman_mamba" 
      }
    ]
  },

  barman_karl: {
    lieu: "Maquis VIP (Nkembo)",
    image: "Barman.png",
    texte: "Christian : 'Oui, Karl est venu ici ce matin. Il était accompagné d'un individu dangereux du marché de Mont-Bouët nommé Mamba, qui porte toujours des chemises à carreaux rouges et noires.'",
    choix: [
      { 
        texte: "📝 Noter la piste sur Mamba au marché de Mont-Bouët", 
        action: () => ajouterIndice("Piste majeure : Mamba se trouve au marché de Mont-Bouët"),
        noeudSuivant: "choix_nkembo_vers_marche" 
      }
    ]
  },

  barman_mamba: {
    lieu: "Maquis VIP (Nkembo)",
    image: "Barman.png",
    texte: "Christian reconnaît le morceau de tissu : 'C'est la chemise de Mamba ! Il tient une échoppe de sculpture à l'allée 3 du marché de Mont-Bouët. C'est un receleur connu.'",
    choix: [
      { 
        texte: "📝 Noter l'emplacement exact d'échoppe de Mamba (Allée 3)", 
        action: () => ajouterIndice("Piste majeure : Mamba se trouve à l'Allée 3 du marché de Mont-Bouët"),
        noeudSuivant: "choix_nkembo_vers_marche" 
      }
    ]
  },

  choix_nkembo_vers_marche: {
    lieu: "Maquis VIP (Nkembo)",
    image: "Inspecteur Ndong.png",
    texte: "Toutes vos pistes convergent désormais vers le marché de Mont-Bouët. Que décidez-vous de faire ?",
    choix: [
      { texte: "🛒 Se rendre immédiatement au Marché de Mont-Bouët", noeudSuivant: "mont_bouet_allee" }
    ]
  },

  // ------------------------------------------------------
  // CHAPITRE 3 : LA FILATURE À MONT-BOUËT
  // ------------------------------------------------------
  mont_bouet_allee: {
    lieu: "Marché de Mont-Bouët",
    image: "Mamba.png",
    texte: "13h15 — Allée 3 du marché de Mont-Bouët.\n\nVous repérez l'échoppe de Mamba. De loin, vous le voyez en train de discuter vivement avec Karl. Karl tient fermement un sac de sport bleu.",
    choix: [
      { texte: "👂 S'approcher discrètement pour observer et écouter leur discussion", noeudSuivant: "ecouter_mamba_karl" },
      { texte: "🚨 Bondir pour les interpeller immédiatement", noeudSuivant: "intervenir_trop_tot" }
    ]
  },

  intervenir_trop_tot: {
    lieu: "Marché de Mont-Bouët",
    image: "Karl.png",
    texte: "Votre mouvement brusque alerte les deux suspects ! Dans la cohue dense du marché, Mamba bouscule un étalage et Karl s'enfuit à toutes jambes avec le sac bleu. Vous perdez leur trace dans la foule !",
    choix: [
      { 
        texte: "🏃 Suivre la piste du papier déchiré vers le Port Môle (14h30)", 
        condition: () => possedeIndice("Papier déchiré : 'Rdv 14h30 - Port Môle'"),
        noeudSuivant: "port_mole_arrivee" 
      },
      {
        texte: "🔍 Chercher des indices autour de l'échoppe abandonnée de Mamba",
        condition: () => !possedeIndice("Papier déchiré : 'Rdv 14h30 - Port Môle'"),
        noeudSuivant: "indices_echoppe_mamba"
      }
    ]
  },

  indices_echoppe_mamba: {
    lieu: "Marché de Mont-Bouët",
    image: "Inspecteur Ndong.png",
    texte: "En fouillant la table de travail de Mamba, vous découvrez une note écrite à la hâte : 'Livraison finale Masque Mbouli à 14h30 au Port Môle'.",
    choix: [
      { 
        texte: "🚗 Foncez en urgence au Port Môle", 
        action: () => ajouterIndice("Destination finale : Port Môle à 14h30"),
        noeudSuivant: "port_mole_arrivee" 
      }
    ]
  },

  ecouter_mamba_karl: {
    lieu: "Marché de Mont-Bouët",
    image: "Mamba.png",
    texte: "Mamba (à voix basse) : 'Le client international t'attend au Port Môle à 14h30. Fais attention, il ne rigole pas avec les retards. Prends le sac et va directement au hangar 4.'\n\nKarl acquiesce, serre son sac bleu contre lui et s'éclipse vers une sortie secondaire.",
    choix: [
      { 
        texte: "🚗 Suivre Karl en filature jusqu'au Port Môle", 
        action: () => ajouterIndice("Destination finale : Port Môle à 14h30"),
        noeudSuivant: "port_mole_arrivee" 
      }
    ]
  },

  // ------------------------------------------------------
  // CHAPITRE 4 : L'INFILTRATION AU PORT MÔLE & LA DÉCOUVERTE
  // ------------------------------------------------------
  port_mole_arrivee: {
    lieu: "Port Môle - Hangar 4",
    image: "Karl.png",
    texte: "14h20 — Port Môle de Libreville.\n\nVous êtes dissimulé derrière une pile de conteneurs dans le hangar 4. Karl attend nerveusement, le sac bleu à ses pieds.\n\nSoudain, une berline noire aux vitres teintées s'arrête. Un homme élégant en costume sur mesure en descend, entouré de deux gardes du corps.",
    choix: [
      { texte: "🕵️ Écouter la transaction cachée depuis votre position", noeudSuivant: "ecouter_transaction_port" }
    ]
  },

  ecouter_transaction_port: {
    lieu: "Port Môle - Hangar 4",
    image: "Inspecteur Ndong.png",
    texte: "L'homme en costume parle d'une voix froide : 'Karl, tu as été efficace. Le Masque Mbouli va rejoindre ma collection privée en Europe. Tiens, voici ton argent.'\n\nKarl demande : 'Merci... Monsieur Vance. Mais êtes-vous sûr que la police ne remontera pas jusqu'à moi ?'\n\nL'homme sourit avec dédain : 'Moi, **Victor Vance**, je contrôle tout ici. La police gabonaise ne saura jamais qui commande.'\n\nVOUS VENEZ DE DÉCOUVRIR LE NOM DU CÉLÈBRE TRAFIQUANT INTERNATIONAL : **VICTOR VANCE** !",
    choix: [
      { 
        texte: "🚨 Donner le signal d'assaut à vos unités pour saisir le masque", 
        action: () => ajouterIndice("Cible future : Victor Vance (Trafiquant international)"),
        noeudSuivant: "saisie_masque" 
      }
    ]
  },

  saisie_masque: {
    lieu: "Port Môle",
    image: "Inspecteur Ndong.png",
    texte: "L'ASSAUT EST LANCÉ ! 'POLICE ! MAINS SUR LA TÊTE !'\n\nLes gyrophares illuminent le hangar ! Profitant du chaos et du tir de couverture de ses gardes, Victor Vance réussit à monter à bord de sa berline qui démarre en trombe et s'échappe !\n\nKarl est plaqué au sol et arrêté. Le sac bleu est récupéré : le **Masque Mbouli** est intact et sécurisé !",
    choix: [
      { texte: "🏛️ Restituer le masque au Musée et ouvrir le dossier Victor Vance", noeudSuivant: "epilogue_reussite" }
    ]
  },

  epilogue_reussite: {
    lieu: "Musée National - Bilan Enquête 1",
    image: "M.Ondo.png",
    texte: "16h00 — Musée National.\n\nLe Masque Mbouli retrouve sa vitrine. M. Ondo vous remercie chaleureusement :\n'Inspecteur Ndong, le Gabon vous doit une fière chandelle !'\n\nMais dans votre carnet d'enquêteur, une nouvelle ligne rouge est tracée :\n**VICTOR VANCE**. Karl n'était qu'un pion. Le véritable cerveau du réseau d'art clandestin vient d'être identifié...\n\n🎉 **FIN DE L'ENQUÊTE N°1 : LE MASQUE MBOULI**",
    choix: [
      { texte: "📁 Démarrer l'Enquête N°2 : Les Ombres de la Sablière", noeudSuivant: "teaser_enquete_2" },
      { texte: "🔄 Recommencer l'Enquête N°1", action: () => recommencerJeu(), noeudSuivant: "depart" }
    ]
  },

  // ======================================================
  // ENQUÊTE N°2 : LES OMBRES DE LA SABLIÈRE
  // ======================================================

  // ------------------------------------------------------
  // ACTE 1 : LE BRIEFING & LES PISTES INITIALES
  // ------------------------------------------------------
  teaser_enquete_2: {
    lieu: "Commissariat Central — Bureau de l'Inspecteur",
    image: "Inspecteur Ndong.png",
    texte: "08h30 — Commissariat Central, Libreville.\n\nLa pluie frappe contre le vitrage de votre bureau. Victor Vance a réussi à s'enfuir lors de l'assaut du Port Môle. D'après un rapport de la police de l'air et des frontières, son jet privé est actuellement stationné sur le tarmac de l'Aéroport Léon Mba et un plan de vol pour Zurich est déposé pour 21h00.\n\nVous avez moins de 12 heures pour obtenir des preuves matérielles irréfutables et faire signer un mandat d'arrêt par le Juge d'instruction avant qu'il ne quitte le territoire gabonais.",
    choix: [
      { texte: "💻 Analyser la carte SIM du téléphone saisi sur Karl", noeudSuivant: "e2_analyse_sim" },
      { texte: "🍸 Activer un informateur confidentiel au Quartier Louis", noeudSuivant: "e2_informateur_louis" },
      { texte: "🏛️ Demander un mandat d'urgence directement au Juge", noeudSuivant: "e2_juge_sans_preuves" }
    ]
  },

  e2_juge_sans_preuves: {
    lieu: "Palais de Justice",
    image: "Juge.png",
    texte: "Le Juge d'instruction ajuste ses lunettes et vous fixe d'un air sévère :\n\n'Inspecteur Ndong, Victor Vance est un homme d'affaires influent doté de puissants relais diplomatiques. Je ne peux pas signer un mandat d'arrêt sur de simples soupçons vocaux d'un gardien de musée. Apportez-moi des preuves financières bancaires ou une saisie de documents illégaux !'",
    choix: [
      { texte: "🔙 Retourner au commissariat et explorer les pistes", noeudSuivant: "teaser_enquete_2" }
    ]
  },

  // ------------------------------------------------------
  // ACTE 2 : INVESTIGATIONS ET COLLECTE DE PREUVES
  // ------------------------------------------------------
  e2_analyse_sim: {
    lieu: "Police Technique & Scientifique (PTS)",
    image: "Inspecteur Ndong.png",
    texte: "Le technicien de la PTS extrait les données de la puce : 'Inspecteur, la SIM contient plusieurs SMS chiffrés. L'un d'eux donne un identifiant bancaire : **V-Trading Ltd, banque de Port-Gentil**. Un transfert de 15 millions de Francs CFA a été ordonné ce matin depuis cette structure.'",
    choix: [
      { 
        texte: "📝 Relever le rôle de la société écran 'V-Trading'", 
        action: () => ajouterIndice("Preuve : Société écran V-Trading liée aux comptes de Vance"),
        noeudSuivant: "e2_hub_options" 
      }
    ]
  },

  e2_informateur_louis: {
    lieu: "Bar La Rumba (Quartier Louis)",
    image: "Informateur.png",
    texte: "11h15 — Dans la pénombre du bar La Rumba, Blaise, votre informateur, vous glisse un papier sous le verre de soda :\n\n'Vance ne dort jamais deux fois au même endroit, mais sa garde rapprochée est logée dans sa villa sécurisée de La Sablière. Son bras droit, un homme balafré, se rend tous les midis au Beach Club pour échanger des enveloppes confidentielles.'",
    choix: [
      { 
        texte: "📝 Noter le rendez-vous du bras droit au Beach Club", 
        action: () => ajouterIndice("Piste : Le bras droit de Vance va au Beach Club à midi"),
        noeudSuivant: "e2_hub_options" 
      }
    ]
  },

  e2_hub_options: {
    lieu: "Commissariat Central",
    image: "Inspecteur Ndong.png",
    texte: "Les pièces du puzzle commencent à s'assembler. Quelle est votre prochaine initiative ?",
    choix: [
      { 
        texte: "🏖️ Partir immédiatement surveiller le Beach Club", 
        condition: () => possedeIndice("Piste : Le bras droit de Vance va au Beach Club à midi"),
        noeudSuivant: "e2_beach_club_filature" 
      },
      { 
        texte: "🏛️ Aller présenter les relevés de V-Trading au Juge", 
        condition: () => possedeIndice("Preuve : Société écran V-Trading liée aux comptes de Vance"),
        noeudSuivant: "e2_obtention_mandat" 
      }
    ]
  },

  // ------------------------------------------------------
  // ACTE 3 : LA FILATURE AU BEACH CLUB ET LE MANDAT
  // ------------------------------------------------------
  e2_beach_club_filature: {
    lieu: "Beach Club (La Sablière)",
    image: "Inspecteur Ndong.png",
    texte: "12h30 — En terrasse sous des lunettes de soleil, vous repérez l'homme balafré. Il s'assied à une table avec un livreur et récupère un passe-partout électronique gravé du logo 'Sablière - Sécurité Villa 12'.\n\nEn partant, le lieutenant de Vance fait tomber un petit badge d'accès magnétique sur le sable.",
    choix: [
      { 
        texte: "🔑 Ramasser discrètement le badge d'accès électronique", 
        action: () => ajouterIndice("Objet : Pass magnétique de la Villa 12 de Vance"),
        noeudSuivant: "e2_hub_options" 
      }
    ]
  },

  e2_obtention_mandat: {
    lieu: "Palais de Justice — Bureau du Juge",
    image: "Juge.png",
    texte: "15h00 — Le Juge examine attentivement les documents financiers transmis par la PTS :\n\n'Impeccable, Ndong ! Les virements de la V-Trading coïncident au centime près avec le vol du musée. Voici le **mandat de perquisition d'urgence** pour la Villa 12 à La Sablière. Prenez des hommes armés avec vous.'",
    choix: [
      { 
        texte: "📝 Archiver le mandat dans votre dossier", 
        action: () => ajouterIndice("Mandat : Mandat de perquisition officiel signé"),
        noeudSuivant: "e2_choix_assaut" 
      }
    ]
  },

  // ------------------------------------------------------
  // ACTE 4 : L'ASSAUT ET L'INFILTRATION DE LA VILLA
  // ------------------------------------------------------
  e2_choix_assaut: {
    lieu: "Entrée du quartier de La Sablière",
    image: "Inspecteur Ndong.png",
    texte: "17h45 — Vous êtes posté à 100 mètres de la somptueuse résidence de Victor Vance. La villa est entourée de hauts murs avec des caméras rotatives et deux gardes armés à l'entrée principale.\n\nComment comptez-vous donner l'assaut ?",
    choix: [
      { 
        texte: "🚪 Infiltrer discrètement par le portail arrière avec le pass magnétique", 
        condition: () => possedeIndice("Objet : Pass magnétique de la Villa 12 de Vance"),
        noeudSuivant: "e2_infiltration_discrete" 
      },
      { 
        texte: "🚨 Défoncer le portail principal avec les véhicules de police", 
        condition: () => possedeIndice("Mandat : Mandat de perquisition officiel signé"),
        noeudSuivant: "e2_assaut_frontal" 
      }
    ]
  },

  e2_infiltration_discrete: {
    lieu: "Villa 12 — Bureau Privé",
    image: "Victor_Vance.png",
    texte: "Grâce au pass, vous neutralisez le système d'alarme et vous introduisez par le jardin intérieur. Vous surprenez Victor Vance en train de vider le contenu d'un coffre-fort dans un sac en cuir.\n\nPris de court sans ses gardes, il lève lentement les mains : 'Inspecteur... vous êtes bien plus coriace que mes agents de sécurité ne le prétendent.'",
    choix: [
      { texte: "🗣️ Passer aux menottes et l'interroger sur ses projets", noeudSuivant: "e2_interrogatoire_vance" }
    ]
  },

  e2_assaut_frontal: {
    lieu: "Villa 12 — Cour Principale",
    image: "Victor_Vance.png",
    texte: "LES SIRÈNES HURLENT ! Le fourgon de la police défonce le portail en fer forgé ! Les gardes de Vance ripostent avant de poser leurs armes face à la supériorité numérique des unités spécialisées.\n\nVous débarquez dans le salon. Victor Vance vous attend, assis sereinement dans un fauteuil en cuir, un verre de cognac à la main.",
    choix: [
      { texte: "🗣️ Lui présenter le mandat et procéder à son arrestation", noeudSuivant: "e2_interrogatoire_vance" }
    ]
  },

  // ------------------------------------------------------
  // ACTE 5 : RÉVÉLATIONS ET DÉNOUEMENT (TRANSITION ENQUÊTE 3)
  // ------------------------------------------------------
  e2_interrogatoire_vance: {
    lieu: "Villa 12 — Arrestation",
    image: "Victor_Vance.png",
    texte: "Alors que vos hommes lui mettent les menottes, Vance garde son sourire narquois :\n\n'Vous pensez avoir gagné, Ndong ? Le Masque Mbouli n'était qu'une distraction. Pendant que vous perdiez votre temps à Libreville, mes partenaires ont déjà acheminé le vrai chargement vers le chantier du **grand barrage d'Akinga**... S'il devait y avoir un accident là-bas, la moitié de la province serait plongée dans le noir.'",
    choix: [
      { texte: "📁 Transférer Vance en prison haute sécurité et sceller l'Enquête 2", noeudSuivant: "epilogue_enquete_2" }
    ]
  },

  epilogue_enquete_2: {
    lieu: "Commissariat Central — Bureau du Chef",
    image: "Inspecteur Ndong.png",
    texte: "21h00 — Le jet privé de Victor Vance repartira à vide. Le grand trafiquant dort ce soir en cellule d'isolement.\n\nCependant, les révélations sur le sabotage planifié du barrage d'Akinga font froid dans le dos. Le ministre de l'Intérieur exige votre présence sur les lieux dès demain matin.\n\n🏆 **FIN DE L'ENQUÊTE N°2 : LES OMBRES DE LA SABLIÈRE**",
    choix: [
      { texte: "🚗 Démarrer l'Enquête N°3 : Le Sabotage d'Akinga", noeudSuivant: "teaser_enquete_3" },
      { texte: "🔄 Recommencer depuis l'Enquête N°1", action: () => recommencerJeu(), noeudSuivant: "depart" }
    ]
  },

  // ======================================================
  // ENQUÊTE N°3 : LE SABOTAGE D'AKINGA (TEASER)
  // ======================================================
  teaser_enquete_3: {
    lieu: "Route de l'Intérieur — Direction Akinga (Enquête 3/10)",
    image: "Inspecteur Ndong.png",
    texte: "06h00 (Le lendemain) — À bord de votre véhicule d'intervention, vous roulez vers le complexe hydroélectrique d'Akinga.\n\nDes menaces de sabotage pèsent sur la structure. La sécurité du pays est désormais en jeu.\n\nL'Enquête 3 commence...",
    choix: [
      { texte: "🔄 Recommencer depuis l'Enquête N°1", action: () => recommencerJeu(), noeudSuivant: "depart" }
    ]
  }
};

// ========================================================
// 3. MOTEUR D'AFFICHAGE AVEC FILTRE DE CONDITIONS
// ========================================================
function chargerNoeud(cleNoeud) {
  const noeud = histoire[cleNoeud];

  if (!noeud) {
    console.error("Noeud introuvable dans la structure :", cleNoeud);
    return;
  }

  const lieuDisplay = document.getElementById("lieu-display");
  const storyText = document.getElementById("story-text");
  const characterPortrait = document.getElementById("character-portrait");

  if (lieuDisplay) lieuDisplay.textContent = noeud.lieu;
  if (storyText) storyText.textContent = noeud.texte;

  if (characterPortrait) {
    if (noeud.image) {
      characterPortrait.src = "assets/" + noeud.image;
      characterPortrait.alt = noeud.lieu;
      characterPortrait.style.display = "block";
    } else {
      characterPortrait.style.display = "none";
    }
  }

  const choicesContainer = document.getElementById("choices-container");
  if (choicesContainer) {
    choicesContainer.innerHTML = "";

    noeud.choix.forEach((option) => {
      // Filtrage dynamique : vérifie si l'option est soumise à une condition d'inventaire
      if (typeof option.condition === "function" && !option.condition()) {
        return;
      }

      const bouton = document.createElement("button");
      bouton.textContent = option.texte;

      bouton.addEventListener("click", () => {
        if (typeof option.action === "function") {
          option.action();
        }
        if (option.noeudSuivant) {
          chargerNoeud(option.noeudSuivant);
        }
      });

      choicesContainer.appendChild(bouton);
    });
  }
}

// ========================================================
// 4. INITIALISATION DU JEU
// ========================================================
document.addEventListener("DOMContentLoaded", () => {
  reinitialiserInventaire();
  chargerNoeud("depart");
});

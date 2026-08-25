// État du jeu
const gameState = {
  lieuActuel: "Musée National",
  indices: [],
  chapitre: 1,
  musiqueEnLecture: false
};

// Web Audio API pour les effets sonores
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function jouerSon(type) {
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.connect(gain);
  gain.connect(audioCtx.destination);

  if (type === 'click') {
    osc.frequency.setValueAtTime(450, audioCtx.currentTime);
    // Volume fort pour dépasser la musique
    gain.gain.setValueAtTime(0.4, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.08);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.08);
  } else if (type === 'indice') {
    osc.frequency.setValueAtTime(523.25, audioCtx.currentTime);
    osc.frequency.setValueAtTime(659.25, audioCtx.currentTime + 0.1);
    // Volume fort pour l'obtention d'un indice
    gain.gain.setValueAtTime(0.6, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.35);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.35);
  }
}

// Gestion de la musique de fond
function gererMusique() {
  const music = document.getElementById("bg-music");
  const btn = document.getElementById("music-toggle-btn");

  // Volume bas pour la musique de fond (15%)
  music.volume = 0.15;

  if (gameState.musiqueEnLecture) {
    music.pause();
    gameState.musiqueEnLecture = false;
    btn.innerText = "🎵 Musique : OFF";
  } else {
    music.play().then(() => {
      gameState.musiqueEnLecture = true;
      btn.innerText = "🎵 Musique : ON";
    }).catch(err => console.log("Lecture bloquée par le navigateur : ", err));
  }
}

// Données des chapitres
const histoire = {
  depart: {
    lieu: "Musée National",
    image: "Inspecteur Ndong.png",
    texte: "08h00 - Musée National (Boulevard Triomphal).\n\nLe Masque Mbouli a été volé dans la nuit. La vitre de la vitrine est intacte, mais la serrure est grande ouverte. M. Ondo, le conservateur, fait les cent pas, l'air affolé.",
    choix: [
      { texte: "🗣️ Interroger M. Ondo (Conservateur)", noeudSuivant: "interroger_ondo" },
      { texte: "🔍 Examiner la vitrine du masque", noeudSuivant: "examiner_vitrine" },
      { texte: "📋 Examiner le comptoir du gardien", noeudSuivant: "examiner_comptoir" }
    ]
  },

  interroger_ondo: {
    lieu: "Musée National",
    image: "M.Ondo.png",
    texte: "M. Ondo s'essuie le front : 'Inspecteur Ndong ! C'est une catastrophe ! Le masque Mbouli est inestimable !\n\nLe vigile de nuit s'appelle Karl. Il a quitté son poste vers 04h00 du matin sans avertir personne. Je sais juste qu'il passe toutes ses soirées au Maquis VIP à Nkembo !'",
    choix: [
      { 
        texte: "📝 Noter la piste : Karl (Maquis VIP à Nkembo)", 
        action: () => ajouterIndice("Piste : Karl (Maquis VIP à Nkembo)"),
        noeudSuivant: "choix_apres_ondo"
      }
    ]
  },

  choix_apres_ondo: {
    lieu: "Musée National",
    image: "Inspecteur Ndong.png",
    texte: "Que voulez-vous faire ensuite dans la salle d'exposition ?",
    choix: [
      { texte: "🔍 Examiner la vitrine du masque", noeudSuivant: "examiner_vitrine" },
      { texte: "📋 Examiner le comptoir du gardien", noeudSuivant: "examiner_comptoir" },
      { texte: "🚪 Faire le point sur la scène de crime", noeudSuivant: "bilan_chapitre1" }
    ]
  },

  examiner_vitrine: {
    lieu: "Musée National",
    image: "Inspecteur Ndong.png",
    texte: "Vous vous approchez de la vitrine. Pas d'impact sur le verre.\n\nEn regardant dans le trou de la serrure avec votre lampe, vous remarquez un morceau de métal brillant coincé à l'intérieur : c'est un bout de clé passe-partout qui s'est cassé pendant le vol !",
    choix: [
      { 
        texte: "🧪 Récupérer le bout de clé passe-partout cassé", 
        action: () => ajouterIndice("Preuve : Bout de clé passe-partout cassé"),
        noeudSuivant: "choix_apres_vitrine"
      }
    ]
  },

  choix_apres_vitrine: {
    lieu: "Musée National",
    image: "Inspecteur Ndong.png",
    texte: "Le bout de métal est soigneusement rangé dans votre sachet de preuve.",
    choix: [
      { texte: "🗣️ Interroger M. Ondo (Conservateur)", noeudSuivant: "interroger_ondo" },
      { texte: "📋 Examiner le comptoir du gardien", noeudSuivant: "examiner_comptoir" },
      { texte: "🚪 Faire le point sur la scène de crime", noeudSuivant: "bilan_chapitre1" }
    ]
  },

  examiner_comptoir: {
    lieu: "Musée National",
    image: "Inspecteur Ndong.png",
    texte: "Sur le comptoir du gardien, le registre indique que Karl a signé sa dernière ronde à 03h00 du matin.\n\nÀ côté du registre, un petit bout de papier est gribouillé avec un numéro : 074 88 XX XX.",
    choix: [
      { 
        texte: "📱 Relever le numéro trouvé sur le comptoir", 
        action: () => ajouterIndice("Indice : Numéro gribouillé (074 88 XX XX)"),
        noeudSuivant: "choix_apres_comptoir"
      }
    ]
  },

  choix_apres_comptoir: {
    lieu: "Musée National",
    image: "Inspecteur Ndong.png",
    texte: "Vous avez noté les éléments trouvés sur le comptoir.",
    choix: [
      { texte: "🗣️ Interroger M. Ondo (Conservateur)", noeudSuivant: "interroger_ondo" },
      { texte: "🔍 Examiner la vitrine du masque", noeudSuivant: "examiner_vitrine" },
      { texte: "🚪 Faire le point sur la scène de crime", noeudSuivant: "bilan_chapitre1" }
    ]
  },

  bilan_chapitre1: {
    lieu: "Musée National",
    image: "Inspecteur Ndong.png",
    texte: "Vérification du travail d'investigation...",
    choix: []
  },

  arrivee_nkembo: {
    lieu: "Maquis VIP (Nkembo)",
    image: "Barman.png",
    texte: "10h30 - Maquis VIP à Nkembo.\n\nLe maquis est calme en cette fin de matinée. Un barman essuie le comptoir en écoutant de la musique. C'est ici que Karl a ses habitudes.",
    choix: [
      { texte: "🗣️ Parler au barman", noeudSuivant: "interroger_barman" },
      { texte: "🔍 Inspecter la table du fond (coin habituel de Karl)", noeudSuivant: "inspecter_table_nkembo" },
      { texte: "📱 Composer le numéro gribouillé (074 88 XX XX)", noeudSuivant: "appeler_numero" }
    ]
  },

  interroger_barman: {
    lieu: "Maquis VIP (Nkembo)",
    image: "Barman.png",
    texte: "Le barman vous regarde de haut en bas : 'C'est pour quoi ? On ne cherche pas d'embrouilles ici monsieur.'",
    choix: [
      { 
        texte: "Lui dire : 'Karl est impliqué dans le vol du Musée National ! Où est-il ?'",
        noeudSuivant: "barman_mefiant"
      },
      { 
        texte: "Lui montrer la piste relevée au Musée et garder son calme",
        noeudSuivant: "barman_cooperatif"
      }
    ]
  },

  barman_mefiant: {
    lieu: "Maquis VIP (Nkembo)",
    image: "Barman.png",
    texte: "Le barman croise les bras : 'Je ne connais aucun Karl. Circulez avant que ça ne se gâte.'\n\n(Vous devez vous y prendre autrement).",
    choix: [
      { texte: "🔙 Revenir aux options", noeudSuivant: "arrivee_nkembo" }
    ]
  },

  barman_cooperatif: {
    lieu: "Maquis VIP (Nkembo)",
    image: "Barman.png",
    texte: "Le barman baisse d'un ton : 'Ah... le vol du masque ? Karl est venu ici à 04h30 du matin. Il tremblait et tenait un gros sac.\n\nIl m'a demandé le contact de MAMBA, le recéleur du Marché de Mont-Bouët, puis il est parti en coup de vent !'",
    choix: [
      { 
        texte: "📝 Noter les aveux : Karl est parti voir Mamba à Mont-Bouët", 
        action: () => ajouterIndice("Témoignage : Karl est allé voir Mamba (Mont-Bouët)"),
        noeudSuivant: "choix_apres_barman"
      }
    ]
  },

  choix_apres_barman: {
    lieu: "Maquis VIP (Nkembo)",
    image: "Inspecteur Ndong.png",
    texte: "Le barman retourne à ses verres. Que souhaitez-vous faire ?",
    choix: [
      { texte: "🔍 Inspecter la table du fond", noeudSuivant: "inspecter_table_nkembo" },
      { texte: "📱 Composer le numéro gribouillé", noeudSuivant: "appeler_numero" },
      { texte: "🚪 Faire le bilan de l'étape de Nkembo", noeudSuivant: "bilan_chapitre2" }
    ]
  },

  inspecter_table_nkembo: {
    lieu: "Maquis VIP (Nkembo)",
    image: "Inspecteur Ndong.png",
    texte: "Vous inspectez la table où Karl s'assoit d'habitude.\n\nSous la banquette, vous trouvez un paquet de cigarettes écrasé. À l'intérieur du paquet, Karl a glissé une petite carte de visite artisanale : 'Mamba - Antiquités & Objets d'Art, Allée des Sculpteurs - Marché de Mont-Bouët'.",
    choix: [
      { 
        texte: "📦 Récupérer la carte de visite de Mamba", 
        action: () => ajouterIndice("Preuve : Carte de visite Mamba (Mont-Bouët)"),
        noeudSuivant: "choix_apres_table"
      }
    ]
  },

  choix_apres_table: {
    lieu: "Maquis VIP (Nkembo)",
    image: "Inspecteur Ndong.png",
    texte: "L'indice est ajouté à votre carnet.",
    choix: [
      { texte: "🗣️ Parler au barman", noeudSuivant: "interroger_barman" },
      { texte: "📱 Composer le numéro gribouillé", noeudSuivant: "appeler_numero" },
      { texte: "🚪 Faire le bilan de l'étape de Nkembo", noeudSuivant: "bilan_chapitre2" }
    ]
  },

  appeler_numero: {
    lieu: "Maquis VIP (Nkembo)",
    image: "Inspecteur Ndong.png",
    texte: "Vous composez le 074 88 XX XX.\n\nAprès trois tonalités, un répondeur automatique se déclenche : 'Vous êtes bien sur le répondeur de la boutique d'Antiquités Mamba au Marché de Mont-Bouët...'",
    choix: [
      { 
        texte: "📝 Noter la confirmation du numéro de Mamba", 
        action: () => ajouterIndice("Confirmation : Le numéro appartient à Mamba"),
        noeudSuivant: "choix_apres_appel"
      }
    ]
  },

  choix_apres_appel: {
    lieu: "Maquis VIP (Nkembo)",
    image: "Inspecteur Ndong.png",
    texte: "La piste de Mont-Bouët est de plus en plus évidente.",
    choix: [
      { texte: "🗣️ Parler au barman", noeudSuivant: "interroger_barman" },
      { texte: "🔍 Inspecter la table du fond", noeudSuivant: "inspecter_table_nkembo" },
      { texte: "🚪 Faire le bilan de l'étape de Nkembo", noeudSuivant: "bilan_chapitre2" }
    ]
  },

  bilan_chapitre2: {
    lieu: "Maquis VIP (Nkembo)",
    image: "Inspecteur Ndong.png",
    texte: "Vérification des preuves accumulées à Nkembo...",
    choix: []
  },

  arrivee_montbouet: {
    lieu: "Marché de Mont-Bouët",
    image: "Mamba.png",
    texte: "12h00 - Marché de Mont-Bouët.\n\nLa foule est dense, l'ambiance est bruyante. Vous serpentez dans les dédales jusqu'à l'Allée des Sculpteurs.\n\nL'échoppe de Mamba est devant vous. À l'intérieur, vous apercevez Karl en train de négocier avec Mamba devant un grand sac en toile !",
    choix: [
      { texte: "🚨 Intervenir immédiatement et faire sommation", noeudSuivant: "intervenir_directement" },
      { texte: "👂 Écouter discrètement la conversation au coin de l'échoppe", noeudSuivant: "ecouter_discretement" }
    ]
  },

  intervenir_directement: {
    lieu: "Marché de Mont-Bouët",
    image: "Karl.png",
    texte: "Vous surgissez en criant : 'Police ! Ne bougez plus !'\n\nKarl pris de panique renverse un étalage et tente de s'enfuir dans la foule du marché !",
    choix: [
      { texte: "🏃 Se lancer à la poursuite de Karl", noeudSuivant: "poursuite_karl" }
    ]
  },

  ecouter_discretement: {
    lieu: "Marché de Mont-Bouët",
    image: "Mamba.png",
    texte: "Vous restez en retrait.\n\nMamba dit à Karl : 'Le Masque Mbouli est trop connu ! Je ne peux pas te donner 5 millions cash maintenant. Repasse à 18h.' Karl peste mais accepte. Il s'apprête à sortir !",
    choix: [
      { 
        texte: "📝 Noter l'aveu du vol du masque Mbouli", 
        action: () => ajouterIndice("Aveu d'achat : Le masque Mbouli est bien dans le sac"),
        noeudSuivant: "bloquer_sortie"
      }
    ]
  },

  bloquer_sortie: {
    lieu: "Marché de Mont-Bouët",
    image: "Karl.png",
    texte: "Au moment où Karl passe la porte de l'échoppe, vous lui bloquez le passage et sortez vos menottes.",
    choix: [
      { texte: "🚔 Procéder à l'arrestation de Karl et Mamba", noeudSuivant: "victoire" }
    ]
  },

  poursuite_karl: {
    lieu: "Marché de Mont-Bouët",
    image: "Karl.png",
    texte: "Après une course-poursuite à travers les étals de Mont-Bouët, vous plaquez Karl au sol près de la sortie du marché.\n\nVos collègues en renfort encerclent l'échoppe de Mamba et récupèrent le sac contenant le Masque Mbouli intact !",
    choix: [
      { texte: "🏆 Voir le bilan de l'enquête", noeudSuivant: "victoire" }
    ]
  },

  victoire: {
    lieu: "Commissariat Central",
    image: "Inspecteur Ndong.png",
    texte: "🎉 FÉLICITATIONS INSPECTEUR NDONG !\n\nL'affaire est classée avec succès !\n- Le Masque Mbouli a été restitué intact au Musée National.\n- Karl a avoué avoir volé le masque contre une promesse d'argent.\n- Mamba a été arrêté pour recel d'objets d'art inestimables.\n\nVotre réputation à la PJ de Libreville n'est plus à faire !",
    choix: [
      { 
        texte: "🔄 Recommencer l'enquête depuis le début", 
        action: () => recommencerJeu(),
        noeudSuivant: "depart"
      }
    ]
  }
};

let typeInterval = null;

function tapezTexte(elementId, texte, vitesse = 15) {
  const elem = document.getElementById(elementId);
  elem.textContent = "";
  let i = 0;
  if (typeInterval) clearInterval(typeInterval);

  typeInterval = setInterval(() => {
    if (i < texte.length) {
      elem.textContent += texte.charAt(i);
      i++;
    } else {
      clearInterval(typeInterval);
    }
  }, vitesse);
}

function initGame() {
  document.getElementById("music-toggle-btn").addEventListener("click", gererMusique);
  afficherNoeud("depart");
}

function afficherNoeud(cleNoeud) {
  const noeud = histoire[cleNoeud];
  if (!noeud) return;

  gameState.lieuActuel = noeud.lieu;
  document.getElementById("lieu-display").innerText = gameState.lieuActuel;

  // Portrait du personnage
  const imgElem = document.getElementById("character-portrait");
  if (noeud.image) {
    imgElem.src = noeud.image;
    imgElem.style.display = "block";
  } else {
    imgElem.style.display = "none";
  }

  tapezTexte("story-text", noeud.texte);

  const choicesContainer = document.getElementById("choices-container");
  choicesContainer.innerHTML = "";

  if (cleNoeud === "bilan_chapitre1") {
    verifierFinChapitre1(choicesContainer);
    return;
  }

  if (cleNoeud === "bilan_chapitre2") {
    verifierFinChapitre2(choicesContainer);
    return;
  }

  noeud.choix.forEach(item => {
    const btn = document.createElement("button");
    btn.innerText = item.texte;
    btn.onclick = () => {
      // Démarre aussi la musique au premier clic de l'utilisateur s'elle n'est pas activée
      if (!gameState.musiqueEnLecture) {
        gererMusique();
      }
      jouerSon('click');
      if (item.action) item.action();
      afficherNoeud(item.noeudSuivant);
    };
    choicesContainer.appendChild(btn);
  });
}

function ajouterIndice(nomIndice) {
  if (!gameState.indices.includes(nomIndice)) {
    gameState.indices.push(nomIndice);
    jouerSon('indice');
    actualiserInventaire();
  }
}

function actualiserInventaire() {
  const list = document.getElementById("inventory-list");
  document.getElementById("indices-count").innerText = gameState.indices.length;
  
  if (gameState.indices.length === 0) {
    list.innerHTML = `<li class="empty">Aucun indice collecté pour l'instant.</li>`;
    return;
  }

  list.innerHTML = "";
  gameState.indices.forEach(ind => {
    const li = document.createElement("li");
    li.innerText = ind;
    list.appendChild(li);
  });
}

function verifierFinChapitre1(container) {
  if (gameState.indices.length >= 1) {
    tapezTexte("story-text", "✅ CHAPITRE 1 TERMINÉ !\n\nVos premières constatations au Musée National sont faites. Vous montez dans un taxi direction Nkembo.");
    
    const btn = document.createElement("button");
    btn.innerText = "🚕 Se rendre à Nkembo (Démarrer le Chapitre 2)";
    btn.style.backgroundColor = "#27ae60";
    btn.style.borderColor = "#2ecc71";
    btn.onclick = () => {
      jouerSon('click');
      gameState.chapitre = 2;
      afficherNoeud("arrivee_nkembo");
    };
    container.appendChild(btn);
  } else {
    tapezTexte("story-text", "⚠️ Vous devez au moins ramasser un indice sur la scène de crime (interroger Ondo, fouiller la vitrine ou le comptoir) avant de quitter le musée.");
    
    const btn = document.createElement("button");
    btn.innerText = "🔙 Continuer à fouiller le musée";
    btn.onclick = () => {
      jouerSon('click');
      afficherNoeud("depart");
    };
    container.appendChild(btn);
  }
}

function verifierFinChapitre2(container) {
  const aPisteMamba = gameState.indices.some(i => i.toLowerCase().includes("mamba"));

  if (aPisteMamba || gameState.indices.length >= 2) {
    tapezTexte("story-text", "✅ CHAPITRE 2 TERMINÉ !\n\nToutes les pistes récoltées à Nkembo convergent vers le même endroit : le recéleur Mamba au Marché de Mont-Bouët.\n\nÊtes-vous prêt à aller affronter Mamba ?");
    
    const btn = document.createElement("button");
    btn.innerText = "🛒 Prendre un taxi pour Mont-Bouët (Chapitre 3)";
    btn.style.backgroundColor = "#27ae60";
    btn.style.borderColor = "#2ecc71";
    btn.onclick = () => {
      jouerSon('click');
      gameState.chapitre = 3;
      afficherNoeud("arrivee_montbouet");
    };
    container.appendChild(btn);
  } else {
    tapezTexte("story-text", "⚠️ Vous n'avez pas encore assez d'éléments à Nkembo. Interrogez le barman, inspectez la table ou passez le coup de fil.");
    
    const btn = document.createElement("button");
    btn.innerText = "🔙 Continuer l'enquête au VIP";
    btn.onclick = () => {
      jouerSon('click');
      afficherNoeud("arrivee_nkembo");
    };
    container.appendChild(btn);
  }
}

function recommencerJeu() {
  gameState.lieuActuel = "Musée National";
  gameState.indices = [];
  gameState.chapitre = 1;
  actualiserInventaire();
}

document.addEventListener("DOMContentLoaded", initGame);
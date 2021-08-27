"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const blockly_model_1 = require("blockly-model/dist/blockly-model");
const serveur_1 = require("./serveur");
const fs_1 = __importDefault(require("fs"));
function projetBlockly() {
    const mapBlockDefinition = {
        block0: {
            parametres: [
                {
                    type: 'libelle',
                    valeur: 'Racine'
                },
                {
                    type: 'valeur',
                    nom: 'titi'
                },
                {
                    type: 'liste',
                    nom: 'mimi',
                    liste: [['e', 'e']]
                },
                {
                    type: 'objet',
                    nom: 'unObjet',
                    estTableau: false,
                    typesValide: ['PP']
                },
                {
                    type: 'objet',
                    nom: 'unTableau',
                    estTableau: true,
                    typesValide: ['B']
                }
            ]
        },
        block1: {
            connexion: {
                typeConnexion: 'Sortie',
                typeRetour: 'A'
            },
            parametres: [
                {
                    type: 'libelle',
                    valeur: 'Faire un truc'
                },
                {
                    type: 'objet',
                    nom: 'unObjet',
                    estTableau: false,
                    typesValide: ['A']
                }
            ]
        },
        block3: {
            connexion: {
                typeConnexion: 'AvantApres',
                typeRetour: 'B'
            },
            parametres: [
                {
                    type: 'libelle',
                    valeur: 'Toto'
                }
            ]
        },
        block4: {
            connexion: {
                typeConnexion: 'AvantApres',
                typeRetour: 'T'
            },
            parametres: [
                {
                    type: 'libelle',
                    valeur: 'Un T'
                }
            ]
        },
        block2: {
            connexion: {
                typeConnexion: 'AvantApres',
                typeRetour: 'B'
            },
            parametres: [
                {
                    type: 'objet',
                    nom: 'tableau',
                    estTableau: true,
                    typesValide: ['B']
                },
                {
                    type: 'libelle',
                    valeur: 'Popo'
                }
            ]
        },
        block5: {
            connexion: {
                typeConnexion: 'Sortie',
                typeRetour: 'PP'
            },
            parametres: [
                {
                    type: 'libelle',
                    valeur: 'ZZZZ'
                }
            ]
        },
        valeurPossible: {
            connexion: {
                typeConnexion: 'AvantApres',
                typeRetour: 'ValeurPossible'
            },
            parametres: [
                {
                    type: 'libelle',
                    valeur: 'Saisir valeur'
                },
                {
                    type: 'valeur',
                    nom: 'valeur'
                }
            ]
        },
        testChoixPourEnsemble: {
            parametres: [
                {
                    type: 'libelle',
                    valeur: 'Choisir parmie'
                },
                {
                    type: 'liste',
                    nom: 'unChoix',
                    liste: [['a', 'a'], ['b', 'b']]
                },
                {
                    type: 'objet',
                    estTableau: true,
                    nom: 'valeurs',
                    typesValide: ['ValeurPossible']
                }
            ]
        }
    };
    const categorie = {
        type: 'arbre',
        enfants: {
            titi: {
                type: 'arbre',
                enfants: {
                    momo: {
                        type: 'feuille',
                        noms: ['block2', 'block3', 'block4', 'block0', 'block5']
                    }
                }
            },
            test: {
                type: 'feuille',
                noms: ['block1', 'valeurPossible', 'testChoixPourEnsemble']
            }
        }
    };
    return {
        categorie: categorie,
        sources: {},
        mapBlockDefinition: mapBlockDefinition,
        mapBlockObjets: {}
    };
}
class TestGestionProjet extends blockly_model_1.GestionProjet {
    constructor(repertoire) {
        super();
        this.repertoire = repertoire;
    }
    executerProjet(nomProjet) {
        return {
            type: 'JSON',
            valeur: {
                message: ' c  ok et c cool courage ',
                projet: nomProjet
            }
        };
    }
    validerEspaceDeTravail(question) {
        const r = [];
        const objets = question.projetBlockly.mapBlockObjets[question.espaceDeTravail];
        var be;
        var mapChoix = {};
        for (var objet of objets) {
            if (objet.nom === 'testChoixPourEnsemble') {
                var lst = objet.elements.valeurs;
                var unChoix = objet.elements.unChoix;
                var count = {};
                var trouver = false;
                var choix = [];
                lst.forEach((value) => {
                    const valeur = value.elements.valeur;
                    if (valeur === unChoix) {
                        trouver = true;
                    }
                    if (count[valeur]) {
                        count[valeur]++;
                    }
                    else {
                        count[valeur] = 1;
                    }
                    choix.push(valeur);
                });
                if (choix.length > 0) {
                    mapChoix[objet.id] = { unChoix: choix };
                }
                for (var obj of lst) {
                    const valeur = obj.elements.valeur;
                    if (count[valeur] > 1) {
                        be = new blockly_model_1.BlockErreur();
                        be.blockObjet = obj;
                        be.message = ` ${valeur} en ${count[valeur]} exmplaire`;
                        r.push(be);
                    }
                }
                if (unChoix !== 'erreur') {
                    if (!trouver) {
                        be = new blockly_model_1.BlockErreur();
                        be.blockObjet = objet;
                        be.message = 'selection absente des valeurs';
                        //  r.push(be)
                    }
                }
            }
        }
        return { erreurs: r, mapChoix: mapChoix };
    }
    supprimer(nom) {
        fs_1.default.unlinkSync(`${this.repertoire}/${nom}.json`);
    }
    lister() {
        const tmpList = fs_1.default.readdirSync(this.repertoire);
        var list = [];
        tmpList.forEach((val) => {
            if (val.endsWith('.json')) {
                var nom = val.substr(0, val.length - 5);
                list.push(nom);
            }
        });
        return list;
    }
    charger(nom) {
        const fichier = `${this.repertoire}/${nom}.json`;
        if (fs_1.default.existsSync(fichier)) {
            if (fs_1.default.statSync(fichier).isFile()) {
                return JSON.parse(fs_1.default.readFileSync(fichier).toString());
            }
        }
        return projetBlockly();
    }
    enregistrer(nom, projet) {
        const fichier = `${this.repertoire}/${nom}.json`;
        fs_1.default.writeFileSync(fichier, JSON.stringify(projet));
    }
}
serveur_1.start(8080, new TestGestionProjet('c:/tmp/projets'));
//# sourceMappingURL=test.js.map
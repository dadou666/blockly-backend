"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.start = exports.App = void 0;
const express_1 = __importDefault(require("express"));
const bodyParser = __importStar(require("body-parser"));
const blockly_model_1 = require("blockly-model/dist/blockly-model");
class App {
    //Run configuration methods on the Express instance.
    constructor(gestionProjet) {
        this.express = express_1.default();
        this.middleware();
        console.log(__dirname + '/../src/public');
        this.express.use('/static', express_1.default.static(__dirname + '/../src/public'));
        this.express
            .route('/projet/:nomProjet')
            .get((req, res) => {
            res.status(200).send(gestionProjet.charger(req.params.nomProjet));
        });
        this.express
            .route('/projet/:nomProjet')
            .delete((req, res) => {
            gestionProjet.supprimer(req.params.nomProjet);
            res.status(204).send({});
        });
        this.express
            .route('/projet/:nomProjet')
            .post((req, res) => {
            const projetBlockly = req.body;
            gestionProjet.enregistrer(req.params.nomProjet, projetBlockly);
            res.status(204).send({});
        });
        this.express.route('/projets').get((req, res) => {
            res.status(200).send(gestionProjet.lister());
        });
        this.express
            .route('/validerEspaceDeTravail')
            .post((req, res) => {
            console.log('/validerEspaceDeTravail');
            const validerEspaceDeTravailQuestion = req.body;
            res
                .status(200)
                .send(gestionProjet.validerEspaceDeTravail(validerEspaceDeTravailQuestion));
        });
        this.express
            .route('/executer/:nomProjet')
            .get((req, res) => {
            res
                .status(200)
                .send(gestionProjet.executerProjet(req.params.nomProjet));
        });
    }
    // Configure Express middleware.
    middleware() {
        this.express.use(function (req, res, next) {
            res.header('Access-Control-Allow-Origin', 'https://web-platform-gfunjv.stackblitz.io');
            res.header('Access-Control-Allow-Methods', 'PUT,POST,DELETE,GET');
            res.header('Access-Control-Allow-Headers', 'Origin,X-Requested-With,Content-Type,Accept');
            next();
        });
        this.express.use(bodyParser.json());
        this.express.use(bodyParser.text());
        this.express.use(bodyParser.urlencoded({ extended: false }));
    }
}
exports.App = App;
function start(port, gestionProjet) {
    new App(gestionProjet).express.listen(port, () => {
        console.log('listening on port ' + port);
    });
}
exports.start = start;
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
start(8080, new TestGestionProjet('/home/projects/'));
//# sourceMappingURL=server.js.map
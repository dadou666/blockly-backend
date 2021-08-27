import e, { Application, Request, Response } from 'express';

import * as bodyParser from 'body-parser';
import {
  ArbreCategorie,
  BlockDefinition,
  BlockErreur,
  BlockObjet,
  GestionProjet,
  ExecuterJavascriptReponse,
  ExecuterJSONReponse,
  ValiderEspaceDeTravailReponse,
  ProjetBlockly,
  ValiderEspaceDeTravailQuestion
} from 'blockly-model/dist/blockly-model';

export class App {
  // ref to Express instance
  public express: e.Application;

  //Run configuration methods on the Express instance.
  constructor(gestionProjet: GestionProjet) {
    this.express = e();

    this.middleware();
    console.log(__dirname + '/../src/public');
    this.express.use('/static', e.static(__dirname + '/../src/public'));
    this.express
      .route('/projet/:nomProjet')
      .get((req: Request, res: Response) => {
        res.status(200).send(gestionProjet.charger(req.params.nomProjet));
      });
    this.express
      .route('/projet/:nomProjet')
      .delete((req: Request, res: Response) => {
        gestionProjet.supprimer(req.params.nomProjet);
        res.status(204).send({});
      });
    this.express
      .route('/projet/:nomProjet')
      .post((req: Request, res: Response) => {
        const projetBlockly: ProjetBlockly = req.body;
        gestionProjet.enregistrer(req.params.nomProjet, projetBlockly);
        res.status(204).send({});
      });
    this.express.route('/projets').get((req: Request, res: Response) => {
      res.status(200).send(gestionProjet.lister());
    });

    this.express
      .route('/validerEspaceDeTravail')
      .post((req: Request, res: Response) => {
        console.log('/validerEspaceDeTravail');
        const validerEspaceDeTravailQuestion: ValiderEspaceDeTravailQuestion =
          req.body;
        res
          .status(200)
          .send(
            gestionProjet.validerEspaceDeTravail(validerEspaceDeTravailQuestion)
          );
      });
    this.express
      .route('/executer/:nomProjet')
      .get((req: Request, res: Response) => {
        res
          .status(200)
          .send(gestionProjet.executerProjet(req.params.nomProjet));
      });
  }

  // Configure Express middleware.
  middleware(): void {
    this.express.use(function(req, res, next) {
      res.header(
        'Access-Control-Allow-Origin',
        'https://web-platform-gfunjv.stackblitz.io'
      );
      res.header('Access-Control-Allow-Methods', 'PUT,POST,DELETE,GET');
      res.header(
        'Access-Control-Allow-Headers',
        'Origin,X-Requested-With,Content-Type,Accept'
      );
      next();
    });

    this.express.use(bodyParser.json());
    this.express.use(bodyParser.text());
    this.express.use(bodyParser.urlencoded({ extended: false }));
  }
}

export function start(port: number, gestionProjet: GestionProjet) {
  new App(gestionProjet).express.listen(port, () => {
    console.log('listening on port ' + port);
  });
}
import fs from 'fs';
function projetBlockly(): ProjetBlockly {
  const mapBlockDefinition: { [nom: string]: BlockDefinition } = {
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

  const categorie: ArbreCategorie = {
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
class TestGestionProjet extends GestionProjet {
  executerProjet(
    nomProjet: string
  ): ExecuterJSONReponse | ExecuterJavascriptReponse {
    return {
      type: 'JSON',
      valeur: {
        message: ' c  ok et c cool courage ',
        projet: nomProjet
      }
    };
  }
  validerEspaceDeTravail(
    question: ValiderEspaceDeTravailQuestion
  ): ValiderEspaceDeTravailReponse {
    const r: BlockErreur[] = [];
    const objets: BlockObjet[] =
      question.projetBlockly.mapBlockObjets[question.espaceDeTravail];
    var be: BlockErreur;
    var mapChoix: { [id: string]: { [champ: string]: string[] } } = {};
    for (var objet of objets) {
      if (objet.nom === 'testChoixPourEnsemble') {
        var lst: BlockObjet[] = objet.elements.valeurs as BlockObjet[];
        var unChoix: string = objet.elements.unChoix as string;
        var count: { [nom: string]: number } = {};
        var trouver = false;
        var choix: string[] = [];
        lst.forEach((value: BlockObjet) => {
          const valeur: string = value.elements.valeur as string;
          if (valeur === unChoix) {
            trouver = true;
          }
          if (count[valeur]) {
            count[valeur]++;
          } else {
            count[valeur] = 1;
          }
          choix.push(valeur);
        });
        if (choix.length > 0) {
          mapChoix[objet.id] = { unChoix: choix };
        }

        for (var obj of lst) {
          const valeur: string = obj.elements.valeur as string;

          if (count[valeur] > 1) {
            be = new BlockErreur();
            be.blockObjet = obj;
            be.message = ` ${valeur} en ${count[valeur]} exmplaire`;
            r.push(be);
          }
        }
        if (unChoix !== 'erreur') {
          if (!trouver) {
            be = new BlockErreur();
            be.blockObjet = objet;
            be.message = 'selection absente des valeurs';
            //  r.push(be)
          }
        }
      }
    }

    return { erreurs: r, mapChoix: mapChoix };
  }
  repertoire: string;
  constructor(repertoire: string) {
    super();
    this.repertoire = repertoire;
  }
  supprimer(nom: string): void {
    fs.unlinkSync(`${this.repertoire}/${nom}.json`);
  }
  lister(): string[] {
    const tmpList: string[] = fs.readdirSync(this.repertoire);
    var list: string[] = [];
    tmpList.forEach((val: string) => {
      if (val.endsWith('.json')) {
        var nom = val.substr(0, val.length - 5);
        list.push(nom);
      }
    });
    return list;
  }

  charger(nom: string): ProjetBlockly {
    const fichier: string = `${this.repertoire}/${nom}.json`;
    if (fs.existsSync(fichier)) {
      if (fs.statSync(fichier).isFile()) {
        return JSON.parse(fs.readFileSync(fichier).toString());
      }
    }
    return projetBlockly();
  }
  enregistrer(nom: string, projet: ProjetBlockly): void {
    const fichier: string = `${this.repertoire}/${nom}.json`;
    fs.writeFileSync(fichier, JSON.stringify(projet));
  }
}

start(8080, new TestGestionProjet('/home/projects/'));

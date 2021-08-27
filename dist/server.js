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
            res.header('Access-Control-Allow-Origin', '*');
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
//# sourceMappingURL=server.js.map
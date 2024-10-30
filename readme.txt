=== Le Quiz ===
Tags: quiz, quizz, learning, QCM, formation
Requires at least: 4.9
Tested up to: 6.5.5
Stable tag: 1.6.2
License: GPLv2 or later
License URI : https://www.gnu.org/licenses/gpl-2.0.fr.html

Un quizz facile à mettre en oeuvre et personnalisable : QCM ou clavier, sablier, score, animation, jokers automatiques...

== Description ==
L’extension « Le Quiz » permet d’une part au gestionnaire d’un site WordPress de créer et de gérer très rapidement un quiz,
d’autre part aux internautes utilisant ce quiz de disposer de plusieurs fonctions de personnalisation :
- Choix du mode de réponse (saisie au clavier ou mode QCM)
- Choix de l’animation graphique
- Couleurs de l'interface
- Sablier
- Jokers
- Notion de score
- Aide interactive à l'utilistion
Stockage des réponses en local, pour une conservation même après relance du navigateur.
Aucune donnée concernant l'utilisateur final n'est stockée sur les serveurs.  

== Installation ==
Télécharger le plugin "Le Quiz", puis activez le.  
Cette opération entrainera les créations suivantes :
- Une catégorie « Le Quiz » (slug « le-quiz ») destinée à recevoir les articles contenant les différents quiz.
- Un article « Exemple de quiz » accessible dans la liste des articles, que vous pouvez éventuellement modifier, ou supprimer après créations de vos propres articles.
- Une page « Aide à l’utilisation du Quiz », à destination de l’utilisateur du quiz, que le gestionnaire peut personnaliser. Ne supprimez pas cette page.
- Un module de réglage des options par défaut. Il est inutile de modifier ces réglages dans la plupart ces cas.

= Création des quiz =
Créez un ou plusieurs articles qui contiendront les quiz. 
Chaque article contiendra une ou plusieurs questions.
Avec l’éditeur par défaut de WordPress ou un autre éditeur, chaque bloc, de type « Paragraphe », liste à puce, tableau ou autre, contiendra une ou plusieurs questions réponses. 
Sélectionnez chaque réponse et définissez la comme « Code en ligne ». 
Avant de publier la page, attribuez lui la catégorie « Quiz »

= Utilisation du quiz =
- Par défaut, les articles de quiz seront accessibles via la catégorie "Le Quiz".
- En mode QCM automatique, le plugin choisira quatre lettres au hasard en plus de la lettre correspondant à la réponse.   
- En mode saisie au clavier, chaque lettre juste rapporte un point, chaque lettre fausse coûte un point.
- Le sablier incite à répondre rapidement. Un point est retiré du score toutes les 5 secondes.
- La personnalisation des jokers permet au joueur de choisir le niveau de difficulté qui lui convient. 
- La personnalisation, le score et les réponses déjà effectuées sont conservés même après arrêt et relance du navigateur, en local afin de préserver la vie privée des internautes. 

== Changelog ==

= 1.0 =
* Date mise à jour - 18 aout 2021 * 
Module utilisé pour le site : https://quiz.calagenda.fr, qui n'utilise pas Wordpress.

= 1.1 =
* Date mise à jour - 2 octobre 2021 *
Première version du module diffusée en tant que plugin Wordpress.

= 1.2 =
* Date mise à jour - 23 octobre 2021 *
Repositionnement dans la page après perdonnalisation ou réinitialisation du score.
Affichage du score en pourcentage du nombre total de réponses.
Mise à jour de la page d'aide à l'utilisation du quiz.

= 1.3 =
Utilisation du numéro de post à la place del'URL pour déterminer l'identification de la question
Correction pour cacher les réponses dans les listes d'articles.
Positionnement du menu du quiz (Aide, Personnaliser, Score) directement après la dernière question
Mise en évidence, en jaune, de la réponse dans l'éditeur, si 'code en ligne'
Ajout de la balise 'Souligner (<u>)' pour la réponse
Correction du dimensionnement de la zone de saisie pour la réponse, en mode 'Joker et clavier'
Taille et police des caractères constante dans la boite de dialogue au-dessous de la réponse : Arial, 16px
Optimisation : les fichiers js et css du quiz ne sont chargés que s'ils sont nécessaires.  

= 1.4 =
Possibilité pour le gestionnaire de définir lui-même son QCM
Possibilité de placer plusieurs questions/réponses dans le même bloc
Filtrage des éléments et des attributs HTML contenus dans la réponse 
Prise en charge de la version PHP 8.0
Correction dans le cas où la réponse ne fait qu'un caractère.
Correction dans le cas où le site WordPress n'est pas installé à la racine du domaine ou sous-domaine.
Mise à jour de la page d'aide à l'utilisation du quiz.

= 1.5 =
Sécurité du traitement : Passage des variables javascript globales en locales
Confidentialité des réponses : Codage des réponses (justes et fausses) dans le source HTML

= 1.6.2 =
Normalisation pour wordpress.org

== Screenshots ==
1. Editer un QCM automatique
2. Affichage du QCM automatique
3. Exemple de question réponse
4. Les options du gestionnaire
5. Les options de l'utilisateur
6. Les jokers

String.prototype.sansAccent = function(){
    var accent = [
        /[\300-\306]/g, /[\340-\346]/g, // A, a
        /[\310-\313]/g, /[\350-\353]/g, // E, e
        /[\314-\317]/g, /[\354-\357]/g, // I, i
        /[\322-\330]/g, /[\362-\370]/g, // O, o
        /[\331-\334]/g, /[\371-\374]/g, // U, u
        /[\321]/g, /[\361]/g, // N, n
        /[\307]/g, /[\347]/g, // C, c
    ];
    var noaccent = ['A','a','E','e','I','i','O','o','U','u','N','n','C','c'];
     
    var str = this;
    for(var i = 0; i < accent.length; i++){
        str = str.replace(accent[i], noaccent[i]);
    }
    return str;
    }
    
function classe_lequiz()
{    
var qz_version = "22" // version du script quizz.js, n'a rien à voir avec la version du plugin wordpress    
// les varables par defaut, éventuellement modifiées pour l'extension wordpress
var qz_plugin = false  // false s'il ne s'agit pas du plugin WordPress
var qz_idnum = false  // false si le numéro de question est déjà mis en page, true s'il doit être calculé

var qz_article = "#larticle" // sélecteur d'article qui permettra de récupérer qojb_article
var qobj_article = ""  // contiendra l'élément html qui contient lui-même toutes les questions réponses
var qz_mark = "mark"
var qz_nok = "s"   
var qz_postid = ""   // numero du post si extention WordPress 
var qz_defaut = "quiz"
var qz_persist = false
var qz_lienquiz = "Afficher le quiz"
var qz_lienreponse = "Voir les réponses"
var qz_siteurl = "" // adresse du site Wordpress (pour gérer le cas ou le site Wordpress n'est pas à la racine du domaine/sous-domaine) 
var qz_url_plug = ""  // pour l'extension wordpress
var qf_cookie = "OOOM"
var qz_choix_q_or_r = "" // "quiz ou reponse, ou vide s'il ne s'agit pas d'une extension

var qp_data_qdate = "data-qdate" //  nom de l'attribut unique des éléments correspondants aux réponses
var qp_type = 1 // 0=affichage immediat, 1=jokers et QCM (defaut sur smatphone), 2=jokers et clavier (défaut sur ordi) (voir aussi charger_quizz())
var qp_af = 0  // 0=ne pas afficher, 1 = premier caractère, 2 = anagramme
var qp_anim = "2" // 0 = pas d'animation, 0.5 = trés rapide, 1=rapide, 2 = normal, 3=lent
var qp_color = "soutenu" //  "pastel" ou "soutenu"
var qp_sablier = 30000   // temps en millisecondes au delà duquel la réponse est considérée acomme fausse (0 = pas de sablier et pas de calcul du temps de réponse moyen))
var qp_aide = 1 // aide interactive (infos bulles furtives de 3 secondes)
var q_sablier_ID = -1 // numéro du timeout
var q_sablier_ano = 1 // nombre de fois ou le message 'trop tard' sera affiché avant affichage de l'aide futive pour personnaliser le sablier
var q_clavier_ano = 3 // nombre de fois ou on n'affichera pas l'aide furtive qui propose l'utilisation du QCM à la place du clavier 
var q_sablier_time = 0
var qp_numjoker = 0 // premier numéro de joker à jouer
var qp_derjoker = 7 // numero de joker utilisé si pas de joker (pas de joker coché ou QCM défini par le gastionnaire
var qz_jokers = 2   // jokers par défaut 1=aucun, 2=montrer un mot et un caractère, 3=tous 
var qp_niveau = "M"
// console.log ("qp_niveau=" + qp_niveau)
var q_t = new Array()  // tableau des objets en mémoire pour chaque question (objet initialisé dans q_initbox())
var q_tmots = new Array()  // table des mots des réponses avec leur position (si extention wordpress)
var q_tmotpage = new Array()  // tables des reponses avec l'adresse de la réponse (URL/numpost + réponse + rang de la réponse dans la page (0 si la réponse n'est présente qu'une fois dans la page) 
var q_tabrep = new Array()  // tableau des objets en mémoire pour chaque question (objet initialisé dans q_initbox())
var q_tabnok = new Array()  // tableau des réponses fausses
var qb_mabox    // élement de classe 'qb_box' en cours
var qb_monpara  // paragraphe en cours
var qp_joker = new Array  // tableau des paramètres des jokers

var qcm_v = "aaeeiioouuy"  // chaine des voyelles éligibles au qcm 
var qcm_c = "bbccddffgghjjkllmmnnppqrrssttvvwxz" // chaine des consomnes éligibles au qcm
var qcm_n = "0123456789"  // chaine des chiffres éligibles au qcm 
var qcm_lettreouchiffre = "une lettre"  // une lettre ou un chiffre
var q_page_pref = ""      // numéro du post si WordPress, sinon URL
var q_aide_bool = false  // gestion d ela bulle d'aide
var q_aide_num = 0 // nb clic en cascade ...
var q_nb_troptard = 0 // nombre de fois dans la page ou s'est trop tard à cause du sablier
var q_nb_clavier_faux = 0   // Nombre de fois ou on pouurait suggérer joker et QCM à la place de clavier 
var q_aide_lib = "" // libellé de l'aide furtive, fonction des jokers
var q_aide_lib_action = ""  // fonction du type de jeu (qcm ou clavier)
var q_aide_toucher = ""     // fonction de ordi (cliquer sur) ou smartphone (toucher)
var q_aside_bodyTop = 0     // valeur du scroll pour le retour au quiz
var q_prem_charger = true  // true si premier chargement, sinon false (pour un fonctionnement correct dans le cas du retour au quiz via la page aide, score ou personnaliser) 
var q_height_adrenalead  = 0   // hauteur de l'annonce adrenalead ou 0  
var q_cookie_h = 0  // réservé calagenda.fr
function q_clavier_virtuel_f () {  // si clavier virtuel, il faut cacher temporairement l'annonce adrenalead
	try{document.createEvent("TouchEvent");  
		  return true;  }
	catch(ex){	return false;  }  
   } 
var q_clavier_virtuel = q_clavier_virtuel_f()   
var q_ecran_taille = 2400 // largeur + hauteur écran, en pixels, mis à jour dans charger_quizz() 
var qb_texte = ""       // texte de la qb_box 
// fin des variables pour quizz.js 

var qw_date = new Date()
qw_date = qw_date.getDate() + '/' + (qw_date.getMonth()+1) + '/' + qw_date.getFullYear() + ' à '  + qw_date.getHours() + 'H' + qw_date.getMinutes() + 'M'  + qw_date.getSeconds() + 'S'
var q_score = ""   // chaine des résultats (séparés par des virgules)
var q_tscore = ""  // tableau des résulats
// version, date, questions, rep exactes, rep fausses, joker texte non utilsés, utilisés, autres jokers, clavier juste, clavier faux, score
var q_totscore = 0      // score initial (10 points par question)
var q_tot_jt_ok = 0     // jokers dans les évenements non utilisés 
var q_tot_jt_nok = 0    // jokers dans les évenements utilisés 
var q_tot_jt_q = 0      // autres jokers utilisés
var qw_jt_ok, qw_jt_nok, qw_rep_title, elcg,elcl, num, qz_ya_un_quizz, qcm_car,qw_data_qdate,qw_lepara, qw_num, qw_rep, qw_ret
var q_texte, q_texte_bt, q_lepara

var q_courant = -1  // numéro du quizz en cours (boite qb_box visible) 

this.init = function ()
   {this.qz_article = qz_article
    this.qz_plugin = qz_plugin
    this.qz_idnum = qz_idnum
    this.qz_mark = qz_mark
    this.qz_nok = qz_nok
    this.qz_postid = qz_postid
    this.qz_defaut = qz_defaut
    this.q_trep = new Array()
    this.q_tnok = new Array()
    this.qz_persist = qz_persist
    this.qz_lienquiz = qz_lienquiz
    this.qz_lienreponse = qz_lienreponse
    this.qp_type = qp_type
    this.qp_sablier = qp_sablier
    this.qp_af = qp_af
    this.qp_color = qp_color
    this.qp_anim = qp_anim
    this.qz_jokers = qz_jokers
    this.qp_aide = qp_aide
    // this.user_agent_type = user_agent_type
    this.qz_url_plug = qz_url_plug
    this.qz_siteurl = qz_siteurl
    // this.q_t = q_t  
    // this.q_tmots = q_tmots 
    // this.q_tmotpage = q_tmotpage 
   }
   
this.charger_quizz  = function  () // charger_quizz est appelé à la fin du chargement de chaque page de quizz 
 {
  // console.log ("ça scrolle")
  // document.location.href = "#" + qz_article
  qz_article = this.qz_article 
  qz_plugin = this.qz_plugin
  qz_idnum = this.qz_idnum 
  if (q_prem_charger)
      {qobj_article = document.querySelector(qz_article)
      if (qobj_article == null)  
          {return}
      }      
  // console.log (qobj_article)   
  qz_mark = this.qz_mark
  qz_nok = this.qz_nok 
  qz_postid = this.qz_postid 
  qz_defaut = this.qz_defaut 
  qz_persist = this.qz_persist
  // q_tabrep = this.q_tabrep
  // q_tabnok = this.q_tabnok
  if ((!qz_idnum)&&(q_prem_charger))
     {debrasser(this.q_trep,q_tabrep)                   // decoder les caractères dans les réponses justes
      debrasser(this.q_tnok,q_tabnok)}                  // decoder les caractères dans les réponses fausses
  qz_lienquiz = this.qz_lienquiz
  qz_lienreponse = this.qz_lienreponse  
  qp_type  = this.qp_type
  qp_sablier = this.qp_sablier
  qp_af = this.qp_af
  qp_color = this.qp_color
  qp_anim = this.qp_anim
  qz_jokers = this.qz_jokers
  qp_aide = this.qp_aide
  // user_agent_type = this.user_agent_type
  qz_url_plug = this.qz_url_plug
  qz_siteurl = this.qz_siteurl
  q_t.length = 0           // on réinitialise ce tableau, pour le cas ou on recharge le quiz aprés peronnalistion ou raz du quiz.
  q_tmots = []       // idem
  q_tmotpage = []    // idem
  q_height_adrenalead = 0
  if (qz_plugin)
     {qf_cookie = "OOOM"
     }    
     else
     {try {qf_cookie = lireCookie("OH")} catch (ex) {qf_cookie = "OOOM"}
      q_height_adrenalead = (((pub_adrenalead==false)||((window.outerWidth + window.outerHeight)<800))?0:(q_clavier_virtuel?260:360))}
  q_page_pref = location.pathname.substring(1).sansAccent().toLowerCase()
  if (qz_plugin)  
     {q_page_pref = qz_postid
      qz_choix_q_or_r = qp_lect("qz_choix_q_or_r",qz_defaut) }
  // console.log (q_page_pref)    
  if (qf_cookie == null) {qf_cookie = "OOOM"}
  if (qf_cookie.length == 4)
   {qp_niveau = qf_cookie.substring(3)}
  q_courant = -1  
  qp_joker[1] = {"OK":false,"type":"","pena":0,"lib":"X"}                  // réservé usage ultérieur
  qp_joker[2] = {"OK":(qz_jokers<2?false:true),"type":"NM","pena":-2,"lib":"Montrer un mot"}
  qp_joker[3] = {"OK":false,"type":"","pena":0,"lib":"X"}                  // réservé usage ultérieur
  qp_joker[4] = {"OK":(qz_jokers<3?false:true),"type":"NC","pena":-1,"lib":"Nb caractères"}   // Désactivé par défaut
  qp_joker[5] = {"OK":(qz_jokers<2?false:true),"type":"NP","pena":-1,"lib":"Un caractère"}
  qp_joker[6] = {"OK":(qz_jokers<3?false:true),"type":"NA","pena":-1,"lib":"Anagramme"}
  qp_joker[7] = {"OK":true,"type":"A","pena":0,"lib":""}                 // pour afficher 'Afficher' (ou 'Perdu' saisie au clavier.
  qp_joker[8] = {"OK":true,"type":"R","pena":0,"lib":"R"}                 // pour afficher 'Trouvé' ou 'Perdu'
  qp_lect_params()

  qb_texte = "<div style='clear:both'></div>"
  qb_texte += "<div class='qb_box' id='qbn_q_num_q' style='display:none' onclick='if (event.stopPropagation) {event.stopPropagation();}';>"
  qb_texte += "<div class='qb_aide' style='display:none' onclick='this.style.display=\"none\"'></div>"  
  qb_texte += "<div style='float:left' class='qb_score'></div>"
  qb_texte += "<div style='width:26px;float:right;box-sizing:content-box;'>"
  qb_texte += "<div style='padding:5px 0px 5px 0px;margin-bottom:5px;background-color:red;cursor:pointer;' onclick='lequiz.qb_on_ferme(this)' title='Fermer'>X</div>"
  qb_texte += "<div style='padding:0px;cursor:pointer;' onclick='lequiz.qb_fmenu(this)'><img style='padding:0px;' src='" + (qz_plugin?qz_url_plug + "/img" :"../img")  + "/outils.png'></div>"
  qb_texte += "</div>"
  qb_texte += "<div class='qb_menu' style='display:none;'>"
  qb_texte += "<div style='float:right;background-color:red;padding:5px 8px 5px 8px;cursor:pointer;' onclick='lequiz.qb_fmenu(this.parentElement)' title='Fermer'>X</span></div>"
  qb_texte += "<div class='qb_lignemenu' style='float:left;display:inline-block;' onclick='lequiz.asidequizz(\"aide\")'>Aide</div>"
  qb_texte += "<div class='qb_lignemenu' style='clear:both;' onclick='lequiz.q_page_perso(this)'>Personnaliser</div>"
  if (!qz_plugin)
      {qb_texte += "<div class='qb_lignemenu' onclick='lequiz.asidequizz(\"partage\")'>Partager</div>"}
  qb_texte += "<div class='qb_lignemenu' onclick='lequiz.q_page_score(this)'>Score / Réinitialiser</div>"
  if (!qz_plugin)
      {qb_texte += "<div class='qb_lignemenu' onclick='lequiz.f_signaler(q_num_q)'>Signaler / Proposer</div>"}
  qb_texte += "</div>"
  qb_texte += "<div style='float:left;margin-left:12px;'><span class='qb_lib'></span>"
  if (qp_type > 0)
    {qb_texte += "<br><span class='qb_multi' title='Choisissez une lettre qui correspond à la réponse'></span>" }
  qb_texte += "</div>"
  qb_texte += "<div style='clear:both;padding:0px;'></div>"
  qb_texte += "</div>"
  qb_texte += "<div style='clear:both'></div>"
   
  q_score = qp_lect("q_score","v" + qz_version + "," + qw_date +",0,0,0,0,0,0,0,0,0,0" )
  q_tscore = q_score.split(",")
  if (q_tscore[10] > 100)
      {q_sablier_ano = 3}
  q_aide_toucher = (q_clavier_virtuel?"toucher":"cliquer sur")
  if (q_prem_charger)
      {q_ecran_taille = innerWidth + innerHeight}
  // q_aide_toucher = "cliquer sur"
  q_aide_lib_action = (qp_type==1?"Choisir " + qcm_lettreouchiffre +  "(jaune)":"Saisir un caractère")
  if (!qz_plugin)
     {try {qr_url_cur = "/" + q_url_cur}  // q_url_cur est généré en php dans /histoire-date.php, pour gérer le cas de la page d'accueil
        catch (ex) {qr_url_cur = location.pathname}
      if (qr_url_cur.indexOf("histoire") > -1)
         {sessionStorage["adr_quizz"] = qr_url_cur} 
         else
         {if ((sessionStorage["adr_quizz"] + "").indexOf("histoire") > -1)
             {document.getElementById("q_ad_site_evt").href = document.getElementById("g_divsearch").getAttribute("data-sitecal") + sessionStorage["adr_quizz"] }
             else  // les pages sans quizz (cgu.html, cookies, mail...)
             {
             document.body.classList.add("lequiz_no")
             return
             } 
         } 
     }  
  // if ((!qz_plugin) && (document.getElementById("styles_quizz") == null))  // les pages sans quizz (cgu.html, cookies, mail...)
  //     {document.body.classList.add("lequiz_no")
  //    return}
  qf_styles()
  var qw_tdeja = new Array
  var q_Node_nok = qz_nok.toUpperCase()
  if ((q_prem_charger) && (qz_plugin)&&((qz_idnum)||(qz_choix_q_or_r != "quiz"))) // si extension wordpress et (idnum ou réponses) 
     {elcg = qobj_article.querySelectorAll(qz_mark)  // toutes les questions de la page
      elcl = elcg.length
      var qw_numid = 0  // utilisé pour l'extension wordpress, si qz_plugin est true
      // console.log ( "" + elcg.length + " questions" )
      // sss = eee.fff.ttt
      if (elcl > 0)
         {for (var i=0;i<elcl;i++)   // chaque question de la page 
              {if (elcg[i].offsetWidth > 0)  // si offsetWidth est égal à zero, l'élément est caché (cas des listes avec certains thèmes)
                  {var qw_repseule = ""
                  var qw_nok = ""
                  var elcg_nok = elcg[i].childNodes
                  var elcl_nok = elcg[i].childNodes.length
                  if (elcl_nok < 2)
                     {qw_repseule = elcg[i].innerHTML}  // réponse exacte sans QCM, donc le QCM sera automatique
                     else
                     {for (var j=0;j<elcl_nok;j++)      // reponse avec QCM
                          {if (elcg[i].childNodes[j].nodeName == q_Node_nok)
                              {var qw_unnok = elcg[i].childNodes[j].textContent.trim()
                               if (qw_unnok.substring(0,1) == ",")
                                  {qw_unnok = qw_unnok.substr(1)}
                               if (qw_unnok.substring(qw_unnok.length - 1) == ",")
                                  {qw_unnok = qw_unnok.substr(0,qw_unnok.length - 1)}
                               qw_nok += "," + qw_unnok   } // reponses fausses
                              else
                              {qw_repseule += elcg[i].childNodes[j].textContent }          // reponse exacte
                          }
                     qw_nok = qw_nok.replace(/,,/g,",").replace(/\s+/g,' ') // on remplace toute suite d'espaces par un seul  
                     if (qw_nok != "")
                        {qw_nok = qw_nok.substring(1)}  
                     }
                  if(qz_choix_q_or_r == "quiz")
                     {qw_repseule = qw_repseule.replace(/\s+/g,' ').trim()  // on remplace toute suite d'espaces par un seul 
                     q_tabrep[qw_numid] = qw_repseule
                     q_tabnok[qw_numid] = qw_nok
                     elcg[i].outerHTML = "<" + qz_mark + " id='qn_" + qw_numid + "' onclick='lequiz.q_clic(this)'>" + qw_repseule + "</" + qz_mark + ">"
                     }
                     else
                     {elcg[i].outerHTML = "<b>" + (qz_idnum?qw_repseule:q_tabrep[elcg[i].id.substring(3)]) + "</b>" }     
                  qw_numid++
                  } 
                  else
                  {elcg[i].outerHTML = ""}  
              }   
         }
       }  
       if (qz_plugin)
           {document.body.classList.add("lequiz_ok")
            var qz_t = "<div style='display:inline-block;font-weight:bold'><a href='https://lequiz.calagenda.fr' title='Installez rapidement un quiz dans votre site Wordpress'>Quizz</a> : </div>"
            if (qz_choix_q_or_r == "quiz")
                {
                qz_t += "<div class='qz_elnavig' onclick='lequiz.asidequizz(\"aide\")'>Aide</div>"
                qz_t += "<div class='qz_elnavig' onclick='lequiz.q_page_perso(this)'>Personnaliser</div>" 
                qz_t += "<div class='qz_elnavig' id='q_bt_score' onclick='lequiz.q_page_score(\"personne\")'>Score</div>"
                if (qz_lienreponse != "")
                    {qz_t += "<div class='qz_elnavig' onclick='lequiz.qz_affiche_reponse()'>" + qz_lienreponse + "</div>"}                
                }
                else
                {if (qz_lienquiz != "")
                    {qz_t += "<div class='qz_elnavig' onclick='lequiz.qz_affiche_quiz()'>" + qz_lienquiz + "</div>"}
                }
            var qz_newDiv = document.getElementById("qz_navig")
            if (qz_newDiv === null)   
               {qz_newDiv = document.createElement("div")
            // console.log ("AAAA")
               qz_newDiv.id = "qz_navig"
               var qz_currentDiv = qobj_article ;
               qz_currentDiv.parentElement.insertBefore(qz_newDiv, qz_currentDiv.nextSibling);
               }
            qz_newDiv.innerHTML = qz_t
           if (!qz_persist)
                {localStorage["qz_choix_q_or_r"] = qz_defaut }
           if (qz_choix_q_or_r != "quiz")
               {q_prem_charger = false
                return} 
           } 
  elcg = qobj_article.querySelectorAll(qz_mark)  // toutes les questions de la page
  elcl = elcg.length
  // console.log ( "" + elcg.length + " questions" )
  qz_ya_un_quizz = false  // indicateurs qui dit si au moins un quiz exitse sur la page
  try {if (q_tabrep.length > 0) {qz_ya_un_quizz = true} }
      catch (ex) {}
  
  if (elcl > 0)
     {for (var i=0;i<elcl;i++)   // chaque question de la page 
		 {
		  num = elcg[i].id.substring(3)
		  // console.log ("on regarde " + num)
		  var qw_spage = elcg[i].getAttribute(qp_data_qdate)  // test si présence d'un attribut unique pour la réponse
		  if (qw_spage == null)  // sinon, on prend la page et le contenu de la réponse, auquel on ajoute un rang à pertir de zéro, comme attribut unique
				{var qw_smot = q_tabrep[num].sansAccent().toLowerCase() 
				 if (q_tmots[qw_smot] === undefined)
				     {q_tmots[qw_smot] = 0}
				     else
				     {q_tmots[qw_smot]++} 
				 qw_spage = q_page_pref + "(" +   qw_smot +  "-" + q_tmots[qw_smot] + ")"
				 q_tmotpage[num]	= qw_spage}
		  qw_spage = qp_lect("p_"+ qw_spage,"")  // score éventuel si une réponse à déjà été faite précédemment 
      if (!q_prem_charger)
          {
          qw_lepara = elcg[i].parentElement
          var qw_labox = qw_lepara.querySelector("#qbn_" + num)
          if (qw_labox !== null)
             {qb_parinit(qw_lepara)
              qw_lepara.removeChild(qw_labox)}  // on retire la box (cas du retour aprés personnalisation ou initialisation du score
          }
		  if (qw_spage == "")
			 {// console.log ("on charge " + num)
			  if (q_prem_charger)
			     {elcg[i].style.width = (elcg[i].offsetWidth + 6 ) + "px"}
			  if (qp_af == 0)
				{elcg[i].innerHTML = "&nbsp;"}
				else
				{if (qp_af == 1)
					{elcg[i].innerHTML = q_tabrep[num].substring(0,1)  // affficher la première lettre de la réponse
					 // console.log ("OK")
					 }
				else
				  {elcg[i].innerHTML = q_tabrep[num].replace(/&nbsp;/g," ").sansAccent().toLowerCase().split("").sort().join("") }  // afficher l'anagramme de la réponse
				   // elcg[i].innerHTML = elcg[i].innerHTML.replace(/&nbsp;/g," ").sansAccent().toLowerCase().split("").sort().join("") }  // afficher l'anagramme de la réponse
				 } 
			  elcg[i].title = "Cliquer pour " + (qp_type == 0 ?"afficher la":"proposer une") + " réponse" 
			  elcg[i].className = ""
			  elcg[i].style.whiteSpace = "nowrap"
			  elcg[i].style.visibility = "visible"	  
			  }  
			  else
			  {qw_tdeja[num] = qw_spage
			  elcg[i].style.visibility = "visible"	
			  }
		}
    } 
	if (qw_tdeja.length > 0)
	    {for (var i = 0;i<qw_tdeja.length;i++)
		     {if ("" + qw_tdeja[i] != "undefined")
					{ // console.log ("num " + i + " = " + qw_tdeja[i])
					  var qw_laquestion = document.getElementById("qn_" + i)
					  qw_lepara = qw_laquestion.parentElement
					  q_initbox(qw_lepara,qw_laquestion,i,false) 
					  q_t[i].score = qw_tdeja[i]
					  q_result(i,false)
					  q_af_score(i,qw_tdeja[i])
					  qw_laquestion.style.visibility = "visible"	
	  			  lequiz.qb_fermer("",i)  // pour le cas ou on réinitialise le score ou on personnalise
					  }
			 }
		}
  q_bt_score("auto")
  q_prem_charger = false
	}	

function unEntier(max, aleatoire) // retourne un nombre entier aléatoire positf compris entre 0 et max inclus, avec en entrée un nombre aléatoire  
  {
  // max = Math.floor(max);
  return aleatoire % max 
  // return Math.floor(Math.random() * (max - min +1)) + min;
  }
function debrasser(q_tabin,q_tabout)   // on decode la table q_tabin, resultat dans q_tabout 
   {
    var q_repx = ['a','b','c','d','e','g','h','j','k','m','n','o','q','r','n','u','v','w','y','A','B','C','D','E','G','H','J','K','M','N','O','Q','R','N','U','V','W','Y']
    var q_repy = ['b','a','r','q','u','o','n','k','j','w','h','g','d','c','h','e','y','m','v','B','A','R','Q','U','O','N','K','J','W','H','G','D','C','H','E','Y','M','V']
    var q_repres, q_repcar, q_reptexte
        if (q_tabin.length > 0)
       {for (var i=0;i<q_tabin.length;i++)
            {q_reptexte = q_tabin[i]
             q_repres = ""
             if (q_reptexte.length > 0)
                 {for (var j= 0; j<q_reptexte.length;j++)
                      {q_repcar = q_reptexte.substring(j,j+1)
                       for (var k=0;k<q_repx.length;k++)
                           {if (q_repcar == q_repy[k])
                               {q_repcar = q_repx[k]
                                break}
                           }
                        q_repres += q_repcar   
                       }
                  }
             q_tabout[i] = q_repres
             }
       }      
   }    
function qf_styles()
		{
		var q_sts = ""
		var q_pre_mark = (qz_plugin?".lequiz-bloc ":"")
		q_sts += q_pre_mark + qz_mark + " {white-space:nowrap;top:initial;font-size:inherit;font-family:inherit;line-height:initial;}"
		q_sts += q_pre_mark + qz_mark + ":empty {background-color:yellow;}"
		q_sts += q_pre_mark + qz_mark + " " + qz_nok + " {display:none;}"
		q_sts += q_pre_mark + qz_mark + "[id^=qn_] "  + qz_nok + " {display:inline;}"
		q_sts += q_pre_mark + qz_mark + " input {transition-duration:0s;display:inline-block;line-height:inherit !important;padding:inherit !important;padding-right:0px !important;box-sizing:content-box !important;}"
		q_sts += qz_mark + "[id^=qn_], .enavant mark, #qpp_rem_anim " + qz_mark + ", #qpp_rem_af " + qz_mark + " {margin:2px 0px 2px 0px;background-color:yellow;color:black;border:1px solid black;border-radius:5px;padding:0px 5px 0px 5px;display:inline-block;cursor:pointer;min-width:100px;margin-left:3px;visibility:hidden;box-sizing:content-box;} "
		if (qp_anim > 0)  // animation des jokers texte
		   {q_sts += ".q_joker .q_joker_anim {animation-duration: " + qp_anim + "s;animation-name: slidein;background-color:#FFFFFF}" 
		   q_sts += ".q_rep_anim_ok .q_rep_anim, .q_rep_anim_nok .q_rep_anim  {animation-duration: " + qp_anim + "s;animation-name: slidein;}"
		   }
		if (qp_color == "pastel")
		   {q_sts += ".q_rep_anim_ok, .q_rep_nanim_ok{background-color:#66ff66 !important;color:#000000 !important;}"
		    q_sts += ".q_rep_anim_nok, .q_rep_nanim_nok {background-color:pink !important;color:#000000 !important;}"
		    q_sts += ".q_l_joker {background-color:cyan;color:#000000;}"}
		   else
		   {q_sts += ".q_rep_anim_ok, .q_rep_nanim_ok {background-color:green !important;color:#FFFFFF !important;}"
			  q_sts += ".q_rep_anim_nok, .q_rep_nanim_nok {background-color:red !important;color:#FFFFFF !important;}"
			  q_sts += ".q_l_joker {background-color:blue;color:#FFFFFF;}" }
		if ((qz_plugin) &&(document.getElementById("styles_quizz")===null))	  
		   {
       var qw_styles = document.createElement('style')
       qw_styles.id = "styles_quizz"
       document.head.appendChild(qw_styles)		   
		   }
		document.getElementById("styles_quizz").innerHTML = q_sts  
		}

function qp_lect_params()
    {qp_numjoker = 0
		qp_niveau = "M"
    if (qf_cookie.length == 4)
       {qp_niveau = qf_cookie.substring(3)}
		qp_type=qp_lect("qp_type",qp_type)
		qp_af=qp_lect("qp_af",qp_af)
		qp_anim=qp_lect("qp_anim",qp_anim)
		qp_color=qp_lect("qp_color",qp_color)
		qp_sablier=qp_lect("qp_sablier",qp_sablier)
		qp_aide=qp_lect("qp_aide",qp_aide)
		qp_joker[2].OK=qp_lect("qp_j_2",qp_joker[2].OK)
		qp_joker[4].OK=qp_lect("qp_j_4",qp_joker[4].OK)
		qp_joker[5].OK=qp_lect("qp_j_5",qp_joker[5].OK)
		qp_joker[6].OK=qp_lect("qp_j_6",qp_joker[6].OK)
		if (qp_numjoker == 0)
			{qp_numjoker = qp_derjoker}
	}
	
this.qp_ecr_params = function()
    {	// console.log ("type" + document.getElementById("qpp_type").value)
    var qp_old_niveau = qp_niveau
    qp_niveau = (qz_plugin?"M":document.getElementById("qpp_niveau").value)
    qf_cookie = qf_cookie.substr(0,3) + qp_niveau
    if (!qz_plugin)
       {creerCookie("OH",qf_cookie,360)}
		localStorage["qp_type"] = document.getElementById("qpp_type").value
		localStorage["qp_af"] = document.getElementById("qpp_af").value
		localStorage["qp_anim"] = document.getElementById("qpp_anim").value
		localStorage["qp_color"] = document.getElementById("qpp_color").value
		localStorage["qp_aide"] = document.getElementById("qpp_aide").value
		localStorage["qp_sablier"] = document.getElementById("qpp_sablier").value
		localStorage["qp_j_2"] = document.getElementById("qpp_j_2").checked?"true":"false"
		localStorage["qp_j_4"] = document.getElementById("qpp_j_4").checked?"true":"false"
		localStorage["qp_j_5"] = document.getElementById("qpp_j_5").checked?"true":"false"
		localStorage["qp_j_6"] = document.getElementById("qpp_j_6").checked?"true":"false"
		if (qp_old_niveau != qp_niveau)
		    {q_bon_quizz()
		    return} 
		lequiz.charger_quizz()
		lequiz.fermer_q_aside()
		//location.replace("#lehaut")
    //if ((location.pathname.indexOf("histoire") > -1)||(qz_ya_un_quizz))
    //   {location.reload()}
    //   else
    //   {q_bon_quizz()}
	}	

function qp_lect(qp_nom,qp_val)
  {var qp_param = "" + localStorage[qp_nom]
   var qpw_val = ""
   if ((qp_param== "undefined") ||(qp_param== null) ||(qp_param== ""))
      {qpw_val = qp_val}
	  else
	  {qpw_val = qp_param
	   if (qp_param == "true") {qpw_val = true}
	   if (qp_param == "false") {qpw_val = false}
		}
    if ((qp_nom.substring(0,5) == "qp_j_") && (qp_numjoker == 0) && (qpw_val == true))
       {// console.log (Math.abs(qp_nom.substring(2)))
	    qp_numjoker = Math.abs(qp_nom.substring(5))}
    return qpw_val	   
  }

this.qb_fmenu = function (moi) 
  {// console.log ("ca ferme?")
   qb_mabox = moi.parentElement.parentElement
   qw_num = qb_mabox.id.substring(4) 
   var qb_monmenu = qb_mabox.querySelector(".qb_menu")
   if (qb_monmenu.style.display == "none")
       {qb_monmenu.style.display = "block"}
	   else
	   {qb_monmenu.style.display = "none"}
   if (qp_type == 2)
       {try {document.getElementById("qn_" + num).querySelector(".q_input").focus()} catch (ex) {}}
  }
this.qb_fermer = function(moi,num)
  {q_courant = -1
  // q_aide_num = -1
  if (moi == "")
      {qb_monpara = q_t[num].lepara
      qw_num = num
	    qb_mabox = document.getElementById("qbn_" + qw_num) }
	 else
      {qb_mabox = moi.parentElement.parentElement
	     qb_monpara = qb_mabox.parentElement
	     qw_num = qb_mabox.id.substring(4) }
	 document.getElementById("qn_" + qw_num).style.outline = "none"    
   qb_mabox.querySelector(".qb_menu").style.display="none"
   qb_mabox.style.display = "none" 
   qb_parinit(qb_monpara)
   q_sablier_delete(qw_num,true)
	}
this.qb_on_ferme = function(moi)
    {this.qb_fermer(moi) 
    if ((!qz_plugin))
        {nadz_on_off('initial')}}

function qb_parinit(qw_monpara)	
   {qw_monpara.onclick = null
   qw_monpara.style.outline = "none"
   }
function q_sablier_delete(num,trait)
  {if (q_sablier_ID != -1)
      {clearTimeout(q_sablier_ID)
      q_sablier_ID = -1
      if (trait)
         {q_t[num].sablier += Date.now() - q_t[num].sablier_start}
      }
  } 
 
this.q_joker = function (ob)
  {// console.log("je passe")
   // qw_i_score : true s'il faut calculer le score, sinon false  
   q_aide_num = -1
   var qw_i_score = (arguments.length>1?arguments[1]:true)
   ob.style.display = "none"
   objoker = ob.parentElement
   objoker.style.visibility = "visible"
   objoker.style.minWidth = "1px"
   objr = "<span class='q_joker_anim'>"
   objr += objoker.innerHTML
   objr += "</span>"
   objoker.innerHTML = objr 
   if (qp_type > 0)
      {qb_lepara  = objoker.parentElement
	   moi = qb_lepara.querySelector(qz_mark)
	   if (qb_lepara.querySelector(".qb_box") != null)
	      {if (qw_i_score) 
			   {qw_num = moi.id.substring(3)
			   q_score_maj(qw_num,-3)
			   if (qp_type == 2)
			       {qb_lepara.querySelector(".q_input").focus()}
			   q_posit_box(qw_num)   
			   }
	    	}
           else
           {lequiz.q_clic(moi)}		   
	  }
  }
 function q_bts_go()   // changement de type de quizz (moyen ou difficile)
  {
   qf_cookie = qf_cookie.substr(0,3) + document.getElementById("bts_qtype").value
   if (!qz_plugin)
      {creerCookie("OH",qf_cookie,360)}
   document.location.reload()
  } 
  
this.asidequizz = function (lapage,le_bt_texte,lenum)
   { q_sablier_delete(0,false)  // on arrete le sablier 
    if ((qz_plugin) && (lapage == "aide"))
       {document.location.href = qz_siteurl + "/lequiz-aide/"
        return }
     if (q_courant > -1)
        {lequiz.qb_fermer("",q_courant)}   
    le_bt_texte_x = (arguments.length==1?"":le_bt_texte)
    q_aside_bodyTop = q_calbodyTop()
    if (document.getElementById("asidequizz") == null)
      {d_s_t = "<p>Wait please</p>"
       var newDiv = document.createElement("div")
       // console.log ("AAAA")
       newDiv.id = "asidequizz"
       // newDiv.className = "entry-content"
       newDiv.style.padding = "10px"
       var currentDiv = qobj_article ;
       currentDiv.parentElement.insertBefore(newDiv, currentDiv);
	   // console.log(newDiv)
       }
	 if (lapage.indexOf("<") == -1)  
			   {xhr_object = null
				if(window.XMLHttpRequest) // Firefox   
					  {xhr_object = new XMLHttpRequest(); }
				else 
				   {if(window.ActiveXObject) // Internet Explorer   
					  { xhr_object = new ActiveXObject("Microsoft.XMLHTTP"); }    
					  else
						{ return false   }
				}
				xchemin = "//" + location.hostname + (qz_plugin?"/monquiz/":"/quizz/") + lapage + ".php"
				xhr_object.onreadystatechange = function(event) {
					if (this.readyState === 4) 
						{if (this.status === 200) 
						   {
						   // console.log (lapage + " " + lenum)
						   // console.log (q_t[lenum])
						   if (lapage == "signaler")
						       {
						        // t_docexemple = t_docexemple.replace(new RegExp('<span class="q_joker"><span class="q_l_joker" onclick="q_joker(this)">Aide</span>',"g"),"<span><span>")
						        t_docexemple = q_t[lenum].evt.replace('<span class="q_joker"><span class="q_l_joker" onclick="lequiz.q_joker(this)">Aide</span>',"<span><span>")
						        t_docexemple = t_docexemple.replace('<span class="q_joker"><span class="q_l_joker" onclick="lequiz.q_joker(this)">Aide</span>',"<span><span>")
						        t_docexemple = t_docexemple.replace('</' + qz_mark + '>','</' + qz_mark + '><span>.........</span>')
						        t_docexemple = t_docexemple.replace(' id="qn_',' id="qsn_')
						        t_docexemple = t_docexemple.replace(' src="/',' src="' + lesitehost + '/')
						        sessionStorage["q_evt_mail"] = t_docexemple
						        t_docexemple =  this.responseText.replace("REVTX",t_docexemple)
						        // t_docexemple.replace("REVTX","eeeee")
						        // t_docexemple = q_t[lenum].evt
						        }
						        else
						        {if (lapage == "partage")
						            {t_docexemple = this.responseText.replace("REVTADR",location.origin+(location.pathname.indexOf("histoire")>-1?location.pathname:""))
						             t_docexemple = t_docexemple.replace("Q_ADR_QUIZZ",location.origin+(location.pathname.indexOf("histoire")>-1?encodeURI(location.pathname):""))
						             t_docexemple = t_docexemple.replace("Q_TXT_QUIZZ", (location.pathname.indexOf("histoire")>-1?document.title:"Quiz du jour"))
						             t_docexemple = t_docexemple.replace("FB_ADR_QUIZZ",location.origin+(location.pathname.indexOf("histoire")>-1?location.pathname:""))
						             t_docexemple = t_docexemple.replace("FB_TXT_QUIZZ", (location.pathname.indexOf("histoire")>-1?document.title:"Quiz du jour"))
						             } 
						            else
						            {t_docexemple = this.responseText}
						        }
						    } 
						   else 
						   {t_docexemple = "<p style='text-align:center;'>Erreur chargement de la page " + xchemin  + "<br> status=" + this.status + this.statusText + "</p>"}
						q_affiche_page(t_docexemple,le_bt_texte_x) 
						if (lapage != "score")
						    {q_bt_score("auto")} 
						}
				};            
				xhr_object.open("GET", xchemin, true); 
				try    {xhr_object.send(null);} catch (ex) {} 
				}	
			else
			{q_affiche_page(lapage,le_bt_texte_x) }			
    }
this.f_signaler = function (q_s_num)
   {lequiz.asidequizz("signaler","",q_s_num)
   }    

function q_affiche_page(q_c_page,q_c_bt)	
		{
		q_cookie_h = "0"
		// location.href = "#asidequiz"
		try
		   {if (document.getElementById("okcookies").style.display != "none")
			   {q_cookie_h = document.getElementById("okcookies").offsetHeight}
		   }    
			catch (ex) {}
    var q_basdaide = "<div id='q_retour_q' style='text-align:right;position:sticky;bottom:" + q_cookie_h + "px;max-width:100vw;width:100%;'>" + q_c_bt + "<div class='bt_quizz' onclick='lequiz.fermer_q_aside()'>Retourner au quiz</div></div>"   
    // console.log (q_basdaide)    	 
		document.getElementById("asidequizz").innerHTML = q_c_page + q_basdaide
		// console.log (t_docexemple)
		document.getElementById("asidequizz").style.display = "block"
		qobj_article.style.display = "none"
		try {document.getElementById("asidequizz").scrollIntoView(true)} catch(ex) {location.href="#asidequizz"}
		// document.getElementById("footerbas").style.visibility = "hidden"
		try {if (innerHeight > document.getElementById("lehaut").offsetHeight)
		       { document.getElementById("q_retour_q").style.top = (document.getElementById("lehaut").offsetHeight - 80)  + "px"} 
		     }
		     catch (ex) {}  
		 }  
 this.q_page_score = function (moi)
  {q_texte = "<h3>Détail du score du quiz</h3>"
  q_texte_bt = ""
  q_tscore = q_score.split(",")
  var qw_versiona = Math.abs(q_tscore[0].substring(1))  // version (à partir de 21) 
  var q_score_rtot = parseInt(q_tscore[3])+parseInt(q_tscore[4])  // nb total de reponses
  if (q_score_rtot == 0)
     {if (qp_type == "0")
         {q_texte += "<p>Avec le type de quiz 'Affichage immédiat', le score n'es pas mis à jour."
         q_texte += "<br>Pour modifier le type de quiz, cliquez sur le lien <a href='#' onclick=\"lequiz.q_page_perso('personne')\">Personnaliser</a>.</p>"}
         else
         {q_texte += "<p>Vous n'avez pas encore commencé ce quiz, ou vous l'avez réinitialisé !"
         q_texte += "<br>Cliquez sur chaque question (matérialisée en jaune dans le texte) et répondez.</p>" }
     }    
	 else
		{
		  q_texte += "<p>" + q_unscore(q_tscore[1],"Date et heure de début du quiz","")
		  q_texte += q_unscore(q_tscore[2],"Nombre total de questions","")
		  q_texte += q_unscore(q_score_rtot,"Nombre de réponses","")
		  q_texte += q_unscore(q_tscore[3],"- dont réponses exactes","Soit " + Math.round(q_tscore[3] / q_score_rtot * 100) +  "% du nombre total de réponses")
		  q_texte += q_unscore(q_tscore[4],"- dont réponses fausses","")
		  q_texte += q_unscore(q_tscore[5],"Jokers 'Aide' non utilisés","plus deux points par joker sur une réponse juste")
		  q_texte += q_unscore(q_tscore[6],"Jokers 'Aide' utilisés","moins trois points par joker")
		  q_texte += q_unscore(q_tscore[7],"Autres jokers","un ou deux point de pénalité par joker")
		  q_texte += q_unscore(q_tscore[8],"Frappes clavier justes","plus un point par frappe juste")
		  q_texte += q_unscore(q_tscore[9],"Frappes clavier fausses","moins un point par frappe fausse")
		  q_texte += q_unscore(q_tscore[10],"Score total","une réponse fausse ne peut pas donner lieu à un score négatif")
		  q_texte += q_unscore(Math.round(parseInt(q_tscore[10])/q_score_rtot),"Score moyen par réponse","")
		  if ((qw_versiona > 21)&&(parseInt(q_tscore[11])>5000)&&(parseInt(q_tscore[3])>2)&&(qp_sablier != 0))
		      {q_texte += q_unscore(Math.round(parseInt(q_tscore[11])/parseInt(q_tscore[3])/1000) + " secondes","Temps de réponse moyen","temps total de jeu / réponses exactes")}
		  q_texte += "</p>"
		  q_texte_bt = "<div class='bt_quizz' onclick='lequiz.qp_init_score()'>Réinitialiser le score et les questions</div>&nbsp;&nbsp;"
		  }
	q_texte += "<p>A voir aussi : <a href='#' onclick='lequiz.asidequizz(\"aide\")'> Aide à l'utilisation du quiz</a>.</p>"	  
  lequiz.asidequizz(q_texte,q_texte_bt)
  q_bt_score("none")
  try {lequiz.qb_fmenu(moi.parentElement)} catch(ex) {}
  } 
  
  function q_unscore(q_var,q_lib,q_lib1)
     {if (q_var != 0)
	   {qw_ret =  "<p>" + q_lib + " : " + q_var
		if (q_lib1 != "")
           {qw_ret += "<br>(" + q_lib1 + ")"}		
	   qw_ret += "</p>"
	   return qw_ret}
	   else
	   {return ""}
	 }
  this.qp_init_score = function ()
    {var qw_tabpage  = new Array 
     for (var i=0;i<localStorage.length;i++)
	    {var qw_clep = localStorage.key(i)
	     // console.log (localStorage.key(i))
         if (qw_clep.substring(0,2) == "p_")
           {qw_tabpage[qw_tabpage.length] = qw_clep}
		}
	if (qw_tabpage.length > 0)
	   {for (var i=0;i<qw_tabpage.length;i++)
			{localStorage.removeItem(qw_tabpage[i])}
        } 
  localStorage.removeItem("q_score")
 	lequiz.charger_quizz()
	lequiz.fermer_q_aside()
    //if ((location.pathname.indexOf("histoire") > -1)||(qz_ya_un_quizz))
    //   {location.reload()}
    //   else
    //   {q_bon_quizz()}
	}
	
function q_bt_score(q_action)  // afficher ou ne pas afficher le bouton score situé au-dessous de la réponse à ce quizz
   {var qw_bt_score = document.getElementById("q_bt_score")
   if (qw_bt_score == null)
      {return}
   if (q_action=="auto")
       {var q_score_tot = q_tscore[10]  // score total
        if (q_score_tot == "0")
           {qw_bt_score.style.display = "none"}
           else
           {qw_bt_score.style.display = "inline"
            qw_bt_score.title = "Score = " + q_score_tot + " (cliquer pour en savoir plus)"}
        }
        else
        {qw_bt_score.style.display = "none"}  
    }      
this.q_page_perso = function(moi)
  {q_texte = "<h2>Personnalisation du quiz</h2>"
  q_texte += "<p>Vous pouvez choisir "+ (qz_plugin?"":"un niveau de difficulté, ")+ "un type de jeu, les couleurs, l'animation, les jokers, etc.<br>Après personnalisation cliquez sur le bouton \"Enregistrer ces préférences\" en fin de page.</p>"
  if (!qz_plugin)  
      {q_texte += q_unperso(qp_niveau,"niveau","Niveau de difficulté","Couplé à la personnalisation des jokers, le choix du niveau de difficulté permet d'adapter le quiz aux exigences de l'internaute","M","Moyen","D","Difficile")}
  q_texte += q_unperso(qp_type,"type","Type de quiz","","0","Affichage immédiat","1","Jokers et QCM","2","Jokers et clavier")
  q_texte += q_unperso(qp_sablier,"sablier","Sablier","Temps au delà duquel la réponse est considérée comme fausse (Si pas de sablier, le calcul du temps de réponse moyen n'est pas effectué).","0","Pas de sablier","10000","10 secondes","15000","15 secondes","20000","20 secondes","25000","25 secondes","30000","30 secondes","35000","35 secondes","40000","40 secondes")
  q_texte += q_unperso(qp_af,"af","Affichage préalable","","0","Aucun","1","Premier caractère","2","Anagramme")
  q_texte += q_unperso(qp_color,"color","Couleurs de l'interface","","pastel","Pastel","soutenu","Soutenu")
  q_texte += q_unperso(qp_anim,"anim","Animation graphique","Résultat de l'animation : ","0","Aucune","0.5","Trés rapide","1","Rapide","2","Normal","3","Lente")
  q_texte += "<h3>Les jokers facultatifs</h3>"
  q_texte += q_unperso(qp_joker[2].OK,"j_2","Montrer un mot","Deux points en moins sur le score. Ce joker est utilisable si la réponse comporte plusieurs mots","true","Oui","false","Non")
  q_texte += q_unperso(qp_joker[4].OK,"j_4","Nb caractères","Un point en moins sur le score. Ce joker affiche le nombre de caractères de la réponse, ou, s'il y a lieu, du dernier mot","true","Oui","false","Non")
  q_texte += q_unperso(qp_joker[5].OK,"j_5","Un caractère","Un point en moins sur le score. Ce joker affichera une lettre jusqu'à ce qu'il n'en reste que cinq à trouver","true","Oui","false","Non")
  q_texte += q_unperso(qp_joker[6].OK,"j_6","Anagramme","Un point en moins sur le score. Les différentes lettres de la réponse (ou, s'il y a lieu, du dernier mot à trouver) sont affichées dans le désordre, en minuscule et sans accents","true","Oui","false","Non")
  q_texte += q_unperso(qp_aide,"aide","Aide interactive","L'aide interactive apporte une formation en cours de jeu aux débutants, via des infos bulles.","1","Activée","0","Désactivée")
  q_texte_bt = "<div class='bt_quizz' onclick='lequiz.qp_ecr_params()'>Enregistrer ces préférences</div>&nbsp;&nbsp;"
  lequiz.asidequizz(q_texte,q_texte_bt)
  if (!qz_plugin) {lequiz.qp_change("niveau")}
  lequiz.qp_change("type")
  lequiz.qp_change("af")
  lequiz.qp_change("color")
  lequiz.qp_change("anim")
  lequiz.qp_change("j_6")
  try {lequiz.qb_fmenu(moi.parentElement)} catch(ex) {}
  } 
function q_unperso (q_var,q_nom,q_lib,q_lib1)
    {qw_ret = "<p class='q_p_perso' id='q_p_perso_" + q_nom  +  "'>"
  if  (q_nom.substring(0,2)=="j_")
      {qw_ret += "<input type='checkbox' id='qpp_" + q_nom + "'"
       if (q_var)
          {qw_ret += " checked "}
       qw_ret += "/>"
       qw_ret += "&nbsp;&nbsp;<label class='q_l_joker' for='qpp_" + q_nom + "'>" + q_lib + "</label>"   
      }
      else 
      {qw_ret += "<strong>" + q_lib + "</strong> : "
      qw_ret += "<select id='qpp_" + q_nom + "' onchange='lequiz.qp_change(\"" + q_nom + "\")'>" 
      for (var i=4;i<arguments.length;i+=2)
          {qw_ret += "<option value='" + arguments[i] + "'"
         if (arguments[i] == "" + q_var + "") 
             {qw_ret += " selected "}
         qw_ret += ">" + arguments[i+1] + "</option>" 
        }
      qw_ret += "</select>"	
      }
	 if (q_lib1 != "")
		{qw_ret += "<br>" + q_lib1 }
	 qw_ret	+= "<span id='qpp_rem_" + q_nom + "' class='qpp_rem'></span>"
	 qw_ret += "</p>"
	return qw_ret
    }
    
this.qp_change = function (moi)	
  {lui = document.getElementById("qpp_" + moi)
   var qpp_id = lui.id.substring(4)
   var qpp_value = lui.value
   switch (qpp_id)
      {case "niveau" :
          switch (qpp_value)
            {case "M" :
                qpp_rem("niveau","Avec le niveau moyen, la réponse ne comporte souvent qu'un mot, et l'utilisation des jokers (voir ci-dessous) permet aussi de trouver plus facilement la réponse")
                break
             case "D" :
                 qpp_rem("niveau","Avec le niveau difficile, la réponse comporte souvent plusieurs mots, et pour augmenter le niveau de difficulté, ne pas utiliser les jokers (voir ci-dessous)")
                 break   
            } 
            break ; 
       case "type":
         switch (qpp_value)
            {case "0":
                 qpp_rem("type","L'affichage immédiat est réservé aux internautes qui souhaitent approfondir rapidement leurs connaissances")
                 break
             case "1":
                 qpp_rem("type","Le QCM, proposé par défaut sur les smartphones et tablettes, consiste à trouver la première lettre manquante pour chaque question, parmi un groupe de cinq lettres.")
                 break
             case "2":   
                 qpp_rem("type","La saisie au clavier, proposée par défaut sur les ordinateurs, est à la fois plus rigoureuse et plus ludique. Chaque frappe juste rapporte un point et chaque frappe fausse coûte un point.<br>Si vous êtes allergique au clavier, choisissez plutôt 'Joker et QCM'. ")
                 break
            }
            break ;
       case "af":
         switch (qpp_value)
            {case "0":
                 qpp_rem("af","<" + qz_mark + " style='width:150px;visibility:visible;'>&nbsp;</" + qz_mark + ">")
                 break
             case "1":
                 qpp_rem("af","<" + qz_mark + " style='width:150px;visibility:visible;'>D</" + qz_mark + "><br>&nbsp;&nbsp;La première lettre de la réponse est préalablement affichée, et il faut donc trouver la réponse à partir de la deuxième lettre")
                 break
             case "2":   
                 qpp_rem("af","<" + qz_mark + " style='width:150px;visibility:visible;'>eenr adceensst</" + qz_mark + "><br>&nbsp;&nbsp;Les différentes lettres de la réponse sont préalablement affichées dans le désordre, en minuscule et sans accents")
                 break
            } 
            break ;
       case "color":
         switch (qpp_value)
            {case "pastel":
                 qpp_rem("color","<span class='qp_pastel'><span style='background-color:cyan;'>Joker</span>&nbsp;&nbsp;<span style='background-color:#66ff66;'>Réponse juste</span>&nbsp;&nbsp;<span style='background-color:pink;'>Réponse fausse</span></span>")
                 break
             case "soutenu":
                 qpp_rem("color","<span class='qp_soutenu'><span style='background-color:blue;'>Joker</span>&nbsp;&nbsp;<span style='background-color:green;'>Réponse juste</span>&nbsp;&nbsp;<span style='background-color:red;'>Réponse fausse</span></span>")
                 break
            } 
            break ;
       case "anim":
         switch (qpp_value)
            {case "0":
                 qpp_rem("anim","<" + qz_mark + " class='q_rep_nanim_ok' style='visibility:visible;'>Cas d'une réponse juste</" + qz_mark + ">")
                 break
             case "0.5":
                 qpp_rem("anim","<" + qz_mark + " class='q_rep_anim_ok' style=visibility:visible;><span class='q_rep_anim' style='animation-duration:0.5s;'>Cas d'une réponse juste</span></" + qz_mark + ">")
                 break
             case "1":   
                 qpp_rem("anim","<" + qz_mark + " class='q_rep_anim_ok' style=visibility:visible;><span class='q_rep_anim' style='animation-duration:1s;'>Cas d'une réponse juste</span></" + qz_mark + ">")
                 break
             case "2":
                 qpp_rem("anim","<" + qz_mark + " class='q_rep_anim_ok' style=visibility:visible;><span class='q_rep_anim' style='animation-duration:2s;'>Cas d'une réponse juste</span></" + qz_mark + ">")
                 break
             case "3":   
                 qpp_rem("anim","<" + qz_mark + " class='q_rep_anim_ok' style=visibility:visible;'><span class='q_rep_anim' style='animation-duration:3s;'>Cas d'une réponse juste</span></" + qz_mark + ">")
                 break
            } 
         break 
      } 
  }
 function qpp_rem(moi,lib) 
    {// console.log (moi + " = " + lib)
     document.getElementById("qpp_rem_" + moi).innerHTML =  lib 
    }
	
 this.fermer_q_aside = function()
   {document.getElementById("asidequizz").style.display =  "none" 
    qobj_article.style.display = "block"
    if ((location.pathname.indexOf("histoire") > -1) ||(qz_ya_un_quizz))
        { document.documentElement.scrollTop = q_aside_bodyTop
        // location.href = "#lehaut"
        }
        else
        {q_bon_quizz()}
    q_bt_score("auto")
    // document.getElementById("footerbas").style.visibility = "visible"
    } 
function q_bon_quizz()   // Si la page courante n'est pas une page de quizz, il faut recharger la page de quizz
   {
   if ((sessionStorage["adr_quizz"] + "").indexOf("histoire") > -1)
            {location.href = sessionStorage["adr_quizz"] }
            else
            {location.href = "/"}
   }      
this.qz_affiche_quiz = function ()
   {localStorage["qz_choix_q_or_r"] = "quiz"
    // document.location.assign(document.location.href)
    qobj_article.style.display = "none"
    window.scrollTo(0,0)
    document.location.reload()
   }	
this.qz_affiche_reponse = function ()
   {localStorage["qz_choix_q_or_r"] = "reponse"
    // document.location.assign(document.location.href)
    qobj_article.style.display = "none"
    window.scrollTo(0,0)
    document.location.reload()
   }	
this.q_clic = function (moi)
  {// console.log (moi.id)
  num = moi.id.substring(3)
  var q_multi_rep = false   // true si on revient sur une question 
  if (q_courant > -1)
      {if (q_courant == num)
          {q_aide_num = 1}
          else
          {q_aide_num = 0
           q_multi_rep = true}
      lequiz.qb_fermer("",q_courant) 
      }
      else
      {q_aide_num = 1
       q_multi_rep = true}
  if (qp_type == 0)
     {q_result(num,true)
	    return}
	 q_courant = num 
   q_lepara = moi.parentElement
   if (q_lepara.querySelector("#qbn_" + num) == null)
      {q_initbox(q_lepara,moi,num,true)
       q_aide_num = 0
       q_multi_rep = false}
	  else
      {
      document.getElementById("qbn_" + num).style.display="block"
      } 
    qcm_car = q_t[num].compare.substring(0,1)            // qcm_car = carcatère à trouver
    qcm_lettreouchiffre = (q_repnok(num)==""?(qcm_n.indexOf(qcm_car) > -1?"un chiffre":"une lettre"):"une réponse") 
    q_aide_lib_action = (qp_type==1?"Choisir " + qcm_lettreouchiffre +  " (jaune)":"Saisir un caractère")      
	  q_posit_box(num)
	  q_lepara.style.outline = "2px solid blue"
	  q_lepara.style.outlineOffset = "3px"
	  if (q_lepara.querySelectorAll(qz_mark).length > 1)  // on applique une bordure particulière si le paragraphe comporte plusieurs questions  
	      {q_lepara.querySelector("#qn_" + num).style.outline = "2px dashed red"
	       q_lepara.querySelector("#qbn_" + num).style.outline = "2px dashed red"}
	  if (q_t[num].OK == 1)
	     { 
         if ((q_multi_rep)&&(qp_sablier!=0))
            {q_score_maj(num,-1)}   // moins un point si on veut traiter plus d'une question à la fois...
	       if (qp_type == 2)
           {document.getElementById("qn_" + num).querySelector(".q_input").focus() }	
         if (q_t[num].joker == 99)
              {q_aide_lib = q_aide_lib_action
               if (qp_type == 2)
                   {q_aide_lib += "<br>ou " + q_aide_toucher +  " 'Pas trouvé'"}
               }
              else
              {q_aide_lib = "Choisir un joker (bleu)<br>ou " + q_aide_lib_action}
         q_t[num].lepara.onclick = function () {q_aide_clicpara(num); }
         q_sablier_start(num)
	      }
	      else
	      {q_t[num].lepara.onclick = null
	      }
   }
function q_sablier_start(num) 
   {if ((qp_sablier != 0) && (q_t[num].OK < 2))
       { 
         // q_sablier_ID = setTimeout(function(){q_sablier_stop(num) }, (qp_sablier - q_t[num].sablier))
       q_sablier_time = qp_sablier - q_t[num].sablier
       if (q_sablier_time > 5100)
          {q_sablier_time = 5000} 
       q_sablier_ID = setTimeout(function(){q_sablier_stop(num) }, q_sablier_time)        
       q_t[num].sablier_start = Date.now()}
   }   

function q_sablier_stop(num)
  {q_sablier_time = Date.now() - q_t[num].sablier_start
   if (q_t[num].sablier + q_sablier_time + 100 > qp_sablier)
       {q_score_maj(num,-9999)
        return}
   if ((q_sablier_time > 4900)&&(q_t[num].score > 1))
      {q_score_maj(num,-1)}
   q_t[num].sablier += q_sablier_time   
   q_sablier_start(num) 
  } 
	
function q_aide_clicpara (num)
   {if (event.stopPropagation)           // ne fonctionne que si event.Stoppropagation existe
      {if ((q_aide_num > 0)&&(q_t[num].OK==1))
          {q_aide_furtive(num,q_aide_lib)} 
       q_aide_num ++}   
   }	
	
function q_aide_furtive(num,lib)
   {var qw_aidefurtive = document.getElementById("qbn_" + num).querySelector(".qb_aide")
   if (qw_aidefurtive.style.display == "block")
      {qw_aidefurtive.style.display = "none"}
      else
      {if (qp_aide == 1)
          {qw_aidefurtive.innerHTML = lib 
          qw_aidefurtive.style.display = "block"
          qw_aidefurtive.style.top = "" + (-(qw_aidefurtive.offsetHeight + 8)) + "px" 
          setTimeout(function(){ qw_aidefurtive.style.display = "none" }, 4000);}
          }
    if ((qp_type == 2)&&(q_t[num].OK==1))
       {document.getElementById("qn_" + num).querySelector(".q_input").focus()}
    
    }	
function q_initbox(q_lepara,moi,num,prem)   // initialisation d'une question de quizz
   {// console.log ("init" + num) 
    moi.style.position = "relative"
    qw_data_qdate = moi.getAttribute(qp_data_qdate)
    qw_rep_title = ""
    var qw_sig_texte = ""
    var qw_sig_date = moi.parentElement.parentElement.querySelector("h3")
    if (qw_sig_date != null)
        {qw_sig_texte = qw_sig_date.innerHTML}
    qw_sig_texte += "<br>" + moi.parentElement.innerHTML    
    if (qp_type > 0) 
       { qw_rep_title += "Jouez un joker"
	    if (qp_type == 2)
		   {qw_rep_title += " ou saisissez un caractère"} 
		   else
		   {qw_rep_title += " ou choisssez une lettre correspondant à la réponse"}
	    }
    moi.title = qw_rep_title
    q_lepara.innerHTML = moi.parentElement.innerHTML + qb_texte.replace(/q_num_q/g,num)
	// if (qp_type ==2) 
	//    {q_lepara.querySelector(".qb_input").innerHTML = " ou <input type='text' placeholder='Saisir un caractère' oninput='lequiz.q_input_plus(this," + num + ")' />"}
	// if (qp_type ==1) 
	//    {q_lepara.querySelector(".qb_multi").innerHTML = afficher_qcm(num)}
    var q_lescorepara = 10
  	elcg = q_lepara.querySelectorAll(".q_joker") 
  	elcl = elcg.length
    if (elcl > 0)
	 {for (var i=0;i<elcl;i++) 
	     {if (prem) 
			 { if (elcg[i].style.visibility != "visible")
				  {q_lescorepara = q_lescorepara + 2}
				  else
				  {q_lescorepara = q_lescorepara - 1}
			 }	  
	     }
	 }
	 qw_rep = q_tabrep[num].trim()
	 var qw_box = q_lepara.querySelector("#qbn_" + num)
	 var qw_mots = qw_rep.replace(/ /g," ;").replace(/'/g,"';").replace(/-/g,"-;") 
	 var qw_tmots = qw_mots.split(";")
	 if ((qw_tmots.length == 2)  && (qw_tmots[1].length < 3))
	    {qw_mots = qw_mots.replace(/;/g,"")
	     qw_tmots = qw_mots.split(";")}
	 var qw_numjoker = qp_numjoker
	 var qw_encore = (qp_af==1?qw_rep.substring(1):q_tabrep[num])
	 var qw_deja = (qp_af==1?qw_rep.substring(0,1):"")
	 var qw_compare = qw_encore.sansAccent().toLowerCase()
	 q_t[num] = {"OK":1,
              "qdate":qw_data_qdate,
	             "rep":qw_rep,
	             "evt":qw_sig_texte,
	             "joker":0,   // numero du joker ou 99 si plus de joker
				 "score":q_lescorepara,
				 "lesmots":qw_tmots,
				 "nbmots": 0,
				 "deja":qw_deja,
				 "encore":qw_encore,
				 "compare":qw_compare,
				 "lepara":q_lepara,
				 "qcmc": q_lepara.innerHTML.substr(Math.round(q_lepara.innerHTML.length/2),12),
				 "sablier":0,
				 "sablier_start":Date.now(),
				 "s_ja":0,
				 "s_cj":0,
				 "s_cf":0,
				 }
		// q_t[num].h_rep.id = "qcn_" + num    // pour eviter les congflits d'id		 
		var qw_dejaHTML = (qw_deja == ""?"&nbsp;":"") + "<span class='q_deja'>" + qw_deja  + "</span>"		 
    if (qp_type ==2)
       {
       var qw_input_text = "<input type='text' class='q_input' placeholder='Saisir un caractère' oninput='lequiz.q_input_plus(this," + num + ")' title='Saisissez un caractère' />" 
       document.getElementById("qn_" + num).innerHTML =  qw_dejaHTML + qw_input_text
       }
       else
       {document.getElementById("qn_" + num).innerHTML =  qw_dejaHTML}	
    if (qp_type ==2)
       {q_cal_input(num,qw_deja)
       }   
		if (!prem)
				{return}
		qw_box.style.display = "block"
		if (qp_type == 1)
		   { qcm_afficher(num)
		   q_aide_lib = "Choisir un joker (bleu)<br>ou " + q_aide_lib_action }
		q_af_score(num,q_lescorepara)
		q_posit_box(num)
		lequiz.q_joker_plus(num,qw_numjoker,false)		 
	  if (qp_type == 2)
         {q_lepara.querySelector("#qn_" + num).querySelector(".q_input").focus()}	  
   } 

function q_posit_box(num)   
	{
  qw_lepara = q_t[num].lepara
	q_cookie_h = 0
	try
		   {if (document.getElementById("okcookies").style.display != "none")
			   {q_cookie_h = document.getElementById("okcookies").offsetHeight}
		   }    
			catch (ex) {}
	var q_posit_bottom = q_cookie_h + q_height_adrenalead    		
  if (window.innerHeight - q_posit_bottom >	qw_lepara.offsetHeight)
      {var qw_height = qw_lepara.offsetHeight
      if ((!q_clavier_virtuel)&&(window.innerHeight - q_posit_bottom > qw_height + 80))
          {qw_height += 80}
      if ((qw_lepara.offsetTop + qw_height) >  (q_calbodyTop()  + window.innerHeight - q_posit_bottom - 30))
          {elstyletop =  qw_height + qw_lepara.offsetTop - window.innerHeight + q_posit_bottom +20
           if (elstyletop < 0) {elstyletop = 0}
           document.documentElement.scrollTop = elstyletop } 
      }
  if (!qz_plugin) 
      {if ((q_clavier_virtuel)&&(qp_type == 2))
          {nadz_on_off("clavier")}
          else
          {// console.log ("l=" + window.innerHeight + " , " + (q_cookie_h + 360 + qw_lepara.offsetHeight) )
          if ((window.innerWidth < 1600)&&(window.innerHeight< q_cookie_h + 360 + qw_lepara.offsetHeight))
              {nadz_on_off("none")}
          }    
      }  	
	}
function q_calbodyTop()
   {if (document.body.scrollTop == 0)
     {try {return document.documentElement.scrollTop}
      catch (ex) {return document.body.scrollTop}  }
     else
     {return document.body.scrollTop} 
   } 	

this.q_joker_plus = function (num,numj,booladd)  // traitement d'un joker
  {
   var qw_numj = numj // numero du joker a traiter
   if ((qp_type == 1)&&(q_repnok(num) != ""))
       {qw_numj = qp_derjoker}
   var qw_booladd = booladd  // false si affichage d'un mot autre que le dernier
   var qw_jtype = qp_joker[qw_numj].type
   var qw_tj = ""
   var qw_libj = ""
   var qw_tj_avant = ""
   var qw_tj_apres = ""
   var qw_tj_info = (qp_joker[2].OK===false?"de la réponse":"du dernier mot")
   if (q_t[num].lesmots.length == 1)
      {qw_tj_info = "du mot"
      if (qw_jtype == "NM")
        {
         qw_numj++
         while (qp_joker[qw_numj].OK === false)
           {qw_numj++}
        }   
	    }
   var qw_tj_nbmots = (q_t[num].lesmots.length > 1?"" + q_t[num].lesmots.length + " mots":"") 
   qw_jtype = qp_joker[qw_numj].type
   if (qp_af == 1)
      {
       if (q_t[num].deja == q_t[num].rep)  // cas d'une réponse avec un seul caractère, si on demande l'affichage du premier caractère... 
          {q_result(num,true)
          return}
       var qw_premot = q_t[num].lesmots[0].trim()   	
       if ((qw_premot.length==1)&&(q_t[num].nbmots==0)&&(q_t[num].lesmots.length > 1)&&(q_t[num].deja==qw_premot))  // cas ou le premier mot ne fait qu'un caractère et on demande l'affichage du premier caractère  
          {booladd = true}
	    }		
   if (booladd)   // traitement du joker (afficher un mot, un caractère, le nombre de caractères, l'anagramme...)
	   {
	    switch (qw_jtype)
		  {
		  case "NM" :
			  if (q_t[num].nbmots <  q_t[num].lesmots.length)
				 {q_t[num].encore = ""
				 q_t[num].deja = ""
				 q_t[num].compare = ""
				  for (var i=0;i<q_t[num].lesmots.length;i++) 
				      {if (i > q_t[num].nbmots)
                          {q_t[num].encore += q_t[num].lesmots[i]
						   q_t[num].compare += q_t[num].lesmots[i].sansAccent().toLowerCase()
							}
							else
							{q_t[num].deja += q_t[num].lesmots[i]
							}				
					  }
				 q_t[num].nbmots++
				 if (qp_type == 1)
				    { qcm_afficher(num)}  
				 }
				 
				if ( q_t[num].nbmots < q_t[num].lesmots.length -1 )
				   {qw_booladd = false
				    qw_libj= "Encore un mot"} 
               break;
      case "NC" :
            var qw_nbcar = (qp_joker[2].OK===true?q_t[num].lesmots[q_t[num].lesmots.length -1].length:q_t[num].rep.length)
            qw_tj_avant =  "" + qw_nbcar + " caractère" + (qw_nbcar==1?"":"s")
            if  (q_t[num].encore.length == 1) 
                {qw_numj = qp_derjoker
                 qw_booladd = false}
             break;
      case "NP" :
              q_ajouter_car(num)
              if (qp_type == 1)
                  { qcm_afficher(num)}
              if (q_t[num].encore.length > 5)
                  {qw_booladd = false}
              if  (q_t[num].encore.length == 1) 
                {qw_numj = qp_derjoker
                 qw_booladd = false}
               break;
			case "NA" :
              if  (q_t[num].encore.length == 1) 
                {qw_numj = qp_derjoker
                 qw_booladd = false}
              else   
                {var qw_at = ""
                var qw_atmot = ""
                if (qp_joker[2].OK===true)
                   {qw_at += q_t[num].lesmots[q_t[num].lesmots.length -1].sansAccent().toLowerCase().split("").sort().join("")}
                   else
                   {for (var i=0;i<q_t[num].lesmots.length;i++)  
                      {qw_atmot = q_t[num].lesmots[i]
                     var qw_atfin =  qw_atmot.substring(qw_atmot.length-1)
                     qw_atmot = qw_atmot.substring(0,qw_atmot.length-1)
                     qw_at += qw_atmot.sansAccent().toLowerCase().split("").sort().join("") + qw_atfin}
                   }
                qw_tj_avant =  "Anagramme :<br>" + qw_at 
                }
          break;	
		  }
		if (q_t[num].deja != "")
		   { q_cal_input(num,q_t[num].deja) }
		if (q_t[num].deja == q_t[num].rep)
			{q_result(num,true)
			return}	
		 q_t[num].s_ja += -qp_joker[numj].pena   // maj penalité des jokers
		 q_score_maj(num,qp_joker[numj].pena) 
		}
	 if (q_t[num].score == 0)
		   {return}
   if (qw_booladd)   // true s'il faut rechercher le joker suivant
      {qw_numj++
	    while (qp_joker[qw_numj].OK === false)
	       {qw_numj++}
	    }
   qw_tj = ""
   var qw_t_joker = "<span class='q_l_joker' onclick='lequiz.q_joker_plus(" + num + "," + qw_numj + ",true)'>" + (qw_libj == ""?qp_joker[qw_numj].lib:qw_libj) + "</span>"	    
   qw_jtype = qp_joker[qw_numj].type
   q_t[num].joker = qw_numj
   switch (qw_jtype)  // affichage du joker suivant 
		{case "NM" :
			qw_tj_apres = ""
			qw_tj_avant = qw_tj_nbmots
			break;
		case "NC" :
			qw_tj_apres = qw_tj_info
			break;	
		case "NP" :
			qw_tj_apres = qw_tj_info
			break;
		case "NA" :
			qw_tj_apres = qw_tj_info
			break;
		case "A" :
			q_t[num].joker = 99  // plus de joker dans ce cas
			if (qp_type == 1)    
			   {qw_t_joker = ""
			   q_aide_lib = "Choisir " + qcm_lettreouchiffre
			   }
		   if (qp_type == 2)
			  {q_aide_lib = "Saisir un caractère ou<br>" + q_aide_toucher + " 'Pas trouvé'"
			   qw_t_joker = "<span class='q_rep_nanim_nok' onclick='lequiz.q_perdu(" + num + ")'> Pas trouvé </span>"
			   qw_tj_apres = ""}
			break;
		}
    qw_tj +=  qw_t_joker
    if (qw_tj_avant != "")
       {qw_tj =  "<span>" + qw_tj_avant + "</span>" + (qw_t_joker==""?"":"<br>")	+ qw_tj}
    if (qp_type == 1)    // cas du QCM
        {if (qw_jtype != "A")
            {qw_tj_apres += " / ou"}
            else
            {qw_tj_apres += "Choisir " + qcm_lettreouchiffre}
        }
    if (qw_tj_apres != "")
       {qw_tj += "<br><span>" + qw_tj_apres + "</span>"	}
	  
   document.getElementById("qbn_" + num).querySelector(".qb_lib").innerHTML = qw_tj 
   if (qp_type == 2)
       {document.getElementById("qn_" + num).querySelector(".q_input").focus()}

  } 
function q_repnok(num)  
    {return  (q_tabnok[num] + "" == "undefined"?"":q_tabnok[num]) } 
  
  function qcm_afficher(num)  // affichage du qcm défini par le gestionnaire, ou à défaut, de cinq lettres ou 5 chiffres 
    {var qcm_res, qcm_cur, qcm_maj, qcm_curi,qcm_qs,qcm_ci
    qcm_res = ""
     if (q_repnok(num) != "") 
        {
        var qw_t_nok = q_tabnok[num].split(",")
        qcm_lettreouchiffre = "une réponse"
        var qw_qcm_mot = ""
        qcm_cur = unEntier(qw_t_nok.length + 1,q_t[num].qcmc.charCodeAt(0)) // position de la réponse
        j = 0
        for (i=0;i<qw_t_nok.length+1;i++)
            {
             if (j == qcm_cur)
                {qw_qcm_mot = q_t[num].rep
                 qcm_cur = 99}
                else
                {qw_qcm_mot = qw_t_nok[j].trim()
                 j++} 
            qcm_res += "<div class='qcm_choix_gest' onclick='lequiz.qcm_choix_gest(this," + num + ")'>" + qw_qcm_mot + "</div><br>" 
            }
           document.getElementById("qbn_" + num).querySelector(".qb_multi").innerHTML = qcm_res    
        return    
        } 
    qcm_car = q_t[num].compare.substring(0,1)            // qcm_car = carcatère à trouver
    qcm_lettreouchiffre = (qcm_n.indexOf(qcm_car) > -1?"un chiffre":"une lettre") 
    qcm_qs = "aeiouy".indexOf(qcm_car) > -1?qcm_v:(qcm_n.indexOf(qcm_car) > -1?qcm_n:qcm_c)  // on choisi voyelle ou consomne ou chiffre
    qcm_qs = qcm_qs.replace(new RegExp(qcm_car,"g"),"")  // on enleve le caractère de la chaine
    qcm_ci = unEntier(5,q_t[num].qcmc.charCodeAt(5) + qcm_car.charCodeAt(0))  // position du caractère correspondant à qcm_car
    qcm_maj = (q_t[num].encore.substring(0,1).sansAccent()==qcm_car?false:true)  // true si majuscule
    for (i=0;i<5;i++)
        {qcm_curi = unEntier(qcm_qs.length,q_t[num].qcmc.charCodeAt(i))
         qcm_cur = (i==qcm_ci?qcm_car:qcm_qs.substring(qcm_curi,qcm_curi+1))
         qcm_qs = qcm_qs.replace(new RegExp(qcm_cur,"g"),"")  // on enleve le caractère de la chaine
         qcm_res += "<div class='qcm_choix' onclick='lequiz.qcm_choix(\"" + qcm_cur + "\"," + num + ")'>" + (qcm_maj?qcm_cur.toUpperCase():qcm_cur) + "</div>"  
        }  
       document.getElementById("qbn_" + num).querySelector(".qb_multi").innerHTML = qcm_res
    // console.log (qcm_res)
    }
 this.qcm_choix = function (lettre,num)  
    {if (lettre == q_t[num].compare.substring(0,1))
        {q_result(num,true)}
        else
        {lequiz.q_perdu(num)}
    }
    
  this.qcm_choix_gest = function (moi,num) 
      {if (moi.innerHTML.trim() == q_tabrep[num].trim())
        {q_result(num,true)}
        else
        {lequiz.q_perdu(num)}
      }   
    

  function q_repaffiche(moi,num)
    {qw_tr = "<span onclick='q_result(" + num + ",true)' class='q_rep_nanim_ok' title='Cliquer si vous aviez deviner'>Juste</span>"
	qw_tr += "&nbsp;<span onclick='lequiz.q_perdu(" + num + ")' class='q_rep_nanim_nok' title=\"Cliquez si vous n'aviez pas deviné\">Faux</span>"
	document.getElementById("qbn_" + num).querySelector(".qb_multi").innerHTML =  qw_tr
	document.getElementById("qbn_" + num).querySelector(".qb_lib").innerHTML = "La réponse est :<br>" + "<strong>" + q_t[num].rep + "</strong>"}
  
  this.q_input_plus = function (moi,num)
  {// console.log(moi.value)
   if ((moi.value.length > 0) &&(moi.value != " "))
    {var qw_value = moi.value.substring(0,1).sansAccent().toLowerCase()
	 if (qw_value == q_t[num].compare.substring(0,1))
      {q_ajouter_car(num)
	   q_score_maj(num,1)
	   q_t[num].s_cj++    // un point touche clavier juste
	   if (q_t[num].deja == q_t[num].rep)
	      {q_result(num,true)}
	   }
	  else
	  {q_score_maj(num,-1)
	   q_t[num].s_cf++}   // pénalité touche clavier fausse
	  }
   moi.value = ""
   // document.getElementById("qn_" + num).focus()
  }
function q_ajouter_car(num)
  {// console.log ("j'ajoute !!!")
     q_ajouter_uncar(num)
	   var qw_premc = q_t[num].encore.substring(0,1)
		 if ((qw_premc == " ")  || (qw_premc == "'") || (qw_premc == "-")) 
		     {q_ajouter_uncar(num)
		      q_t[num].nbmots++
		      }
	   q_cal_input(num,q_t[num].deja)
  } 
 function q_ajouter_uncar(num)
    {
     q_t[num].deja += q_t[num].encore.substring(0,1)
	   q_t[num].compare = q_t[num].compare.substring(1)
	   q_t[num].encore = q_t[num].encore.substring(1)
    } 
 function q_cal_input(num,qw_deja)  // affichage des caractères déjà trouvés, et calcul de la largeur du champ de saisie si type = clavier
    {qw_rep = document.getElementById("qn_" + num)
     if (qp_type != 2)
        {qw_rep.querySelector(".q_deja").innerHTML = qw_deja
         return}
     var qw_input = document.getElementById("qn_" + num).querySelector("input.q_input")
     qw_rep.querySelector(".q_deja").innerHTML = qw_deja
     qw_input.style.width = (qw_rep.offsetWidth - qw_rep.querySelector(".q_deja").offsetWidth - 24)  + "px"
     }  
  
function q_score_maj(num,points)
   {if (points == 0)
       {return}
    q_t[num].score = q_t[num].score + points
	if (q_t[num].score < 0)
	   {q_t[num].score = 0}
    // console.log(q_t[num].lepara.innerHTML)
	q_af_score(num,q_t[num].score) 
    if (q_t[num].score == 0)
       {if (points == -9999)
            {q_result(num,true,"<span title='Sablier de " + Math.round(qp_sablier/1000) + " secondes'>Trop tard !</span>")
            q_nb_troptard++
            // console.log ("Trop tard = " + q_nb_troptard)
            if (q_nb_troptard > q_sablier_ano)
               {q_aide_furtive(num, "Pour ajuster le sablier,<br>Cliquez sur <a href='#' onclick='lequiz.q_page_perso(this)'>Personnaliser</a>")
                q_nb_troptard = 0}
            }
            else
	          {q_result(num,true)
	          if ((qp_type == 2)&&(q_tscore[10]<100)&&(q_tscore[4]>q_tscore[3]))
                {q_nb_clavier_faux++
                // console.log ("Trop tard = " + q_nb_troptard)
                if (q_nb_clavier_faux > q_clavier_ano)
                   {q_aide_furtive(num, "En cas d'allergie au clavier<br>Optez pour le type de quiz<br>Joker et QCM.")
                    q_nb_clavier_faux = 0}
                 }   
	          }
	     }    
   } 
function q_af_score(num,q_afscore)
    {var q_score_classe = "#000000"
    if (q_afscore > 11)  	
	    {q_score_classe= "green"}
		else
		{if (q_afscore < 5)  	
	      {q_score_classe= "red"}
		}
    document.getElementById("qbn_" + num).querySelector(".qb_score").innerHTML = "<span style='color:" + q_score_classe + ";'>Score<br>" + q_afscore	+ "</span>" 	
	}	
   
this.q_perdu = function (num)
   {q_score_maj(num,-q_t[num].score)
   }   

function q_result(num,prem)	// afficher le résulat et les joker éventuels
  {
   moi = document.getElementById("qn_" + num) 
	qw_jt_ok = 0
	qw_jt_nok = 0 
  var qw_rep_classe = "ok"
	qw_rep_title = ""
	var qw_rep_libfin = ""
   if (qp_type == 0)      
      {qw_lepara = moi.parentElement }
	  else
	  {qw_lepara = q_t[num].lepara
	  document.getElementById("qn_" + num).style.whiteSpace = "initial"
	  document.getElementById("qn_" + num).style.width = "auto"
	  if (q_t[num].score > 0)
	     {qw_rep_classe = "ok"
		  qw_rep_title = "Score pour cette réponse : " + q_t[num].score 
		  qw_rep_libfin = "Vous avez trouvé !<br>Oui, la réponse est :<br>"}
		 else
		 {qw_rep_classe = "nok"
		  qw_rep_title ="Perdu ! La bonne réponse est en rouge"
		  qw_rep_libfin = (arguments.length>2?arguments[2]:"Vous avez perdu !") + "<br>La bonne réponse est :<br>"}
	  qw_rep_libfin += q_t[num].rep}
  if (qp_anim == "0")
     {moi.innerHTML = q_tabrep[num]
	    moi.className = "q_rep_nanim_" + qw_rep_classe}
	 else
	 {
    objr = "<span class='q_rep_anim" + "'>"
    objr += q_tabrep[num]
    objr += "</span>"
    moi.innerHTML = objr 	 
	moi.className = 'q_rep_anim_' + qw_rep_classe
	// moi.style.backgroundColor = "#FFFFFF"
	 }
  	elcg = qw_lepara.querySelectorAll(".q_joker") 
	elcl = elcg.length
    if (elcl > 0)
	 {for (var i=0;i<elcl;i++)  
	     { if (elcg[i].style.visibility != "visible")
		      {lequiz.q_joker(elcg[i].querySelector(".q_l_joker"),false)
			   qw_jt_ok++
			   }
			   else
			    {qw_jt_nok++}  
	     }
	 }
	 if (qp_type > 0)
	    {moi.title = qw_rep_title
		   document.getElementById("qbn_" + num).querySelector(".qb_multi").innerHTML = ""
		   document.getElementById("qbn_" + num).querySelector(".qb_lib").innerHTML = qw_rep_libfin
		q_t[num].OK = 2
		 }
	if (!prem)  // si pas prem, il s'agit d'un résultat d'une page déjà jouée une autre fois
		{return}
		
	 if (qp_type == 0)
	    { }
		else
		{if (!qz_plugin)
		    {nadz_on_off('initial')}
		q_sablier_delete(num,true)
		if (qp_sablier == 0)
		   {q_t[num].sablier = Date.now() - q_t[num].sablier_start }
		 var qw_score = q_t[num].score
		 q_add_score (0,(qw_score>0?1:0),(qw_score>0?0:1),qw_jt_ok,qw_jt_nok,q_t[num].s_ja,q_t[num].s_cj,q_t[num].s_cf,qw_score,q_t[num].sablier)
		qw_data_qdate = q_t[num].qdate	
		if ((qw_data_qdate == "") || (qw_data_qdate == null)) 
		   {qw_data_qdate = q_tmotpage[num] }
		 localStorage["p_" + qw_data_qdate] = qw_score }
  } 

  function q_add_score(qw_q,qw_rj,qw_rf,qw_jt_ok,qw_jt_nok,qw_joker,qw_clavier_ok,qw_clavier_nok,qw_score,qw_sablier)
     {q_tscore = q_score.split(",")
    var qw_versionb = Math.abs(q_tscore[0].substring(1))  // version (à partir de 21) 
	  q_tscore[2]=Math.abs(q_tscore[2]) + qw_q      // usage ultérieur (nb questions ?)
	  q_tscore[3]=Math.abs(q_tscore[3]) + qw_rj     // nb réponses justes
	  q_tscore[4]=Math.abs(q_tscore[4]) + qw_rf     // nb réponses fausses
	  q_tscore[5]=Math.abs(q_tscore[5]) + qw_jt_ok     // jokers textes ok
	  q_tscore[6]=Math.abs(q_tscore[6]) + qw_jt_nok    // jokers textes nok 
	  q_tscore[7]=Math.abs(q_tscore[7]) + qw_joker     // autres jokers
	  q_tscore[8]=Math.abs(q_tscore[8]) + qw_clavier_ok    // claviers justes
	  q_tscore[9]=Math.abs(q_tscore[9]) + qw_clavier_nok   // claviers faux 
	  q_tscore[10]=Math.abs(q_tscore[10]) + qw_score        // score
	  q_tscore[11]=(qw_versionb>21?Math.abs(q_tscore[11]) + qw_sablier:0)        // temps de réponse total
	  var qw_wscore = q_tscore.join(",")
	  if (q_score != qw_wscore)
	      {localStorage["q_score"] = qw_wscore
		     q_score = qw_wscore}
		 q_bt_score("auto") 
     }
}
  	 
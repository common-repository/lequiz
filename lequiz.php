<?php
/**
 * Plugin Name: Le Quiz
 * Plugin URI: https://lequiz.calagenda.fr
 * Description: Un quizz trés facile à mettre en oeuvre et personnalisable pour l'internaute : QCM ou clavier, sablier, score, graphisme, animation, jokers automatiques...  
 * Version: 1.6.2
 * Author: Joël Vélon
 * Author URI: https://lequiz.calagenda.fr/contact/
 * License: GPLv2
 * License URI: https://www.gnu.org/licenses/gpl-2.0.html  
 * Text Domain: lequiz
*/

if (is_admin())
   {include 'inc/admin-menu.php';       // include de création du menu d'administration 
    include 'inc/admin-settings.php';   // include de création du formulaire d'administration (choix des options)
    }

add_action( 'init', 'lequiz_userinfo_global' );
function lequiz_userinfo_global() {
    global $lequiz_version ;  // version du plugin
    global $lequiz_bool ;     // true si le post est un quiz, sinon, false
    global $lequiz_filtre ;   // true si le post de la liste est un quiz, sinon, false
    global $lequiz_idnum ;    // true si on doit calculer les numéros de réponses dans le javascript
    global $lequiz_singular ; // true s'il s'agit d'un simple post ou d'une simple page 
    global $lequiz_trait    ; // tableau de variables
    global $lequiz_cat ; 
    global $lequiz_tabrep  ;
    global $lequiz_tabnok  ;
    global $lequiz_settings ;
    
    $lequiz_version = "1.6.1" ;
    $lequiz_bool = false ;   // true si c'est une page de quiz
    $lequiz_filtre = false ;
    $lequiz_idnum = false ;  // true si on doit calculer les numéros de réponses dans le javascript
    $lequiz_singular = false ;
    $lequiz_trait = array("T"=>false,"A"=>false,"P"=>false,"S"=>false, "mark"=> "code", "nok"=>"s") ; // T:tous, A:articles, P:Pages ; S:section-quiz
    $lequiz_cat = array() ; // tableau des ID de catégories a traiter comme quiz ; 
    $lequiz_tabrep = "" ;
    $lequiz_tabnok = "" ;
}
   

register_activation_hook( __FILE__, 'lequiz_ajout_fichiers' );

function lequiz_ajout_fichiers()  // sera executé à chaque activation du plugin lequiz
    {
    $slug_new = wp_unique_post_slug("lequiz-aide",0,'publish','page',0) ;
    if ($slug_new ==  "lequiz-aide")  // si le fichier n'existe pas déjà, crée le fichier d'aide 
       {$contenu = file_get_contents(plugins_url('/inc/aide.php',__FILE__)) ;
        wp_insert_post( array(
                            'post_type'     => 'page',
                            'post_name'     => 'lequiz-aide', 
                            'post_title'    => "Aide à l'utilisation du quiz",
                            'post_content'  => $contenu , 
                            'post_status'   => 'publish',
                            'post_author'   => 1,
                            ) 
                    ); 
       } 
    if (get_option('lequiz_prem')===false ) // créer la catégorie et le fichier d'exemples s'il s'agit de la première activation
       {add_option("lequiz_prem","oui")  ;  // première activation du plugin
        //wp_insert_term('Le Quiz','category',array('slug' => 'le-quiz' , ) );  // créer la catégorie le_quiz
        $cat_id = wp_insert_category( array ("cat_ID" => 0, "cat_name" => "Le Quiz", "category_nicename" => "le-quiz","taxonomy" => "category"), false ) ; // créer la catégorie le_quiz
        // $cat_id = get_category_by_slug("le-quiz")->term_id ;
        // // créer le fichier d'exemples
        $t_quiz = "<!-- wp:paragraph --><p>François 1er gagne la bataille de <code>Marignan</code> en 1515.</p><!-- /wp:paragraph -->" ;
        $t_quiz .= "<!-- wp:paragraph --><p>Louis XIV était surnommé le roi <code>soleil</code>.</p><!-- /wp:paragraph -->" ;
        wp_insert_post( array(               
                            'post_type'     => 'post',
                            'post_name'     => 'lequiz-exemple', 
                            'post_title'    => "Exemple de quiz",
                            'post_content'  => $t_quiz , 
                            'post_status'   => 'publish',
                            'post_category' => array ($cat_id) ,
                            'post_author'   => 1,
                            ) 
                    ); 
       }
       else
       {update_option("lequiz_prem","non") ;}  // activation autre que la première fois pour le plugin
       }
   
if (strpos($_SERVER["REQUEST_URI"],"wp-admin/post") > -1)
    {add_action( 'admin_enqueue_scripts', 'lequiz_edit' ); }   // mise en évidence de la question dans l'éditeur si mark=code
    
function lequiz_edit()     // mise en évidence de la question dans l'éditeur si l'option mark est égale à 'code'
   {$settings  = get_option( 'lequiz_options' );
    $qz_mark = ($settings===false?"code":$settings['mark']) ;
    if ($qz_mark == "code")
        {  
         wp_register_style( 'lequiz-edit',false);                                                             // css en ligne, foction des options choisies par le gestionnaire
         $spec = "#editor .wp-block code {background-color:yellow !important;color:black !important;}" ;
         wp_add_inline_style( "lequiz-edit", $spec) ;
         wp_enqueue_style( 'lequiz-edit' );
        }
   }   
   
if(!is_admin())
    {add_action ('wp', 'lequiz_wp') ; } 
     
function lequiz_wp()    // traitement préalable, fonction du type de page et des options choisies par le gestionnaire
    {global $post ;
    global $lequiz_bool ;      
    global $lequiz_idnum ;  
    global $lequiz_version ;
    global $lequiz_singular ;
    global $lequiz_trait ;
    global $lequiz_cat ;
    global $lequiz_settings ;
    $lequiz_singular = is_singular() ;
    $lequiz_settings  = get_option( 'lequiz_options' );
    $qz_article = ($lequiz_settings===false?"main .category-le-quiz, .section-quiz":$lequiz_settings['article']) ;   // traitement de l'option 'article' 
    $tqz_article = explode(",",$qz_article) ;
    // $qz_article_cal = "" ;
    foreach ($tqz_article as $valeur)            
           {$v = trim(str_replace("main ","",$valeur)) ;
           if ($v == "article")                // quiz pour toutes les pages et tous les articles du site
              {$lequiz_trait["T"] = true ;
               }
           if ($v == ".type-post")             // quiz pour tous les aricles du site 
              {$lequiz_trait["A"] = true ;
               }
           if ($v == ".type-page")             // quiz pour toutes les pages du site
              {$lequiz_trait["P"] = true ;
               }
            if ($v == ".section-quiz")          // quiz si un bloc de la page a une classe 'section-quiz' 
               {$lequiz_trait["S"] = true ;
               }     
           if (substr($v,0,10) == ".category-" )  // tableau des catégories d'aricles avec un quiz
              {$cat = substr($v,10) ;
               $cat_id = get_category_by_slug($cat)->term_id ;
               if ($cat_id != "")
                  {$lequiz_cat[] = $cat_id ;}
               }
            // $qz_article_cal .= ", " . $valeur ;
            // if (substr(trim($valeur),0,15) == "main .category-")
               // {$qz_article_cal .= ", .post-in-" . substr(trim($valeur),6) . " main" ;
               //  $qz_article_cal .= ", " . substr(trim($valeur),5) ;
               //}
           }
    // $qz_article_cal = substr($qz_article_cal,2) ;       
    $qz_mark = ($lequiz_settings===false?"code":$lequiz_settings['mark']) ;
    $qz_nok = ($lequiz_settings===false?"s":($lequiz_settings['nok']==""?"s":$lequiz_settings['nok'])) ;
    $lequiz_trait["mark"] = $qz_mark ;
    $lequiz_trait["nok"] = $qz_nok ;
    if ($lequiz_singular)            // s'il s'agit d'un article ou d'une page
        {if ($post)                  // si la variable $post est définie
            {if ($post->post_name == "lequiz-aide")  // s'il s'agit de la page d'aide
               {$plus_content = "<p><b>A voir aussi</b></p>" ;
                $plus_content .= "<ul>" ;
                $plus_content .= "<li><a target='-blank' href='https://lequiz.calagenda.fr'>Installez rapidement et gratuitement un quiz dans votre site WordPress</a>.</li>" ;
                $plus_content .= "<li><a target='-blank' href='https://quiz.calagenda.fr'>Un quiz de plus de 8000 évènements historiques et contemporains</a>.</li>" ;
                $plus_content .= "</ul>" ;
                $post->post_content .= $plus_content ;
                } 
             $lequiz_bool = lequiz_trait_quiz($post,$lequiz_trait,$lequiz_cat) ;   // traitement du post : ajout éventuel d'un bloc avec la classe lequiz-bloc
             if ($lequiz_bool)   // ajout des scripts et des styles si la page est un quiz
                {
                add_action( 'wp_enqueue_scripts', 'lequiz_scripts' );  
                }
             if (isset($_GET["lequiz-debug"]))
                {if ($_GET["lequiz-debug"] == "oui")  // pour avoir des éléments de debug du plugin en cas de demande d'aide du gestionnaire 
                    {$plus_content = "<div style='color:red;background-color:white;border:2px solid red;padding:5px;margin:5px auto 5px auto;'>" ;
                     $plus_content .= "Quiz " . ($lequiz_bool?"trouvé, traitement coté " . ($lequiz_idnum?"client uniquement.":"serveur et client."):" non trouvé.") . "<br>";
                     $plus_content .= "Version PHP : " . phpversion ()  . "<br>" ;
                     $plus_content .= "Version WordPress : " . get_bloginfo('version') . "<br>" ;
                     $plus_content .= "Charset : " . get_bloginfo('charset') . "<br>" ;
                     $plugliste = "" ;
                     $tab_plug = get_option("active_plugins") ;
                     if ($tab_plug !== false)
                        {$plugliste = implode("; ",$tab_plug) ; }
                     $plus_content .= "Plugins : " . $plugliste . "<br>" ;
                     $plus_content .= "Version lequiz : " . $lequiz_version . "<br>" ;
                     $plus_content .= "ID du post : " . $post->ID . "<br>" ;
                     $plus_content .= "Type de post : " . $post->post_type . "<br>" ;
                     $plus_content .= "Options : " . lequiz_debug_tableau($lequiz_settings) . "<br>" ;
                     $plus_content .= "Traitements : " . lequiz_debug_tableau($lequiz_trait) . "<br>" ;
                     $plus_content .= "Categorie(s) éligibles(s) au quiz : " . implode(", ",$lequiz_cat) . "<br>" ;
                     $plus_content .= "Categorie(s) du post : " . implode(", ",$post->post_category) . "<br>" ;
                     $plus_content .= "</div>" ;
                     $post->post_content .= wp_kses_post($plus_content) ;
                    }
                }   
             }  
         }
         else 
         {add_action('the_post', 'lequiz_trait_posts');                           // traitement d'une liste
          add_filter( 'the_content', "lequiz_trait_un_post", 0 ) ; }                // traitement d'un post d'une liste                
    } 
function lequiz_debug_tableau($tableau)
   {$res = "" ;
    if (is_string($tableau))
       {return $tableau ;}
    if (!is_array($tableau))
       {return "" ;}
    foreach ($tableau as $key=>$value) 
       {$res .= $key . "=" . $value . "; " ;  }
    return $res ;   
   }      
    
function lequiz_scripts() {                     // insertion des fichiers js et css, et des style et lignes javascript fonctions des options choisies 
    global $lequiz_version ;
    global $lequiz_trait ;
    global $lequiz_settings ;
    global $lequiz_idnum ;
    global $lequiz_tabrep ;   // tableau des réponses justes
    global $lequiz_tabnok ;   // tableau des réponses fausses
    global $post ;
    wp_register_style( 'lequiz-style', plugins_url( '/css/quizz.css' , __FILE__ ),array(), $lequiz_version);  // fichier css pour le quiz
    wp_enqueue_style( 'lequiz-style' );
    wp_register_script( 'lequiz-js', plugins_url( '/js/quizz.js' , __FILE__ ),array(),$lequiz_version);       // fichier js pour le quiz
    wp_enqueue_script( 'lequiz-js' );
    wp_register_style( 'lequiz-style-spec',false);                                                             // css en ligne, foction des options choisies par le gestionnaire
    $spec = ".lequiz-bloc " . $lequiz_trait["mark"] . " {visibility:hidden;} " ;
    $spec .= ".lequiz-bloc " . $lequiz_trait["mark"] . " " . $lequiz_trait["nok"] . " {display:none;} " ;
    wp_add_inline_style( 'lequiz-style-spec', $spec) ;
    wp_enqueue_style( 'lequiz-style-spec' );
    wp_register_script( 'lequiz-init',false);                                                             // initialisation de l'objet javascript lequiz
    $spec = "lequiz = new classe_lequiz ; lequiz.init();" ;
    $spec .= "lequiz.qz_plugin = true;" ;
    $spec .= "lequiz.qz_idnum = " . ($lequiz_idnum?"true":"false"). " ;" ;
    $spec .= "lequiz.qz_article = ' .lequiz-bloc ';" ;
    $spec .= "lequiz.qz_mark = '" . esc_js($lequiz_trait["mark"])  . "';" ;
    $spec .= "lequiz.qz_nok = '" . esc_js($lequiz_trait["nok"])  . "';" ;
    $spec .= "lequiz.qz_defaut = '" . ($lequiz_settings===false?"quiz":esc_js($lequiz_settings['defaut'])) . "';" ;
    $spec .= "lequiz.qz_postid = 'post-" . $post->ID . "';" ;
    $spec .= "lequiz.qz_persist = " . ($lequiz_settings===false?"false":(isset($lequiz_settings['persist'])?($lequiz_settings['persist']=="on"?"true":"false"):"false")) . ";" ;
    $spec .= "lequiz.qz_lienquiz = '" . ($lequiz_settings===false?"Afficher le quiz":esc_js($lequiz_settings['lienquiz'])) . "';" ;
    $spec .= "lequiz.qz_lienreponse = '" . ($lequiz_settings===false?"Voir les réponses":esc_js($lequiz_settings['lienreponse'])) . "';" ;
    $spec .= "lequiz.qz_siteurl = '" . get_site_url() . "';" ;
    $spec .= "lequiz.qp_type = " . ($lequiz_settings===false?"1":esc_js($lequiz_settings['type'])) . ";" ;
    $spec .= "lequiz.qp_sablier = " . ($lequiz_settings===false?"30000":esc_js($lequiz_settings['sablier'])) . ";" ;
    $spec .= "lequiz.qp_af = " . ($lequiz_settings===false?"0":esc_js($lequiz_settings['af'])) . ";" ;
    $spec .= "lequiz.qp_color = '" . ($lequiz_settings===false?"soutenu":esc_js($lequiz_settings['color'])) . "';" ;
    $spec .= "lequiz.qp_anim = " . ($lequiz_settings===false?"2":esc_js($lequiz_settings['anim'])) . ";" ;
    $spec .= "lequiz.qz_jokers = " . ($lequiz_settings===false?"2":esc_js($lequiz_settings['jokers'])) . ";" ;
    $spec .= "lequiz.qp_aide = " . ($lequiz_settings===false?"1":esc_js($lequiz_settings['aide'])) . ";" ;
    $spec .= "lequiz.qz_url_plug = '" . plugins_url('/', __FILE__ ) . "';" ;
    wp_add_inline_script( "lequiz-init", $spec) ;
    wp_enqueue_script( 'lequiz-init' );
    wp_register_script( 'lequiz-charger',false, array(),false,true);         // appel de la méthode javascript de chargement du quiz en fin de document
    $spec = "" ;
    if (!$lequiz_idnum)
           {$spec .= "lequiz.q_trep = [" . $lequiz_tabrep . "''];" ;  // tableau des réponses justes, codées
            $spec .= "lequiz.q_tnok = [" . $lequiz_tabnok . "''];" ;  // tableau des réponses fausses, codées
           }
    $spec .= "lequiz.charger_quizz() ;" ;
    wp_add_inline_script( "lequiz-charger", $spec) ;
    wp_enqueue_script( 'lequiz-charger' );
    }       

function lequiz_trait_posts($unpost) {             // traitement des articles d'une liste
  	global $lequiz_singular ;
  	global $lequiz_trait ;
  	global $lequiz_cat ;
    if (!$lequiz_singular)
		    {$qtest_quiz = lequiz_trait_quiz($unpost,$lequiz_trait,$lequiz_cat) ; }  
	return ;
}    
   
function lequiz_trait_quiz ($unpost,$lequiz_trait,$lequiz_cat)  // test si la page est un quiz, si oui, traitement du quiz
{   // global $post ; 
    global $lequiz_singular ;
    global $lequiz_cat ;
    global $lequiz_filtre ;
     if ($unpost === null)  // cas de la page de recherche avec certains thèmes, si la liste est vide
        {return false ;}   
     if (preg_match("# class=(.*?)lequiz-bloc#",$unpost->post_content) == 1)
        {return lequiz_oui_quiz($unpost,true) ;}         
     if ($lequiz_trait["T"])                                         // tous les articles et toutes les pages 
        {return lequiz_oui_quiz($unpost,false) ;}
     if (($lequiz_trait["A"]) && ($unpost->post_type == "post"))     // tous les articles 
        {return lequiz_oui_quiz($unpost,false) ;}
     if (($lequiz_trait["P"]) && ($unpost->post_type == "page"))     // toutes les pages 
        {return lequiz_oui_quiz($unpost,false) ;}
     if (preg_match("# class=(.*?)section-quiz#",$unpost->post_content) == 1)  // une page ou un article avec un bloc de classe 'section-quiz'  
        {return lequiz_oui_quiz($unpost,false) ;}         
     // if (($lequiz_trait["S"]) && (strpos($unpost->post_content,"section-quiz") > 1)) // une page ou un article avec un bloc de classe 'section-quiz'   
     //     {return lequiz_oui_quiz($unpost,false) ;} 
     if ((count($lequiz_cat) > 0) && (count($unpost->post_category) > 0))            
        {foreach ($lequiz_cat as $cat_id) 
         if (in_array($cat_id,$unpost->post_category))          // un artcle dont au moins une catégorie est un quiz
            {return lequiz_oui_quiz($unpost,false) ;}                
        } 
     $lequiz_filtre = false ;   
     return false ;   
}  
function lequiz_oui_quiz($unpost,$deja)  // ce post est un quiz
{   global $lequiz_singular ;
    global $lequiz_trait ;
    global $lequiz_filtre ;
    global $lequiz_idnum ;
    $mark = $lequiz_trait["mark"] ;
    if ($lequiz_singular)          // il s'agit d'une page ou d'un article
       {if (!$deja)                // si $deja, il existe déjà un bloc avec la classe 'lequiz-bloc' 
           {if (strpos($unpost->post_content,"<" . $mark) === false)
               {return false ;}
             $p_content =  lequiz_trait_page($unpost->post_content ) ;
             $menub = '<div id="qz_navig">' ;
             $menub .= '<div style="display:inline-block;font-weight:bold"><a href="https://lequiz.calagenda.fr" title="Installez rapidement un quiz dans votre site Wordpress">Quizz</a></div>' ;
             $menub .= '<div style="display:inline-block;font-weight:bold">&nbsp;&nbsp;<a href="/lequiz-aide/" title="Aide pour utiliser ce quiz">Aide</a></div>' ;
             $menub .= '</div>' ;           
             $unpost->post_content = "<div class='lequiz-bloc'>" . $p_content . "</div>"  . $menub ; 
           }
           else
           {$lequiz_idnum = true ;}  // cas ou il existe déjà un bloc de classe 'lequiz-bloc' le traitement sera fait en javascript coté client
       }
        else              // il s'agit d'une liste
       {
       $reg_rep = "#<" . $mark . "(.*?)>(.*?)</" . $mark . ">#" ;
       $reg_by = "<span class='lequiz-cache'>????????</span>" ;
       $unpost->post_content = preg_replace($reg_rep,$reg_by, $unpost->post_content) ;  // pour certains thémes, par exemple Ocean WP
       $lequiz_filtre = true ; 
       //add_filter( 'the_content', function( $content ) 
       //  {global $lequiz_trait ;
       //  return preg_replace("#<" . $lequiz_trait["mark"] . "(.*?)>(.*?)</" . $lequiz_trait["mark"] . ">#", "<span class='lequiz-cache'>????????</span>" , $content) ;}, 0
       //  );       
        }
    return true ;    
} 

function lequiz_trait_un_post($content)
   {global $lequiz_filtre ;
    global $lequiz_trait ;
    if ($lequiz_filtre)
       {return preg_replace("#<" . $lequiz_trait["mark"] . "(.*?)>(.*?)</" . $lequiz_trait["mark"] . ">#", "<span class='lequiz-cache'>????????</span>" , $content) ;}
       else
       {return $content ;}
   }

function lequiz_trait_page ($docs)  // ajout d'un numéro d'id aux eléments réponses, et on cache le contenu pour les moteurs de recherche
{
global $lequiz_trait ; 
global $lequiz_tabrep ;
global $lequiz_tabnok ;
global $lequiz_idnum  ;

$q_code = $lequiz_trait["mark"] ;   // nom de l'élement réponse
$q_nok = $lequiz_trait["nok"] ; // nom de l'élement nok
   
if ((!class_exists("DOMDocument"))||(!function_exists("libxml_use_internal_errors"))||(!function_exists("libxml_clear_errors")))  // si la librairie libxml n'est pas chargée, le traitement sera fait en javascript coté client 
    {$lequiz_idnum = true ;
     return $docs ;}
$doch = new DOMDocument();
libxml_use_internal_errors(true);  // pour accepter les elements figure, figcaption ...
$retour = $doch->loadHTML('<?xml encoding="utf-8" ?>' . $docs, LIBXML_HTML_NOIMPLIED | LIBXML_HTML_NODEFDTD );
libxml_clear_errors();
//libxml_use_internal_errors(false);

$numq = 0 ;
$lescodes = $doch->getElementsByTagName($q_code);
foreach ($lescodes as $uncode) {

    $res = $doch->createElement($q_code);
    $res->setAttribute('id', 'qn_'. $numq);
    $res->setAttribute("onclick",'lequiz.q_clic(this)') ;
    $texte = "" ; // réponse juste ; 
    $textnok = "" ;  // réponses fausses
    foreach ($uncode->childNodes as $childcode)
             {if ($childcode->nodeName == $q_nok)
                 {$textnok .= lequiz_supvirgespe($childcode->textContent) . "," ;}
                 else
                 {$texte .= $childcode->textContent ;} 
             }
    $texte = lequiz_supvirgespe($texte)   ;      
    // $res->nodeValue = str_repeat("?", (strlen($texte)<10?10:strlen($texte))) ;
    $res->nodeValue = esc_html(lequiz_aleatoire($texte)) ;
    $uncode->parentNode->replaceChild($res, $uncode);
    $numq++ ;
    $lequiz_tabrep .=  "'" . esc_js(lequiz_brasser($texte)) . "',";  // réponse juste codée
    $lequiz_tabnok .=  "'" . esc_js(lequiz_brasser(lequiz_supvirgespe($textnok))) . "',";  // reponses fausses codées
    }
    
$lequiz_idnum = false ;
return $doch->saveHTML();
}
function lequiz_supvirgespe($texte)
  {
   $res = htmlentities($texte, null,'utf-8');
   $res = str_replace("&nbsp;"," ",$res);  // Remplace &nbsp; par un espace
   $res = str_replace('"',"'",$res);  // Remplace double guillemts par un simple 
   $res = html_entity_decode($res);  
   $res = trim($res ," ,\n\r\t\v\0")  ;  // supprime espaces, virgule, car d'échappement en début et fin de chaine
   $res = preg_replace("/,,+/",",",$res) ;  // remplace  suite de virgules par une seule
   $res = preg_replace("/\s\s+/"," ",$res) ;  // remplace suite d'espaces par un seul
  return $res ; }

function lequiz_aleatoire($texte)  // On enlève les accents, on trie et on  hache la réponse pour la cacher 
	{
			$search  = array('À', 'Á', 'Â', 'Ã', 'Ä', 'Å', 'Ç', 'È', 'É', 'Ê', 'Ë', 'Ì', 'Í', 'Î', 'Ï', 'Ò', 'Ó', 'Ô', 'Õ', 'Ö', 'Ù', 'Ú', 'Û', 'Ü', 'Ý', 'à', 'á', 'â', 'ã', 'ä', 'å', 'ç', 'è', 'é', 'ê', 'ë', 'ì', 'í', 'î', 'ï', 'ð', 'ò', 'ó', 'ô', 'õ', 'ö', 'ù', 'ú', 'û', 'ü', 'ý', 'ÿ');
			$replace = array('A', 'A', 'A', 'A', 'A', 'A', 'C', 'E', 'E', 'E', 'E', 'I', 'I', 'I', 'I', 'O', 'O', 'O', 'O', 'O', 'U', 'U', 'U', 'U', 'Y', 'a', 'a', 'a', 'a', 'a', 'a', 'c', 'e', 'e', 'e', 'e', 'i', 'i', 'i', 'i', 'o', 'o', 'o', 'o', 'o', 'o', 'u', 'u', 'u', 'u', 'y', 'y');
      $res = str_replace($search, $replace, $texte); 
      $q_tab_mot = str_split($res) ;
      sort($q_tab_mot) ;
      $res = implode("",$q_tab_mot) ;
      if (strlen($res) > 2)
        {$res = substr($res,1,1) . substr($res,0,1) .  substr($res,2) ;}
      $res = lequiz_brasser($res) ;  
      $res = str_replace(" ","&nbsp;", $res) ;  
			return $res ;
		}  
function lequiz_brasser($texte)  // On "hache" les caractères de la réponse pour les cacher
    {
    $search  = array('a','b','c','d','e','g','h','j','k','m','n','o','q','r','n','u','v','w','y','A','B','C','D','E','G','H','J','K','M','N','O','Q','R','N','U','V','W','Y') ;
    $replace = array('b','a','r','q','u','o','n','k','j','w','h','g','d','c','h','e','y','m','v','B','A','R','Q','U','O','N','K','J','W','H','G','D','C','H','E','Y','M','V') ;
    $res = "" ;
    for ($i=0;$i<strlen($texte);$i++)
        {$rescar = substr($texte,$i,1) ;
         $resnum = 0;
         foreach ($search as $unsearch)
            {if ($unsearch == $rescar)
                {$rescar = $replace[$resnum] ;
                 break ;}
             $resnum++ ;    
            }
        $res .= $rescar ;    
        }
    return $res ;
    }		
   
      

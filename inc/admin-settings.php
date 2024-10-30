<?php

// page de personnalisation du module d'administration Wordpress

add_action( 'admin_init', 'lequiz_options' );

function lequiz_options(){
    
     
    register_setting( 
        'lequiz',                  // Settings group. Custom or existing (e.g. 'general')
        'lequiz_options',          // Setting name
        'lequiz_options_sanitize'  // Sanitize callback. Must be custom here, since we're going to store an array of settings.
    );
    
    // Register a section in our top level page, to house our group of settings
    add_settings_section( 
        'lequiz_top_section',          // Section ID
         "Définition des options pour le gestionnaire",   // Title
        'lequiz_top_section_display',  // Callback if you need to display something special in your section. If not, you can pass in an empty string.
        'lequiz_top_level_settings_page'             // Page to display the section in.
    );

    // Register a section in our top level page, to house our group of settings
    add_settings_section( 
        'lequiz_options_section',          // Section ID
         "Définition des options par défaut pour l'internaute",   // Title
        'lequiz_options_section_display',  // Callback if you need to display something special in your section. If not, you can pass in an empty string.
        'lequiz_top_level_settings_page'             // Page to display the section in.
    );

    // Registers article
    add_settings_field( 
        'article',                             // Field ID
        'Sélecteur des articles et pages',            // Title
        'lequiz_options_article',    // Callback
        'lequiz_top_level_settings_page',                // Page
        'lequiz_top_section',              // Section
        array( 
            'label_for' => 'lequiz_article',  // Id for the input and label element.
        )
    );

    // Registers mark
    add_settings_field( 
        'mark',             // Field ID
        'Style (balise) de la réponse',             // Title
        'lequiz_options_mark',   // Callback
        'lequiz_top_level_settings_page',        // Page
        'lequiz_top_section',                // Section
        array(
            'options' => array(
                'code' =>  'Code <code>',
                'sup' =>  'Exposant <sup>', 
                'sub' =>  'Indice <sub>', 
                'b' =>  'Gras <b>', 
                'strong' =>  'Gras <strong>', 
                'i' =>  'Italique <i>', 
                'em' =>  'Italique <em>',
                'mark' =>  'Surligner <mark>', 
                'u' =>  'Souligner <u>',
            ),
        )
    );
    
    // Registers nok
    add_settings_field( 
        'nok',             // Field ID
        'Style (balise) des réponses fausses',             // Title
        'lequiz_options_nok',   // Callback
        'lequiz_top_level_settings_page',        // Page
        'lequiz_top_section',                // Section
        array(
            'options' => array(
                's' =>  'Barré <s>',
                'del' =>  'Barré <del>',
                'span' =>  'Barré <span>',
                'sup' =>  'Exposant <sup>', 
                'sub' =>  'Indice <sub>', 
            ),
        )
    );
    
    

    // Registers defaut
    add_settings_field( 
        'defaut',             // Field ID
        'Affichage par défaut',             // Title
        'lequiz_options_defaut',   // Callback
        'lequiz_top_level_settings_page',        // Page
        'lequiz_top_section',                // Section
        array(
            'options' => array(
                'quiz' =>  'Page de quiz',
                'reponse' =>  'Page des réponses', 
            ),
        )
    );

    // Registers persist
    add_settings_field( 
        'persist',                           // Field ID
         'Affichage persistant',           // Title
        'lequiz_options_persist',          // Callback
        'lequiz_top_level_settings_page',                  // Page
        'lequiz_top_section',                // Section
        array( 
            'label_for' => 'persist',  // Id for the input and label element.
        )
    );
    
    // Registers lien reponse
    add_settings_field( 
        'lienreponse',                             // Field ID
        'Texte du lien sur la page des réponses',            // Title
        'lequiz_options_lienreponse',    // Callback
        'lequiz_top_level_settings_page',                // Page
        'lequiz_top_section',              // Section
        array( 
            'label_for' => 'lequiz_lienreponse',  // Id for the input and label element.
        )
    );

    // Registers lien quiz
    add_settings_field( 
        'lienquiz',                             // Field ID
        'Texte du lien sur la page de quiz',            // Title
        'lequiz_options_lienquiz',    // Callback
        'lequiz_top_level_settings_page',                // Page
        'lequiz_top_section',              // Section
        array( 
            'label_for' => 'lequiz_lienquiz',  // Id for the input and label element.
        )
    );

    // Registers type immediat, qcm ou clavier 
    add_settings_field( 
        'type',             // Field ID
        'Type de quiz',             // Title
        'lequiz_options_type',   // Callback
        'lequiz_top_level_settings_page',        // Page
        'lequiz_options_section',                // Section
        array(
            'options' => array(
                '0' =>  'Affichage immédiat', 
                '1' =>  'Souris : jokers et QCM', 
                '2' =>  'Jokers et saisie au clavier', 
            ),
        )
    );

    // Registers sablier
    add_settings_field( 
        'sablier',             // Field ID
        'Sablier',             // Title
        'lequiz_options_sablier',   // Callback
        'lequiz_top_level_settings_page',        // Page
        'lequiz_options_section',                // Section
        array(
            'options' => array(
                '0' =>  'Pas de sablier', 
                '10000' =>  '10 secondes', 
                '15000' =>  '15 secondes', 
                '20000' =>  '20 secondes', 
                '25000' =>  '25 secondes', 
                '30000' =>  '30 secondes', 
                '35000' =>  '35 secondes', 
                '40000' =>  '40 secondes', 
            ),
        )
    );
    
    // Registers affichage préalable 
    add_settings_field( 
        'af',             // Field ID
        'Affichage préalable',             // Title
        'lequiz_options_af',   // Callback
        'lequiz_top_level_settings_page',        // Page
        'lequiz_options_section',                // Section
        array(
            'options' => array(
                '0' =>  'Aucun', 
                '1' =>  'Premier caractère', 
                '2' =>  'Anagramme', 
            ),
        )
    );
    
    // Registers couleurs
    add_settings_field( 
        'color',             // Field ID
        'Couleurs',             // Title
        'lequiz_options_color',   // Callback
        'lequiz_top_level_settings_page',        // Page
        'lequiz_options_section',                // Section
        array(
            'options' => array(
                'soutenu' =>  'Soutenu', 
                'pastel' =>  'Pastel', 
            ),
        )
    );

    // Registers animation graphique
    add_settings_field( 
        'anim',             // Field ID
        'Animation',             // Title
        'lequiz_options_anim',   // Callback
        'lequiz_top_level_settings_page',        // Page
        'lequiz_options_section',                // Section
        array(
            'options' => array(
                '0' =>  'Aucune', 
                '0.5' =>  'Trés rapide', 
                '1' =>  'Rapide',
                '2' =>  'Normale',
                '3' =>  'Lente', 
            ),
        )
    );
    
    // Registers jokers
    add_settings_field( 
        'jokers',             // Field ID
        'Les jokers par défaut',             // Title
        'lequiz_options_jokers',   // Callback
        'lequiz_top_level_settings_page',        // Page
        'lequiz_options_section',                // Section
        array(
            'options' => array(
                '1' =>  'Aucun', 
                '2' =>  "'Montrer un mot' et 'Un caratère'", 
                '3' =>  'Tous',
            ),
        )
    );

    // Registers aide interactive
    add_settings_field( 
        'aide',             // Field ID
        'Aide interactive',             // Title
        'lequiz_options_aide',   // Callback
        'lequiz_top_level_settings_page',        // Page
        'lequiz_options_section',                // Section
        array(
            'options' => array(
                '1' =>  'Activée', 
                '0' =>  'Désactivée', 
            ),
        )
    );

}

function lequiz_top_section_display( $args ){
    ?>
    <img src="<?php echo esc_url(plugins_url('img/logo.jpg',dirname(__FILE__)))?>" style="width:128px;float:left;padding:10px;" /> 
    <p>Aprés installation de l'extention, le gestionnaire peut facilement créer un quiz : dans l'éditeur, il suffit de créer un paragraphe par question/réponse, et d'appliquer un style particulier, via la balise définie ci-dessous, à la réponse.</p>    
    <?php
    $args = array(
        'name'        => 'lequiz-aide',
        'post_type'   => 'page',
        'post_status' => 'publish',
        'numberposts' => 1
      );
    $my_posts = get_posts($args);
    if ($my_posts) 
        { ?><p>La page "Aide à l'utilisation du Quiz", destinée à l'internaute, est modifiable par le gestionnaire. Ne supprimez pas cette page.</p> <?php }
    $settings = get_option( 'lequiz_options' );
    $value = ($settings===false?"":$settings['article']) ;
    $value = ($value==""?"main .category-le-quiz, section-quiz":$value) ;
    if (($value == "main .category-le-quiz, section-quiz") && (get_category_by_slug("le-quiz")!=null))
       { ?><p>Créez un ou plusieurs articles contenant vos questions réponses, et placez les dans la catégorie 'Le Quiz'.</p> <?php }
    ?>
    <p>Les options ci-dessous permettent au gestionnaire de modifier les options par défaut du fonctionnement du quizz.</p> 
    <p><b>Dans un premier temps, je vous recommande de tester votre quiz sans modifier ces options, qui sont adaptées à la plupart des besoins.</b></p> 
    <a href='https://lequiz.calagenda.fr/installer-le-quiz/' target='_blank'>En savoir plus</a>
    <?php 
}

function lequiz_options_section_display( $args ){
    ?>
    <p>L'extension 'Le Quiz' est aussi personnalisable pour l'internaute, qui peut choisir plusieurs options : QCM ou clavier, sablier, couleurs, animation, jokers automatiques...</p>
    <p>Les options ci-dessous permettent au gestionnaire du site de modifier celles proposées par défaut à l'internaute.</p>
    <?php  
}

function lequiz_options_article( $args ){
    $settings = get_option( 'lequiz_options' );
    $value = ($settings===false?"":$settings['article']) ;
    $value = ($value==""?"main .category-le-quiz, .section-quiz":$value) ;
    ?>
        <input id="<?php esc_attr_e( $args['label_for'] ); ?>" class="regular-text" type="text" name="lequiz_options[article]" value="<?php esc_attr_e( $value ); ?>">
        <br>Par défaut, avec la valeur "main .category-le-quiz, .section-quiz" le quiz sera opérationnel sur tous les articles catégorisés dans 'Le Quiz' (<mark>nom du slug : le-quiz</mark>), 
        ainsi que sur les pages dont au moins un bloc contient la 'Classe CSS additionnelle' <mark>lequiz-bloc</mark>. 
        <br>Pour apppliquer le quiz à toutes les pages et tous les aricles du site, saisir la valeur "<mark>main article</mark>".
        <br>Le gestionnaire peut aussi appliquer le quiz à tous les articles (valeur "<mark>main .type-post</mark>", ou à toutes les pages (valeur "<mark>main .type-page</mark>"),
        <br>ou a plusieurs catègories d'articles : <a href='https://lequiz.calagenda.fr/article/' target='_blank'>en savoir plus</a>  
    <?php
}

function lequiz_options_mark( $args ){
    $settings  = get_option( 'lequiz_options' );
    $selected = ($settings===false?"code":$settings['mark']) ;
    ?>
        <select name="lequiz_options[mark]">
            <!-- I'm getting values from passed in array of options here, for a change. -->
            <?php foreach ( $args['options'] as $value => $label ) : ?>
                <option value="<?php esc_attr_e( $value ); ?>" <?php selected( $selected, $value ); ?>><?php esc_html_e( $label ); ?></option>
            <?php endforeach; ?>
        </select>
        <br>Il s'agit de l'élément qui contiendra la réponse. Le Code en ligne (&lt;code&gt;) est facilement accessible avec l'éditeur par défaut de WordPress. 
        <br><a href='https://lequiz.calagenda.fr/balise/' target='_blank'>En savoir plus</a>  
    <?php
}

function lequiz_options_nok( $args ){
    $settings  = get_option( 'lequiz_options' );
    $selected = ($settings===false?"s":$settings['nok']) ;
    ?>
        <select name="lequiz_options[nok]">
            <!-- I'm getting values from passed in array of options here, for a change. -->
            <?php foreach ( $args['options'] as $value => $label ) : ?>
                <option value="<?php esc_attr_e( $value ); ?>" <?php selected( $selected, $value ); ?>><?php esc_html_e( $label ); ?></option>
            <?php endforeach; ?>
        </select>
        <br>Il s'agit de l'élément qui contiendra les réponses fausses, dans le cas ou le gestionnaire souhaite définir lui-même le QCM, au lieu d'utiliser le QCM automatique.
        <br>Si vous ne connaissez pas l'élement correspondant à votre éditeur, tester avec chacune des valeurs.   
        <br><a href='https://lequiz.calagenda.fr/balise/' target='_blank'>En savoir plus</a>  
    <?php
}




function lequiz_options_defaut( $args ){
    $settings  = get_option( 'lequiz_options' );
    $selected = ($settings===false?"quiz":$settings['defaut']) ;
    ?>
        <select name="lequiz_options[defaut]">
            <!-- I'm getting values from passed in array of options here, for a change. -->
            <?php foreach ( $args['options'] as $value => $label ) : ?>
                <option value="<?php esc_attr_e( $value ); ?>" <?php selected( $selected, $value ); ?>><?php esc_html_e( $label ); ?></option>
            <?php endforeach; ?>
        </select>
        <br>Il s'agit de la page qui sera affichée la première fois que l'internaute arrivera sur la page
    <?php
}

function lequiz_options_persist( $args ){
    $settings = get_option( 'lequiz_options' );
    $checked = ($settings===false?"":(isset($settings['persist'])?($settings['persist']=="on"?" checked":""):"")) ;
    ?>
        <input id="<?php esc_attr_e( $args['label_for'] ); ?>" type="checkbox" name="lequiz_options[persist]" <?php esc_attr_e($checked ); ?>>
        <span>"<b>Si cette case est décochée</b>, toute nouvelle page affichée sera celle définie comme affichage par défaut (quizz ou réponse).<br><b>Si cette case est cochée</b>, les pages de quiz seront affichées tant que l'internaute n'a pas demandé une page de réponse, et inversement, les réponses seront affichées tant que l'internaute n'a pas demandé un quiz"</span>
    <?php
}

function lequiz_options_lienreponse( $args ){
    $settings = get_option( 'lequiz_options' );
    $value = ($settings===false?"Voir les réponses":$settings['lienreponse']) ;
    ?>
        <input id="<?php esc_attr_e( $args['label_for'] ); ?>" class="regular-text" type="text" name="lequiz_options[lienreponse]" value="<?php esc_attr_e( $value ); ?>">
        <br>Il s'agit du lien sur la page des réponses, présent sur la page de quiz. Si ce champ est vide, les réponses ne seront accessibles qu'en effectuant le quiz.
    <?php
}

function lequiz_options_lienquiz( $args ){
    $settings = get_option( 'lequiz_options' );
    $value = ($settings===false?"Afficher le quiz":$settings['lienquiz']) ;
    ?>
        <input id="<?php esc_attr_e( $args['label_for'] ); ?>" class="regular-text" type="text" name="lequiz_options[lienquiz]" value="<?php esc_attr_e( $value ); ?>">
        <br>Il s'agit du lien sur la page de quiz, présent sur la page des réponses. Attention : si ce champ est vide, le quiz ne sera pas accessible.
    <?php
}

function lequiz_options_type( $args ){
    $settings  = get_option( 'lequiz_options' );
    $selected = ($settings===false?"1":$settings['type']) ;
    ?>
        <select name="lequiz_options[type]">
            <!-- I'm getting values from passed in array of options here, for a change. -->
            <?php foreach ( $args['options'] as $value => $label ) : ?>
                <option value="<?php esc_attr_e( $value ); ?>" <?php selected( $selected, $value ); ?>><?php esc_html_e( $label ); ?></option>
            <?php endforeach; ?>
        </select>
    <?php
    }
    
function lequiz_options_sablier( $args ){
    $settings  = get_option( 'lequiz_options' );
    $selected = ($settings===false?"30000":$settings['sablier']) ;
    ?>
        <select name="lequiz_options[sablier]">
            <!-- I'm getting values from passed in array of options here, for a change. -->
            <?php foreach ( $args['options'] as $value => $label ) : ?>
                <option value="<?php esc_attr_e( $value ); ?>" <?php selected( $selected, $value ); ?>><?php esc_html_e( $label ); ?></option>
            <?php endforeach; ?>
        </select>
    <?php
    }
    
function lequiz_options_af( $args ){
    $settings  = get_option( 'lequiz_options' );
    $selected = ($settings===false?"0":$settings['af']) ;
    ?>
        <select name="lequiz_options[af]">
            <!-- I'm getting values from passed in array of options here, for a change. -->
            <?php foreach ( $args['options'] as $value => $label ) : ?>
                <option value="<?php esc_attr_e( $value ); ?>" <?php selected( $selected, $value ); ?>><?php esc_html_e( $label ); ?></option>
            <?php endforeach; ?>
        </select>
    <?php
    }
    
function lequiz_options_color( $args ){
    $settings  = get_option( 'lequiz_options' );
    $selected = ($settings===false?"soutenu":$settings['color']) ;
    ?>
        <select name="lequiz_options[color]">
            <!-- I'm getting values from passed in array of options here, for a change. -->
            <?php foreach ( $args['options'] as $value => $label ) : ?>
                <option value="<?php esc_attr_e( $value ); ?>" <?php selected( $selected, $value ); ?>><?php esc_html_e( $label ); ?></option>
            <?php endforeach; ?>
        </select>
    <?php
    }
    
function lequiz_options_anim( $args ){
    $settings  = get_option( 'lequiz_options' );
    $selected = ($settings===false?"2":$settings['anim']) ;
    ?>
        <select name="lequiz_options[anim]">
            <!-- I'm getting values from passed in array of options here, for a change. -->
            <?php foreach ( $args['options'] as $value => $label ) : ?>
                <option value="<?php esc_attr_e( $value ); ?>" <?php selected( $selected, $value ); ?>><?php esc_html_e( $label ); ?></option>
            <?php endforeach; ?>
        </select>
    <?php
    }
    
function lequiz_options_jokers( $args ){
    $settings  = get_option( 'lequiz_options' );
    $selected = ($settings===false?"2":$settings['jokers']) ;
    ?>
        <select name="lequiz_options[jokers]">
            <!-- I'm getting values from passed in array of options here, for a change. -->
            <?php foreach ( $args['options'] as $value => $label ) : ?>
                <option value="<?php esc_attr_e( $value ); ?>" <?php selected( $selected, $value ); ?>><?php esc_html_e( $label ); ?></option>
            <?php endforeach; ?>
        </select>
    <?php
    }
    
function lequiz_options_aide( $args ){
    $settings  = get_option( 'lequiz_options' );
    $selected = ($settings===false?"1":$settings['aide']) ;
    ?>
        <select name="lequiz_options[aide]">
            <!-- I'm getting values from passed in array of options here, for a change. -->
            <?php foreach ( $args['options'] as $value => $label ) : ?>
                <option value="<?php esc_attr_e( $value ); ?>" <?php selected( $selected, $value ); ?>><?php esc_html_e( $label ); ?></option>
            <?php endforeach; ?>
        </select>
        <br>Utile pour les débutants, l'aide interactive peut être désactivée.
    <?php
    }

/**
 * Sanitize callback for our settings.
 * 
 */
function lequiz_options_sanitize( $settings ){
    // Sanitizes the fields
    $settings['mark']   = ! empty( $settings['mark'] ) ? sanitize_key( $settings['mark'] ) : 'code' ;
    $settings['nok']   = ! empty( $settings['nok'] ) ? sanitize_key( $settings['nok'] ) : 's' ;
    $settings['defaut']   = ! empty( $settings['defaut'] ) ? sanitize_key( $settings['defaut'] ) : 'quiz' ;
    $settings['lienreponse'] = ! empty( $settings['lienreponse'] ) ? sanitize_text_field( $settings['lienreponse'] ) : '';
    $settings['lienquiz'] = ! empty( $settings['lienquiz'] ) ? sanitize_text_field( $settings['lienquiz'] ) : '';
    $settings['article'] = ! empty( $settings['article'] ) ? sanitize_text_field( $settings['article'] ) : 'main .category-le-quiz, section-quiz';
    $settings['sablier']   = ! empty( $settings['sablier'] ) ? sanitize_key( $settings['sablier'] ) : '0' ;
    
    return $settings;
}

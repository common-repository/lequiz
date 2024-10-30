<?php
defined( 'ABSPATH' ) || die();


/******************************
 * Setting up the admin pages
 ******************************/
add_action( 'admin_menu', 'lequiz_menu_items' );
/**
 * Registers our new menu items
 */
function lequiz_menu_items() {

    // `add_menu_page()` creates a top-level menu item.
    $page_hookname = add_menu_page(
        'Le Quiz', // Page title
         'Le Quiz', // Menu title
        'manage_options',                                        // Capabilities
        'lequiz_top_level_settings_page',          // Slug
        'lequiz_top_level_page_callback',          // Display callback
        'dashicons-carrot',                                      // Icon
        66                                                       // Priority/position. Just after 'Plugins'
    );

    // `add_submenu_page()` creates a sub-menu item.
    $subpage_hookname = add_submenu_page(
        'options-general.php',                                   // Parent slug
         'Le Quiz' , // Page title
         'Le Quiz' , // Menu title
        'manage_options',                                        // Capabilities
        'lequiz_sub_level_settings_page',          // Slug
        'lequiz_sub_level_page_callback',          // Display callback
        10                                                       // Priority/position.
    );

    // `add_menu_page()` and `add_submenu_page()` return a menu slug you can use as a hook
    // e.g. add_action( 'load-' . $hookname, 'lequiz_my_function' );
}

/**
 * Displays our top level page content
 */
function lequiz_top_level_page_callback(){
    ?>
        <div class="wrap">
            <!-- Displays the title -->
            <h1><?php esc_html_e( get_admin_page_title() ); ?></h1>
            <!-- The form must point to options.php -->
            <form action="options.php" method="POST">
                <?php 
                    // Output the necessary hidden fields : nonce, action, and option page name
                    settings_fields( 'lequiz' );
                    // Loops through registered sections and fields for the page slug passed in, and display them.
                    do_settings_sections( 'lequiz_top_level_settings_page' );
                    // Displays a submit button
                    submit_button();
                ?>
            </form>
        </div>
    <?php
}

/**
 * Displays our sub level page content
 * For this example, the subpage displays exactly the same page content.
 */
function lequiz_sub_level_page_callback(){
    ?>
        <div class="wrap">
            <!-- Displays the title -->
            <h1><?php esc_html_e( get_admin_page_title() ); ?></h1>
            <!-- The form must point to options.php -->
            <form action="options.php" method="POST">
                <?php 
                    // It is absolutely possible to display the same settings on another page.
                    // Here the page displays the same settings as the main page.
                    settings_fields( 'lequiz' );
                    do_settings_sections( 'lequiz_top_level_settings_page' );
                    submit_button();
                ?>
            </form>
        </div>
    <?php
}